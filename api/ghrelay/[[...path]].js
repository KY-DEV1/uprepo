// Vercel Serverless Function: /api/ghrelay
// CORS relay untuk GitHub OAuth Device Flow (hanya 2 endpoint GitHub, method POST)
// Deploy: letakkan file ini di folder api/ pada project Vercel kamu (minekeneko.my.id)

const ALLOWED_HOSTS = ["github.com"];
const ALLOWED_PATHS = ["/login/device/code", "/login/oauth/access_token"];

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  // Path tujuan: /api/ghrelay/<path>
  const targetPath = "/" + (req.query.path || "").replace(/^\/+/, "");
  if (!ALLOWED_PATHS.includes(targetPath)) {
    return res.status(400).json({ error: "path not allowed" });
  }

  try {
    const body = await new Promise((resolve) => {
      let data = "";
      req.on("data", (c) => (data += c));
      req.on("end", () => resolve(data));
    });

    const upstream = await fetch("https://github.com" + targetPath, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "User-Agent": "uprepo-relay",
      },
      body,
    });

    const text = await upstream.text();
    res.status(upstream.status).send(text);
  } catch (e) {
    res.status(502).json({ error: "relay failed: " + e.message });
  }
}
