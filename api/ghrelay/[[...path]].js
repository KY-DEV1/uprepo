// Vercel Serverless Function: /api/ghrelay?target=device  (atau target=token)
// CORS relay untuk GitHub OAuth Device Flow (hanya 2 endpoint GitHub, method POST)
// Catatan: path multi-segment (/api/ghrelay/a/b) tidak dirouting Vercel ke catch-all,
// jadi target endpoint dikirim lewat query param.

const ALLOWED = {
  device: "https://github.com/login/device/code",
  token: "https://github.com/login/oauth/access_token",
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const target = ALLOWED[req.query.target];
  if (!target) return res.status(400).json({ error: "target must be 'device' or 'token'" });

  try {
    const body = await new Promise((resolve) => {
      let data = "";
      req.on("data", (c) => (data += c));
      req.on("end", () => resolve(data));
    });

    const upstream = await fetch(target, {
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
