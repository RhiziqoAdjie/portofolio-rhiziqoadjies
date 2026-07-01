# Portfolio — Rhiziqo Adjie Syahputra

Website portfolio one-page (Home, About, Experience, Projects, Certificate, Contact)
dibangun dengan **HTML, CSS, JavaScript murni** (tanpa framework/build tool), jadi
bisa langsung di-deploy ke **Vercel** tanpa konfigurasi rumit.

> Catatan PHP: Vercel tidak menjalankan PHP. Semua bagian yang biasanya "dinamis"
> (project, sertifikat, experience, ganti bahasa) sudah dibuat dinamis lewat
> JavaScript + file `assets/js/data.js`, jadi kamu tetap bisa update konten
> tanpa edit HTML, persis seperti tujuan pakai PHP.

---

## 1. Struktur Folder

```
portfolio/
├── index.html                  ← halaman utama (semua section)
├── vercel.json                 ← konfigurasi deployment Vercel
├── README.md
└── assets/
    ├── css/
    │   └── style.css           ← semua styling + animasi + dark mode
    ├── js/
    │   ├── data.js             ← DATA: projects, certificate, experience, bahasa
    │   └── main.js              ← semua logic interaktif
    ├── img/
    │   ├── profile.jpg          ← foto hero (ganti dengan fotomu)
    │   ├── about.jpg            ← foto section About
    │   ├── projects/             ← simpan screenshot project di sini
    │   └── certificates/         ← simpan scan sertifikat di sini
    └── cv-rhiziqo.pdf            ← file CV untuk tombol "Unduh CV"
```

---

## 2. Setup di Komputer (Windows, folder di Drive D)

1. Buka **File Explorer**, masuk ke Drive `D:`.
2. Buat folder baru, misal `D:\Project\portfolio`.
3. Ekstrak/salin semua file yang saya berikan ke dalam folder tersebut, sehingga
   strukturnya sama seperti di atas (file `index.html` ada langsung di
   `D:\Project\portfolio\index.html`, bukan di dalam subfolder lagi).
4. Buka folder tersebut dengan **VS Code** (`code .` di terminal, atau klik kanan
   "Open with VS Code").

### Menjalankan secara lokal

Karena ini website statis, kamu **tidak butuh PHP/XAMPP** untuk menjalankannya.
Cara termudah, pakai extension **Live Server** di VS Code:

1. Install extension "Live Server" (oleh Ritwick Dey) dari VS Code Marketplace.
2. Klik kanan pada `index.html` → **"Open with Live Server"**.
3. Browser otomatis terbuka di `http://127.0.0.1:5500` (atau port lain) dan akan
   auto-reload setiap kamu menyimpan perubahan.

Alternatif tanpa extension (kalau ada Python/Node terinstall):
```bash
# masuk ke folder project dulu
cd D:\Project\portfolio

# jika ada Python
python -m http.server 5500

# atau jika ada Node.js
npx serve .
```
Lalu buka `http://localhost:5500` di browser.

---

## 3. Ganti Konten Pribadi

| Yang diganti              | Lokasi                                   |
|----------------------------|-------------------------------------------|
| Foto hero & about          | `assets/img/profile.jpg`, `assets/img/about.jpg` (nama file harus sama, atau ubah path di `index.html`) |
| Nama, deskripsi, email, no HP | langsung di `index.html` (cari teksnya, gunakan Ctrl+F) |
| Link sosial media           | atribut `href` di `<div class="social-rail">` dan section Contact, `index.html` |
| CV PDF                      | ganti file `assets/cv-rhiziqo.pdf` dengan CV milikmu (nama file sama) |
| Warna tema                  | edit variabel di paling atas `assets/css/style.css` (`:root { --accent: ... }`) |

---

## 4. Menambah Project / Sertifikat / Experience Baru

Semua data ada di **satu file**: `assets/js/data.js`. Tidak perlu edit HTML/CSS sama sekali.

### Tambah Project baru
Buka `assets/js/data.js`, cari array `PROJECTS`, lalu tambahkan blok baru:

```js
{
  title: "Nama Project Baru",
  category: "web",              // bebas, dipakai untuk tombol filter
  desc: "Deskripsi singkat project ini.",
  image: "assets/img/projects/project-5.jpg",
  tags: ["React", "Node.js"],
  demo: "https://link-demo-kamu.com",
  code: "https://github.com/username/repo"
},
```
Simpan gambar project di `assets/img/projects/project-5.jpg` (ukuran disarankan 1200x750px / rasio 16:10).

### Tambah Sertifikat baru
Cari array `CERTIFICATES`, tambahkan:
```js
{
  title: "Nama Sertifikat",
  issuer: "Nama Penyelenggara",
  date: "2026",
  image: "assets/img/certificates/cert-5.jpg"
},
```
Simpan gambar sertifikat di `assets/img/certificates/cert-5.jpg`.

### Tambah Experience / Pendidikan baru
Cari array `EXPERIENCE`, tambahkan:
```js
{
  year: "2026 - Sekarang",
  title: "Jabatan / Gelar",
  place: "Nama Perusahaan / Sekolah",
  desc: "Penjelasan singkat tanggung jawab atau pencapaian.",
  icon: "fa-solid fa-briefcase"
},
```

Setelah disimpan, refresh browser — konten baru otomatis muncul, lengkap dengan animasi yang sama seperti card lainnya.

---

## 5. Setup Form Contact (Kirim Email Tanpa PHP)

Form contact memakai **Formspree** (gratis, tanpa backend):

1. Buka [formspree.io](https://formspree.io), daftar gratis.
2. Buat form baru, kamu akan mendapat endpoint seperti:
   `https://formspree.io/f/abcd1234`
3. Buka `index.html`, cari:
   ```html
   <form class="contact-form" id="contactForm" action="https://formspree.io/f/REPLACE_WITH_YOUR_ID" method="POST">
   ```
4. Ganti `REPLACE_WITH_YOUR_ID` dengan ID kamu.
5. Selesai — pesan dari form akan masuk ke email yang kamu daftarkan di Formspree.

(Alternatif lain: EmailJS, Web3Forms — caranya serupa.)

---

## 6. Deploy ke Vercel

### Opsi A — Lewat Vercel CLI (disarankan, paling cepat)

1. Install Node.js dari [nodejs.org](https://nodejs.org) kalau belum ada.
2. Buka terminal di folder project:
   ```bash
   cd D:\Project\portfolio
   ```
3. Install Vercel CLI (sekali saja, global):
   ```bash
   npm install -g vercel
   ```
4. Login ke Vercel:
   ```bash
   vercel login
   ```
5. Deploy:
   ```bash
   vercel
   ```
   Ikuti pertanyaan yang muncul (pilih default semua juga aman untuk static site ini).
6. Setelah selesai, kamu akan dapat URL preview. Untuk publish ke domain production:
   ```bash
   vercel --prod
   ```

### Opsi B — Lewat GitHub + Vercel Dashboard (lebih mudah untuk update berkala)

1. Buat repository baru di GitHub, misal `portfolio`.
2. Di folder project, jalankan:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - portfolio website"
   git branch -M main
   git remote add origin https://github.com/username/portfolio.git
   git push -u origin main
   ```
3. Buka [vercel.com](https://vercel.com), login dengan akun GitHub.
4. Klik **"Add New" → "Project"**, pilih repository `portfolio` yang baru dibuat.
5. Framework Preset: pilih **"Other"** (karena ini static HTML biasa).
6. Klik **Deploy**. Tunggu sebentar, website langsung online.
7. Setiap kali kamu `git push` perubahan baru, Vercel otomatis re-deploy.

### Custom Domain (opsional)
Di dashboard Vercel → project kamu → **Settings → Domains** → masukkan domain yang sudah kamu beli, ikuti instruksi DNS yang diberikan.

---

## 7. Kalau Suatu Saat Memang Perlu PHP Sungguhan

Vercel tidak menjalankan PHP. Kalau ke depannya kamu butuh fitur server-side PHP betulan
(misalnya simpan data pesan ke database MySQL), kamu perlu pindah hosting bagian backend-nya
ke shared hosting yang support PHP, contoh: **Hostinger**, **Niagahoster**, **000webhost**,
atau **InfinityFree**. Frontend (HTML/CSS/JS) tetap bisa di Vercel, lalu form contact tinggal
diarahkan (`action="https://domain-hosting-php-kamu.com/kirim.php"`) ke endpoint PHP di hosting
tersebut. Tapi untuk kebutuhan portfolio standar, pendekatan Formspree di atas sudah cukup dan
lebih simpel.

---

## 8. Checklist Sebelum Publish

- [ ] Ganti semua foto placeholder dengan foto asli
- [ ] Ganti email, no HP, link sosial media
- [ ] Isi minimal 3-4 project nyata di `data.js`
- [ ] Isi sertifikat yang relevan
- [ ] Setup Formspree/EmailJS untuk form contact
- [ ] Tes tampilan dark mode & light mode
- [ ] Tes toggle bahasa ID/EN
- [ ] Tes tampilan di HP (resize browser atau buka di HP langsung)
- [ ] Cek semua link (demo project, GitHub, sosial media) sudah benar
