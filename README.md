# Sistem Deteksi Kemiripan Judul Tugas Akhir
> STMIK Palangkaraya

---

## 📋 Deskripsi

Sistem berbasis web untuk mendeteksi kemiripan judul Tugas Akhir menggunakan algoritma **TF-IDF** dan **Cosine Similarity**. Sistem ini terintegrasi langsung dengan repositori digital perpustakaan STMIK Palangkaraya melalui teknik web scraping, sehingga database judul selalu dapat diperbarui secara berkala.

---

## 🖥️ Tampilan Sistem

### Halaman Utama
![Halaman Utama](screenshots/halaman-utama.png)

### Halaman Hasil
![Halaman Hasil](screenshots/halaman-hasil.png)

### Halaman Detail
![Halaman Detail](screenshots/halaman-detail.png)

### Halaman Referensi
![Halaman Referensi](screenshots/halaman-referensi.png)

---

## ⚙️ Cara Kerja Sistem

1. Pengguna memasukkan judul Tugas Akhir pada form input
2. Sistem melakukan preprocessing teks (case folding, tokenizing, stopword removal, stemming)
3. Sistem menghitung bobot kata menggunakan TF-IDF
4. Sistem menghitung kemiripan menggunakan Cosine Similarity terhadap seluruh judul di database
5. Sistem menampilkan hasil berupa persentase kemiripan beserta kategorinya

---

## 📊 Kategori Kemiripan

| Rentang | Kategori | Keterangan |
|---|---|---|
| 0% - 30% | 🟢 Rendah | Judul cukup unik, dapat digunakan |
| 31% - 60% | 🟡 Sedang | Perlu ditinjau lebih lanjut |
| > 60% | 🔴 Tinggi | Disarankan untuk merevisi judul |

> Threshold yang digunakan adalah **60%** berdasarkan hasil kalibrasi dari uji validasi algoritma terhadap penilaian dosen pakar, yang menunjukkan peningkatan akurasi dari 73,3% (threshold 71%) menjadi **83,3%** (threshold 60%).

---

## 🗄️ Database

Sistem menggunakan **Google Spreadsheets** sebagai database utama yang terdiri dari tiga sheet:

| Sheet | Keterangan | Link |
|---|---|---|
| Data Judul | Berisi 2340 judul tugas akhir hasil scraping | [Link Spreadsheets]() |
| Stopwords | Daftar kata yang diabaikan saat preprocessing | [Link Spreadsheets]() |
| Kamus Koreksi | Kamus koreksi hasil stemming | [Link Spreadsheets]() |

---

## 🔗 Link

| Keterangan | Link |
|---|---|
| 🌐 Website | [Link Website]() |
| 📁 Source Code | [Link GitHub]() |
| 📊 Database Spreadsheets | [Link Spreadsheets]() |

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Keterangan |
|---|---|
| HTML, CSS, JavaScript | Bahasa pemrograman utama website |
| Tailwind CSS | Framework CSS |
| Sastrawi.js | Library stemming Bahasa Indonesia |
| PapaParse | Library parsing CSV |
| Google Spreadsheets | Database |
| GitHub Pages | Hosting website |
| Python | Web scraping |
| BeautifulSoup | Library web scraping |


---

## 📈 Hasil Pengujian

### Uji Black Box
Seluruh fungsi sistem berjalan sesuai dengan yang diharapkan.

### Uji Validasi Algoritma

#### Threshold 71% (Awal)
| Kelas | Precision | Recall | F1-Score |
|---|---|---|---|
| Rendah | 1.000 | 1.000 | 1.000 |
| Sedang | 0.400 | 0.667 | 0.500 |
| Tinggi | 0.800 | 0.571 | 0.667 |
| **Akurasi** | | | **73.3%** |

#### Threshold 60% (Setelah Kalibrasi)
| Kelas | Precision | Recall | F1-Score |
|---|---|---|---|
| Rendah | 1.000 | 1.000 | 1.000 |
| Sedang | 0.600 | 0.500 | 0.545 |
| Tinggi | 0.800 | 0.857 | 0.828 |
| **Akurasi** | | | **83.3%** |

---

## 👤 Penulis

| | |
|---|---|
| **Nama** | [Nama Kamu] |
| **NIM** | [NIM Kamu] |
| **Program Studi** | [Prodi Kamu] |
| **Institusi** | STMIK Palangkaraya |
| **Tahun** | 2025 |

---

## 📝 Lisensi

Proyek ini dibuat untuk keperluan Tugas Akhir di STMIK Palangkaraya.