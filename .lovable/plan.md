# Upgrade Visual Portal XI TJKT A

## Tujuan
Memoles situs yang sudah ada menjadi portal akademik-teknologi yang modern, profesional, responsif, dan hidup tanpa mengubah data, autentikasi, konfigurasi backend, atau alamat halaman.

## Perubahan yang akan dibuat
- Menyegarkan token visual global untuk mode terang dan gelap: putih/abu sangat muda, teks navy, aksen biru–indigo, bayangan lembut, radius konsisten, dan kontras yang lebih baik.
- Memperhalus tombol, input, kartu, dialog, tabel, status fokus, serta transisi interaksi melalui komponen yang sudah ada.
- Mendesain ulang navigasi publik agar lebih lapang dan jelas, dengan status aktif yang kuat serta menu seluler beranimasi yang ringkas dan mudah disentuh.
- Meningkatkan beranda dengan fokus kuat pada “XI TJKT A”, informasi sekolah/jurusan/tahun, visual jaringan bergerak berbasis CSS/SVG, foto yang sudah tersedia, dan satu statistik nyata: 34 siswa.
- Menyeragamkan judul halaman, kartu daftar, galeri, filter, tabel jadwal, dan empty state di seluruh halaman publik.
- Mengubah jadwal pelajaran menjadi kartu yang mudah dibaca di ponsel sambil mempertahankan tabel pada layar besar.
- Menambahkan reveal, stagger, hover elevation, serta micro-interaction ringan dengan fallback `prefers-reduced-motion`.
- Menerjemahkan halaman error/404 yang masih berbahasa Inggris ke Bahasa Indonesia.

## Batasan yang dipertahankan
- Tidak ada perubahan skema, data, aturan keamanan, autentikasi, atau integrasi backend.
- Tidak ada konten fiktif dan tidak ada statistik tambahan selain 34 siswa.
- Semua rute, pencarian, unggah media, editor konten, dan dashboard admin tetap bekerja.
- Tidak menambah layanan berbayar atau dependensi yang tidak diperlukan.

## Pemeriksaan akhir
- Memastikan kompilasi bersih dan tidak ada error runtime/console baru.
- Membuka seluruh rute publik dan memeriksa navigasi serta interaksi utama.
- Memeriksa tampilan ponsel, tablet, dan desktop untuk overflow, keterbacaan, susunan kartu, tabel, serta menu.
- Memastikan mode terang menjadi default dan mode gelap tetap konsisten.
