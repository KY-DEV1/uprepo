# UpRepo 🚀

**Push file langsung ke repo GitHub dari browser — tanpa `git`, tanpa install apapun.**

UpRepo adalah web app satu file (`index.html`) yang berjalan 100% di browser kamu. Tidak ada server perantara, tidak ada data yang dikirim ke mana pun selain `api.github.com`.

## ✨ Fitur

- 📄 **Push satu file** ke repo GitHub mana pun via Personal Access Token
- 🗜️ **Auto-extract ZIP** — upload `.zip` dan seluruh isinya jadi **satu commit** (bisa dimatikan via checkbox kalau mau file .zip mentah)
- 🆕 **Auto-create repo** — kalau repo belum ada, langsung dibuat otomatis (private/public, pilih sendiri)
- 🔀 **Git Data API penuh** — alur `blob → tree → commit → ref`, persis seperti `git push` di terminal
- 🛡️ **Anti-junk** — file sistem (`__MACOSX/`, `.DS_Store`, `Thumbs.db`) otomatis dilewati dari zip
- 📋 **Copy link hasil** — sekali klik untuk copy URL file yang barusan di-push
- 📺 **Console realtime** — tiap langkah push ditampilkan seperti terminal
- 🔒 **Privasi total** — token hanya dipakai di browser, nggak pernah dikirim ke tempat lain

## 🚀 Cara Pakai

1. Buka `index.html` di browser (atau host via GitHub Pages)
2. Buat [Personal Access Token](https://github.com/settings/personal-access-tokens/new):
   - **Fine-grained** → izin `Contents: Read and write`
   - **Classic** → scope `repo` (wajib classic kalau mau fitur buat repo baru di akun pribadi)
3. Isi token, tujuan repo (`owner/nama-repo`), branch, path, dan commit message
4. Seret file (atau klik untuk pilih) → klik **Push ke GitHub**
5. Selesai! Link file langsung muncul di console ✅

> 💡 **Tips Android:** kalau pilih file `.zip` lewat file manager (ZArchiver, MT Manager, dll), jangan buka arsipnya dulu — pilih dari folder Downloads langsung supaya yang ke-pick file .zip-nya sendiri, bukan isinya.

## 🛠️ Teknologi

| | |
|---|---|
| Stack | HTML + CSS + vanilla JS (satu file) |
| ZIP handling | [JSZip 3.10.1](https://stuk.github.io/jszip/) |
| API | [GitHub Git Data API](https://docs.github.com/en/rest/git) + Contents API |
| Hosting siap | GitHub Pages / Netlify / Vercel — tinggal upload |

## 🩹 Changelog Perbaikan

- **v2 — Repo Browser** — list, lihat, edit, simpan & hapus file langsung dari browser (Contents API), dengan breadcrumb navigasi folder
- **XSS via nama file** — nama file dari zip sekarang di-escape sebelum dirender (dulu raw `innerHTML`)
- **Rate limit GitHub** — pembuatan blob dibatch 8 file/batch (dulu semua paralel → 403 abuse detection di zip besar)
- **Error handling** — semua fetch diberi try/catch + pesan error yang jelas di console
- **Reset form** — ganti file sekarang membersihkan path, commit message, dan diffbar
- **Deteksi zip palsu** — file `.zip` yang sebenarnya bukan arsip (hasil pick dari dalam file manager) dideteksi via signature `PK`
- **Empty repo** — commit pertama di repo kosong otomatis via Contents API, sisanya lanjut Git Data API

## 📄 License

MIT
