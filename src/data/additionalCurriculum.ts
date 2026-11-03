import type { Link, Track, Unit } from './curriculum'

const link = (label: string, url: string): Link => ({ label, url })
const yt = (query: string): Link => link('Cari video: ' + query, `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`)
const unit = (id: string, title: string, tasks?: string[], practice?: string, links?: Link[]): Unit => ({ id, title, tasks, practice, links })

const mathResources = [
  link('Alternatifa.Project · cari Fundamental Matematika', 'https://www.youtube.com/results?search_query=Alternatifa+Project+Fundamental+Matematika'),
  link('Professor Leonard · Pre-Algebra playlist', 'https://www.youtube.com/playlist?list=PL0o_zxa4K1BVoTlaXWFcFZ7fU3RvmFMMG'),
  link('Professor Leonard · Intermediate Algebra', 'https://www.youtube.com/results?search_query=Professor+Leonard+Intermediate+Algebra+playlist'),
  link('Professor Leonard · Precalculus', 'https://www.youtube.com/results?search_query=Professor+Leonard+Precalculus+playlist'),
  link('Professor Leonard · Calculus 1', 'https://www.youtube.com/results?search_query=Professor+Leonard+Calculus+1+playlist'),
  link('Eddie Woo · Wootube', 'https://www.youtube.com/@misterwootube'),
  link('Khan Academy · Matematika', 'https://id.khanacademy.org/math'),
]

const math: Track = {
  id: 'matematika', title: 'Matematika', subtitle: 'Dari aritmatika sampai kalkulus dasar. Bangun konsep dan intuisi sebelum menghafal rumus.',
  stages: [
    {
      id: 'math-aritmatika', title: 'Chapter 1 · Aritmatika',
      description: 'Matematika tidak dimulai dari rumus, melainkan dari kebutuhan sederhana yaitu menghitung. Dari situ kita mulai menggunakan bilangan dan menyadari bahwa interaksi bilangan tidak terbentuk begitu saja, namun ada aturan dan pola yang harus diikuti. Lebih dalam, bilangan dapat dipecah menjadi bagian-bagian kecil dari keseluruhan. Bilangan bukan sekadar untuk menghitung, tetapi juga untuk memahami dan membandingkan dunia. Banyak orang kesulitan bukan karena tidak berbakat, melainkan karena melewatkan pecahan, tidak memahami sifat operasi, dan hanya menghafal tanpa mengerti. Akibatnya manipulasi persamaan aljabar terasa sulit. Karena itu kemampuan aritmatika diperlukan sebelum memasuki aljabar. Sumber utama: Alternatifa.Project Fundamental Matematika.',
      links: mathResources,
      units: [
        unit('math-arit-1-1','Level I · Fondasi bilangan',['Apa itu bilangan','Jenis-jenis bilangan','Perbandingan bilangan'],'Pahami bahwa bilangan bukan simbol kosong, melainkan mewakili jumlah.'),
        unit('math-arit-2-1','Level II · Operasi dasar',['Pertambahan (+)','Pengurangan (−)','Perkalian (×)','Pembagian (÷)'],'Jelaskan apa yang terjadi ketika bilangan berinteraksi dengan operasi.'),
        unit('math-arit-3-1','Level III · Sifat dan hubungan operasi',['Komutatif','Asosiatif','Distributif','Operasi campuran dan urutan operasi (PEMDAS)'],'Pahami aturan main bilangan dalam sebuah persamaan.'),
        unit('math-arit-4-1','Level IV · Faktor, kelipatan, dan bilangan khusus',['Faktorisasi','Kelipatan','Faktor persekutuan terbesar (FPB)','Kelipatan persekutuan terkecil (KPK)','Bilangan prima dan komposit'],'Pahami bagaimana bilangan dapat dibongkar dan disusun ulang.'),
        unit('math-arit-5-1','Level V · Pecahan, desimal, dan persen',['Konsep pecahan','Pecahan senilai dan menyederhanakan pecahan','Operasi pada pecahan','Konsep desimal dan persen','Konversi desimal, pecahan, dan persen'],'Pahami bagian dari keseluruhan dan bentuk-bentuk lain yang senilai.'),
        unit('math-arit-6-1','Level VI · Perbandingan dan aritmatika sosial',['Perbandingan dan rasio','Skala','Harga, diskon, untung, rugi, dan bunga'],'Pahami hubungan antarjumlah dan gunakan matematika dalam kehidupan sosial.'),
      ],
    },
    {
      id: 'math-aljabar', title: 'Chapter 2 · Aljabar',
      description: 'Aljabar adalah cabang matematika yang menggunakan simbol seperti x dan y untuk merepresentasikan bilangan yang tidak diketahui. Huruf mulai menggantikan angka, persamaan menjadi teka-teki, dan perlahan kita menyadari aljabar bukan tentang huruf, melainkan tentang cara berpikir. Banyak orang menganggap aljabar sulit dan tidak penting, padahal aljabar menjadi fondasi banyak persamaan matematika di berbagai cabang ilmu.', links: mathResources,
      units: [
        unit('math-alj-1-1','Level I · Fondasi aljabar',['Konsep variabel','Bentuk aljabar','Operasi aljabar','Sifat kesetaraan aljabar'],'Pahami huruf sebagai bilangan yang belum diketahui dan persamaan seperti timbangan: perlakuan di kedua sisi harus setara.'),
        unit('math-alj-2-1','Level II · Persamaan dan pertidaksamaan linear',['Persamaan linear satu variabel','Pertidaksamaan linear satu variabel','Persamaan linear dua variabel (SPLDV): substitusi, eliminasi, dan grafik','Pertidaksamaan linear dua variabel'],'Pelajari cara menemukan bilangan yang tidak diketahui dengan satu atau dua variabel.'),
        unit('math-alj-3-1','Level III · Faktorisasi, fungsi, dan relasi',['Faktorisasi','Fungsi dan relasi','Domain, kodomain, dan range','Jenis fungsi dan grafik'],'Manipulasi bentuk aljabar dan pahami fungsi sebagai input-output serta hubungannya dengan grafik.'),
        unit('math-alj-4-1','Level IV · Persamaan kuadrat',['Definisi dan bentuk umum ax² + bx + c = 0 (a ≠ 0)','Penyelesaian dengan faktorisasi','Rumus kuadrat','Diskriminan','Grafik fungsi kuadrat: sumbu simetri, titik puncak, dan arah buka'],'Pahami persamaan dan grafik yang tidak lagi berbentuk garis lurus.'),
        unit('math-alj-5-1','Level V · Aljabar lanjutan',['Operasi bentuk akar: simplifikasi dan rasionalisasi penyebut','Persamaan dan pertidaksamaan rasional','Persamaan dan pertidaksamaan nilai mutlak','Sistem persamaan linear-kuadrat'],'Pahami bentuk akar dan variasi persamaan/pertidaksamaan, lalu selesaikan masalah linear-kuadrat.'),
        unit('math-alj-6-1','Level VI · Aljabar pra-kalkulus',['Eksponen','Logaritma','Fungsi eksponensial dan logaritma','Barisan dan deret aritmatika dan geometri','Notasi sigma'],'Bangun fondasi kalkulus dengan memahami perkalian berulang, pola barisan, dan penjumlahannya.'),
      ],
    },
    {
      id: 'math-geometri', title: 'Chapter 3 · Geometri',
      description: 'Jika aljabar membantu memahami hubungan antarbilangan, geometri menjawab bagaimana bentuk dan ruang di dunia yang kita lihat dapat diukur. Geometri adalah cabang ilmu matematika tertua yang mempelajari sifat ruang, ukuran, bentuk, posisi, serta hubungan titik, garis, sudut, bidang, dan volume. Geometri penting untuk memodelkan bentuk-bentuk visual secara matematis. Perjalanan dimulai dari titik menjadi garis dan sudut, membentuk bangun, mengalami transformasi namun tetap memiliki identitas, naik ke tiga dimensi, lalu menyatukan aljabar dan geometri melalui koordinat. Geometri bukan sekadar menghitung luas, tetapi memahami ruang, bentuk, dan hubungan di antaranya.', links: mathResources,
      units: [
        unit('math-geo-1-1','Level I · Geometri dasar',['Titik, garis, dan bidang serta posisi terhadap garis/bidang','Sudut: jenis dan hubungan sudut','Bangun dasar: segitiga, persegi panjang, dan lingkaran'],'Rasakan ruang dan pahami hubungan bentuk serta sudut sebelum menghafal rumus.'),
        unit('math-geo-2-1','Level II · Bangun datar 2D',['Segitiga: jenis, keliling, luas, dan teorema Pythagoras','Persegi: luas dan keliling','Persegi panjang: luas dan keliling','Jajar genjang: luas dan keliling','Trapesium: luas dan keliling','Belah ketupat: luas dan keliling','Layang-layang: luas dan keliling','Diagonal dan simetri','Lingkaran: jari-jari, diameter, busur, tali busur, keliling, luas, sudut pusat, dan sudut keliling'],'Lihat dan pahami bentuk-bentuk dasar secara matematis.'),
        unit('math-geo-3-1','Level III · Geometri transformasi',['Translasi (pergeseran)','Refleksi (pencerminan)','Rotasi (perputaran)','Komposisi transformasi'],'Pahami perubahan dan pergeseran bentuk secara matematis dan visual.'),
        unit('math-geo-4-1','Level IV · Kesebangunan dan kekongruenan',['Kesebangunan','Kekongruenan'],'Pahami bagaimana dua bentuk yang tampak berbeda dapat memiliki kesetaraan tertentu.'),
        unit('math-geo-5-1','Level V · Geometri ruang 3D',['Bangun ruang sisi datar: kubus, balok, prisma, dan limas (volume dan luas permukaan)','Bangun sisi lengkung: tabung, kerucut, dan bola (volume dan luas permukaan)','Jarak dan diagonal dalam ruang: titik ke bidang dan garis ke garis'],'Kenali bentuk tiga dimensi di sekitar kita secara matematis.'),
        unit('math-geo-6-1','Level VI · Geometri analitik',['Sistem koordinat Kartesius','Gradien dan persamaan garis','Jarak dan titik tengah','Persamaan lingkaran umum','Parabola, elips, dan hiperbola'],'Satukan aljabar dan geometri dalam sistem koordinat; geometri adalah bentuk dan aljabar adalah bahasanya.'),
      ],
    },
    {
      id: 'math-trigonometri', title: 'Chapter 4 · Trigonometri',
      description: 'Setelah memahami bentuk, trigonometri mengajak kita mengukur kemiringan, gelombang, dan arah melalui sudut serta perputaran. Trigonometri lahir dari pertanyaan mengenai hubungan sudut dan sisi pada segitiga. Awalnya hanya tentang segitiga, kemudian sudut menjadi rasio, rasio menjadi pola, dan pola berubah menjadi gelombang. Banyak orang kesulitan karena hanya menghafal rumus dan menganggap trigonometri sebagai ilmu hafalan; yang perlu dipahami adalah ide hubungan di baliknya.', links: mathResources,
      units: [
        unit('math-trig-1-1','Level I · Pengantar trigonometri',['Apa itu trigonometri','Segitiga siku-siku dan unsurnya','Rasio dasar: sin = sisi depan/miring, cos = sisi samping/miring, tan = sisi depan/samping','Hubungan antara rasio'],'Pahami trigonometri sebagai rasio dalam segitiga siku-siku.'),
        unit('math-trig-2-1','Level II · Sudut dan satuan',['Derajat dan radian','Sudut positif dan negatif','Sudut berelasi','Sudut-sudut di kuadran','Nilai sin, cos, dan tan di tiap kuadran (ASTC)'],'Pahami cara mengukur dan menghitung sudut pada bidang.'),
        unit('math-trig-3-1','Level III · Fungsi trigonometri',['Definisi fungsi sin, cos, dan tan','Grafik sin, cos, tan: amplitudo, periode, dan fase','Transformasi grafik','Grafik csc, sec, dan cot'],'Pahami bagaimana fungsi trigonometri membentuk gelombang dan fungsi turunannya.'),
        unit('math-trig-4-1','Level IV · Identitas trigonometri',['Identitas dasar','Identitas jumlah dan selisih sudut','Identitas sudut ganda dan setengah','Identitas hasil kali dan jumlah'],'Pelajari pola dan teknik menyederhanakan ekspresi trigonometri.'),
        unit('math-trig-5-1','Level V · Persamaan dan pertidaksamaan trigonometri',['Persamaan trigonometri dasar','Persamaan sudut ganda dan kuadrat trigonometri','Pertidaksamaan trigonometri sederhana'],'Gunakan cara berpikir aljabar untuk menyelesaikan persamaan trigonometri.'),
        unit('math-trig-6-1','Level VI · Aplikasi trigonometri',['Segitiga sembarang: hukum sinus, cosinus, dan tangen','Sudut elevasi dan depresi untuk menentukan tinggi dan jarak','Aplikasi fisika dan teknik'],'Pahami penggunaan trigonometri dalam kehidupan nyata.'),
      ],
    },
    {
      id: 'math-kalkulus', title: 'Chapter 5 · Kalkulus dasar',
      description: 'Kalkulus sering dianggap level dewa, padahal ide dasarnya adalah memahami perubahan dan akumulasi. Jika aritmatika menghitung, aljabar memodelkan, geometri mempelajari bentuk, dan trigonometri mempelajari pola segitiga, maka kalkulus melihat bagaimana perubahan terjadi pada jarak waktu yang sangat singkat. Banyak orang takut karena langsung melompat ke rumus tanpa memahami ide besarnya. Jalur ini membahas dasar-dasar kalkulus: limit sebagai nilai yang didekati, turunan untuk mengukur perubahan, dan integral untuk mengumpulkan perubahan. Kalkulus adalah bahasa untuk memahami perubahan.', links: mathResources,
      units: [
        unit('math-kalk-1-1','Level I · Limit',['Pengertian limit','Limit kanan dan kiri','Limit tak terhingga','Limit fungsi aljabar','Limit fungsi trigonometri','Bentuk tak tentu 0/0','Teknik limit: faktorisasi, rasionalisasi, dan identitas trigonometri','Bilangan Euler'],'Pahami nilai yang dituju ketika mendekati titik tertentu dan gunakan manipulasi aljabar untuk menemukan limit.'),
        unit('math-kalk-2-1','Level II · Turunan',['Makna turunan','Aturan pangkat dan konstanta','Aturan penjumlahan, perkalian, dan pembagian','Turunan fungsi trigonometri','Turunan tingkat dua: kecekungan/konkaf dan percepatan','Aplikasi: maksimum/minimum, optimisasi, kecepatan/percepatan, grafik, dan titik kritis'],'Pahami seberapa cepat sesuatu berubah serta teknik menentukan turunannya.'),
        unit('math-kalk-3-1','Level III · Integral',['Antiturunan (integral tak tentu)','Integral tentu dan teorema dasar kalkulus','Substitusi (u-substitution)','Integral parsial (integration by parts)','Integral trigonometri','Integral rasional (partial fractions)','Makna geometris: luas daerah dan akumulasi'],'Pahami integral sebagai kebalikan turunan sekaligus cara menghitung luas di bawah kurva dan akumulasi.'),
      ],
    },
  ],
}

const git: Track = {
  id: 'git-github', title: 'Git & GitHub', subtitle: 'Playlist WPU: dari konsep dasar sampai workflow kolaborasi dan publikasi.',
  stages: [{ id: 'git-wpu', title: 'Playlist WPU · 14 materi', description: 'Ikuti urutan playlist WPU yang kamu catat. Setelah memahami konsep, praktikkan seluruh perintah di repository latihan pribadi.', links: [yt('WPU playlist Git dan GitHub #1 apa itu Git dan GitHub'), link('WPU · Video #1 Apa itu Git & GitHub', 'https://www.youtube.com/watch?v=lTMZxWMjXQU'), link('Dokumentasi Git', 'https://git-scm.com/doc'), link('GitHub Skills', 'https://skills.github.com/'), link('Pro Git (Bahasa Indonesia tersedia)', 'https://git-scm.com/book/id/v2')], units: [
    unit('git-01','01 · Apa itu Git dan GitHub',['Perbedaan Git sebagai version control dan GitHub sebagai platform kolaborasi'],'Jelaskan perbedaan Git dan GitHub dengan kata-katamu sendiri.'),
    unit('git-02','02 · Bekerja dengan GitHub',['Membuat akun dan repository','Mengenal repository, commit, dan file'],'Buat repository latihan dan isi README.'),
    unit('git-03','03 · Git branch',['Apa itu branch','Membuat dan berpindah branch'],'Buat branch feature dan lakukan satu commit.'),
    unit('git-04','04 · Git fork',['Fork repository','Perbedaan fork dan clone'],'Fork repository publik dan jelajahi salinannya.'),
    unit('git-05','05 · Bekerja dengan Git',['git init, status, add, commit, log','Working tree dan staging area'],'Latih alur perubahan file sampai commit.'),
    unit('git-06','06 · Git branch dan merge',['Membuat branch','Menggabungkan branch dengan merge'],'Gabungkan branch fitur ke main.'),
    unit('git-07','07 · Git merge conflict',['Penyebab conflict','Menyelesaikan conflict secara manual'],'Buat conflict dengan sengaja lalu selesaikan.'),
    unit('git-08','08 · Git remote',['Remote origin','git remote add, -v, remove'],'Hubungkan repository lokal dengan GitHub.'),
    unit('git-09','09 · GitHub Pages',['Mengaktifkan GitHub Pages','Deploy website statis'],'Publikasikan halaman latihan.'),
    unit('git-10','10 · Multiple remote',['Menambahkan lebih dari satu remote','Push ke remote yang berbeda'],'Tambahkan remote kedua untuk latihan.'),
    unit('git-11','11 · Remote branch',['Fetch, pull, push','Tracking branch'],'Ambil perubahan remote dan sinkronkan branch.'),
    unit('git-12','12 · .gitignore',['Pola file yang diabaikan','Menghindari file rahasia dan hasil build'],'Buat .gitignore untuk project Vite dan pastikan .env tidak ter-commit.'),
    unit('git-13','13 · Git rebase',['Perbedaan merge dan rebase','Rebase branch fitur'],'Latih rebase di repository eksperimen, bukan branch produksi.'),
    unit('git-14','14 · Git & web hosting',['Alur deploy','Menghubungkan repository dan hosting'],'Deploy satu project dan dokumentasikan langkahnya.'),
  ] }],
}

const sheets: Track = {
  id: 'google-sheets', title: 'Google Sheets', subtitle: 'Playlist Daddy Channel · 8 episode, dari dasar spreadsheet sampai proteksi dan ekspor.',
  stages: [{ id: 'sheets-daddy', title: 'Playlist Daddy Channel · 8 episode', description: 'Ikuti episode secara berurutan. Setiap episode berisi topik yang kamu catat; praktikkan langsung di satu file spreadsheet latihan.', links: [yt('Daddy Channel tutorial Google Sheet 8 episode'), link('Google Workspace Learning Center', 'https://workspace.google.com/training/'), link('Bantuan Google Sheets', 'https://support.google.com/docs/topic/9054603')], units: [
    unit('sheets-01','Episode 1 · Pengenalan dan pengaturan file',['Buat folder di Drive','Buka Google Sheets','Mengetik tulisan','Memindahkan file','Mengatur ukuran kolom/baris','Garis tabel/border','Warna latar','Berbagi file ke email lain','Memberi akses edit'],'Buat spreadsheet daftar belajar dan bagikan ke akun lain dengan akses yang sesuai.'),
    unit('sheets-02','Episode 2 · Sheet dan format data',['Sheet/lembar kerja','Format teks','Format angka','Format tanggal','Format mata uang','Format persen','Format jam','Format desimal','Link','Toolbar/menu atas'],'Buat tabel pengeluaran sederhana dengan format data yang benar.'),
    unit('sheets-03','Episode 3 · Baris, kolom, dan validasi data',['Tambah dan hapus baris/kolom','Hapus data','Folder dibagikan kepada saya','Properties baris/kolom','Sembunyikan dan munculkan baris/kolom','Sembunyikan dan munculkan sheet','List data/dropdown dengan validasi data'],'Buat dropdown status pada tabel tugas.'),
    unit('sheets-04','Episode 4 · Fitur tampilan dan interaksi',['Freeze panes/bekukan baris atau kolom','Kotak centang/checklist','Format bersyarat','Warna alternatif tabel'],'Buat checklist tugas dengan warna otomatis sesuai status.'),
    unit('sheets-05','Episode 5 · Rumus dasar',['Rumus penjumlahan','Rata-rata','Nilai tertinggi','Nilai terendah','Jumlah data'],'Buat ringkasan nilai atau pengeluaran dengan SUM, AVERAGE, MAX, MIN, dan COUNT.'),
    unit('sheets-06','Episode 6 · Nomor urut dan tabel pembelian',['Membuat nomor urut','Simbol perhitungan','Contoh tabel pembelian','Bentuk format normal'],'Buat tabel pembelian dengan subtotal dan total.'),
    unit('sheets-07','Episode 7 · Proteksi data',['Lindungi rentang/kunci rentang','Lindungi sheet/kunci sheet'],'Kunci sel rumus dan biarkan sel input tetap dapat diedit.'),
    unit('sheets-08','Episode 8 · Referensi sel, cetak, dan ekspor',['Absolute reference/kunci sel atau rentang dengan F4','Print','Download versi Excel dan PDF'],'Buat salinan PDF dan XLSX dari spreadsheet latihan.'),
  ] }],
}

const excel: Track = {
  id: 'excel', optional: true, title: 'Microsoft Excel', subtitle: 'Jalur opsional. Playlist YouTube yang kamu berikan menjadi materi utama; bisa dikerjakan setelah Google Sheets atau saat dibutuhkan.',
  stages: [{ id: 'excel-foundation', title: 'Dasar sampai penggunaan lanjutan', description: 'Playlist cukup panjang, jadi tidak gw pecah menjadi jadwal wajib. Ikuti urutan video playlist, lalu gunakan daftar kompetensi ini sebagai checklist belajar. Materi tambahan dapat dipilih sesuai kebutuhan.', links: [link('Playlist Excel yang kamu berikan', 'https://youtube.com/playlist?list=PL0A06OwyXeD3pr4Nh2FM7R0ZsZ2AJES2A&si=jAG9c0XtGoOSz2Su'), link('Microsoft Excel Help & Learning', 'https://support.microsoft.com/excel')], units: [
    unit('excel-01','Pengenalan workbook, worksheet, dan antarmuka',['Workbook dan worksheet','Ribbon, formula bar, name box','Menyimpan dan mengelola file'],'Buat workbook untuk mengelola data pribadi.'),
    unit('excel-02','Input, format, dan pengelolaan data',['Tipe data dan format angka/tanggal/mata uang','Mengatur baris, kolom, tabel','Sort dan filter'],'Rapikan dataset sederhana dan ubah menjadi Table.'),
    unit('excel-03','Formula dan fungsi dasar',['Referensi relatif, absolut, dan campuran','SUM, AVERAGE, MIN, MAX, COUNT','IF dan fungsi logika dasar'],'Buat laporan dengan formula yang saling terhubung.'),
    unit('excel-04','Visualisasi dan analisis',['Chart dasar','Conditional Formatting','Data Validation','PivotTable dasar'],'Buat ringkasan visual dari dataset latihan.'),
    unit('excel-05','Fitur produktivitas dan berbagi',['Freeze Panes','Protect Sheet/Workbook','Print area dan page setup','Ekspor PDF dan kompatibilitas Excel'],'Siapkan workbook yang siap dibagikan atau dicetak.'),
  ] }],
}

const numberSystems: Track = {
  id: 'sistem-bilangan', title: 'Sistem Bilangan Komputer', subtitle: 'Memahami representasi angka yang digunakan komputer, dari basis 2 sampai operasi biner.',
  stages: [{ id: 'number-systems-playlist', title: 'Playlist sistem bilangan', description: 'Playlist YouTube yang kamu berikan menjadi acuan utama. Materi tambahan disusun sebagai peta konsep agar konversi dan operasi bilangan lebih mudah dipahami.', links: [link('Playlist sistem bilangan komputer', 'https://youtube.com/playlist?list=PL0A06OwyXeD1W5xhVLKb_BVzWFzVnj_kb&si=7namGoigbNdVrrmQ'), link('Modul sistem bilangan · SPADA Indonesia', 'https://lmsspada.kemdiktisaintek.go.id/course/view.php?id=3185&lang=id')], units: [
    unit('num-01','Konsep sistem bilangan dan basis',['Digit, nilai tempat, dan basis','Desimal (basis 10)','Biner (basis 2)','Oktal (basis 8)','Heksadesimal (basis 16)'],'Jelaskan mengapa komputer menggunakan representasi biner.'),
    unit('num-02','Konversi desimal ke basis lain',['Desimal ke biner','Desimal ke oktal','Desimal ke heksadesimal'],'Kerjakan konversi dengan pembagian berulang dan cek hasilnya.'),
    unit('num-03','Konversi basis lain ke desimal',['Biner ke desimal','Oktal ke desimal','Heksadesimal ke desimal'],'Uraikan nilai tempat setiap digit untuk menjelaskan hasil konversi.'),
    unit('num-04','Konversi antar basis non-desimal',['Biner ke oktal dan sebaliknya','Biner ke heksadesimal dan sebaliknya','Oktal ke heksadesimal melalui biner/desimal'],'Latih konversi tanpa kalkulator, lalu verifikasi.'),
    unit('num-05','Aritmatika biner',['Penjumlahan biner','Pengurangan biner','Perkalian dan pembagian biner sederhana','Overflow dasar'],'Hitung operasi biner dan bandingkan dengan hasil desimal.'),
    unit('num-06','Representasi data komputer',['Bit, nibble, byte, dan word','Bilangan bertanda: sign-magnitude dan komplemen dua','Bilangan pecahan/floating point secara pengantar'],'Buat catatan bagaimana bilangan negatif dapat direpresentasikan.'),
    unit('num-07','Latihan dan penerapan',['Konversi campuran','Membaca nilai heksadesimal pada konteks komputer','Review seluruh basis'],'Buat lembar latihan berisi minimal 20 soal konversi dan operasi.'),
  ] }],
}

export const EXTRA_TRACKS: Track[] = [math, git, sheets, excel, numberSystems]