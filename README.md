# PENERAPAN <i>COSINE SIMILARITY</i> PADA DETEKSI KEMIRIPAN JUDUL TUGAS AKHIR DI STMIK PALANGKARAYA

**Deskripsi**

Sistem berbasis web untuk mendeteksi kemiripan judul Tugas Akhir menggunakan algoritma **TF-IDF** dan **Cosine Similarity**. Sistem ini terintegrasi langsung dengan repositori digital perpustakaan STMIK Palangkaraya melalui teknik web scraping, sehingga database judul selalu dapat diperbarui secara berkala.

**Cara Kerja Sistem**

1. Pengguna memasukkan judul Tugas Akhir pada form input
2. Sistem melakukan preprocessing teks (case folding, tokenizing, stopword removal, stemming)
3. Sistem menghitung bobot kata menggunakan TF-IDF
4. Sistem menghitung kemiripan menggunakan Cosine Similarity terhadap seluruh judul di database
5. Sistem menampilkan hasil berupa persentase kemiripan beserta kategorinya

**Kategori Kemiripan**

| Rentang | Kategori | Keterangan |
|---|---|---|
| 0% - 30% | 🟢 Rendah | Judul cukup unik, dapat digunakan |
| 31% - 60% | 🟡 Sedang | Perlu ditinjau lebih lanjut |
| > 60% | 🔴 Tinggi | Disarankan untuk merevisi judul |

---

**Database**

Sistem menggunakan **Google Spreadsheets** sebagai database

| Sheet | Keterangan | Link |
|---|---|---|
| Spreadsheets | Berisi judul tugas akhir pada | [Link Spreadsheets]() |


**Lisensi**

Proyek ini dibuat untuk keperluan Tugas Akhir di STMIK Palangkaraya.