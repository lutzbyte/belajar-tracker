import { EXTRA_TRACKS } from './additionalCurriculum'

export type Link = { label: string; url: string }

export type Unit = {
  id: string
  title: string
  tasks?: string[]
  practice?: string
  links?: Link[]
}

export type Stage = {
  id: string
  title: string
  description: string
  routine?: string[]
  links?: Link[]
  units: Unit[]
}

export type Track = {
  id: string
  optional?: boolean
  selfPaced?: boolean
  title: string
  subtitle: string
  stages: Stage[]
}

type Row = Omit<Unit, 'id'>

const yt = (q: string): Link => ({
  label: 'Cari video (Indonesia)',
  url: `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
})

const link = (label: string, url: string): Link => ({ label, url })

const makeUnits = (stageId: string, rows: Row[]): Unit[] =>
  rows.map((r, i) => ({ id: `${stageId}-${String(i + 1).padStart(2, '0')}`, ...r }))

/* ------------------------------------------------------------------ */
/* RUST                                                                */
/* ------------------------------------------------------------------ */

type Topic = { at: string; title: string; drill: string }
type Sized = Topic & { end: string; min: number }

// Urutan & timestamp persis dari videomu
const topics: Topic[] = [
  { at: '00:00', title: 'Intro', drill: 'Buat folder rust-belajar untuk semua latihan.' },
  { at: '00:30', title: 'Singkat tentang Rust', drill: 'Tulis 3 alasan Rust dibuat, pakai kata-katamu sendiri.' },
  { at: '20:36', title: 'Instalasi Linux', drill: 'Jalankan rustc --version dan cargo --version.' },
  { at: '28:53', title: 'Instalasi Windows', drill: 'Jalankan rustc --version dan cargo --version.' },
  { at: '37:12', title: 'Konfigurasi LSP Neovim', drill: 'Pastikan autocomplete dan error muncul di editor.' },
  { at: '41:49', title: 'Konfigurasi LSP VSCode', drill: 'Pastikan rust-analyzer aktif dan menampilkan error.' },
  { at: '45:17', title: 'Hello World', drill: 'Cetak namamu dan tujuan belajarmu dengan println!.' },
  { at: '56:57', title: 'Proses kompilasi', drill: 'Compile dengan rustc lalu jalankan binarinya. Catat bedanya dengan cargo run.' },
  { at: '1:09:27', title: 'Komentar kode', drill: 'Pakai tiga jenis komentar pada kodemu.' },
  { at: '1:23:19', title: 'Literal', drill: 'Tulis satu contoh untuk tiap jenis literal yang dijelaskan.' },
  { at: '2:01:42', title: 'Literal angka', drill: 'Coba 1_000, 0xff, 0b1010, dan sufiks seperti 5u8.' },
  { at: '2:29:32', title: 'Literal string', drill: 'Cetak string dengan escape newline dan tab, serta raw string.' },
  { at: '2:53:12', title: 'Variabel & tipe data', drill: 'Buat variabel untuk tiap tipe dasar, coba mut dan shadowing.' },
  { at: '3:24:29', title: 'Konstanta', drill: 'Buat const dan tulis bedanya dengan let.' },
  { at: '3:39:25', title: 'Operator aritmatika', drill: 'Buat kalkulator mini untuk + - * / %.' },
  { at: '4:04:03', title: 'Operator relasional', drill: 'Bandingkan dua angka lalu cetak hasil bool.' },
  { at: '4:24:49', title: 'Operator logika', drill: 'Gabungkan kondisi dengan && || ! untuk cek umur dan status.' },
  { at: '4:38:54', title: 'Operator bitwise', drill: 'Hitung & | ^ << >> pada angka biner, cocokkan dengan hitungan tangan.' },
  { at: '5:02:08', title: 'If statement', drill: 'Program penentu nilai huruf dari skor.' },
  { at: '5:30:15', title: 'Match statement', drill: 'Ubah program nilai huruf tadi memakai match.' },
  { at: '5:59:02', title: 'For looping', drill: 'Cetak tabel perkalian 1 sampai 10.' },
  { at: '6:20:34', title: 'While looping', drill: 'Hitung mundur dari 10 sampai 0.' },
  { at: '6:43:44', title: 'Loop', drill: 'Cari kelipatan 7 pertama di atas 100 dengan loop dan break.' },
  { at: '6:59:31', title: 'Array', drill: 'Cari nilai terbesar dan rata-rata dari sebuah array.' },
  { at: '7:28:43', title: 'Tuple', drill: 'Simpan (nama, umur, tinggi) dalam tuple lalu destructure.' },
  { at: '7:54:03', title: 'Fungsi', drill: 'Buat fungsi luas persegi panjang dan fungsi pengecek bilangan genap.' },
  { at: '8:20:46', title: 'Ownership dan borrowing', drill: 'Tulis contoh move, clone, dan borrow. Tebak error compiler sebelum run. Topik tersulit: ulangi besok.' },
  { at: '9:11:51', title: 'Slice', drill: 'Ambil kata pertama dari sebuah String memakai slice.' },
  { at: '9:41:13', title: 'Structure', drill: 'Buat struct Mahasiswa dengan method untuk menampilkan info.' },
  { at: '10:14:26', title: 'Enum', drill: 'Buat enum Hari dan fungsi yang memakai match.' },
  { at: '10:36:45', title: 'Format specifier', drill: 'Cetak angka dengan padding, 2 desimal, dan format debug.' },
  { at: '11:02:56', title: 'Vektor', drill: 'Tambah, hapus, dan iterasi Vec berisi nilai.' },
  { at: '11:27:18', title: 'Error handling', drill: 'Ubah fungsi pembagian agar mengembalikan Result.' },
  { at: '11:43:45', title: 'Parsing', drill: 'Parse angka dari string dan tangani kegagalannya.' },
  { at: '12:05:17', title: 'Tipe generik', drill: 'Buat fungsi generik untuk mencari nilai terbesar dari dua nilai.' },
  { at: '12:36:14', title: 'File IO', drill: 'Tulis lalu baca kembali sebuah file catatan.txt.' },
  { at: '13:14:39', title: 'Iterator', drill: 'Pakai map, filter, dan sum pada vektor angka.' },
  { at: '13:48:52', title: 'Cargo', drill: 'Buat project dengan cargo new lalu tambah satu dependency.' },
  { at: '14:11:21', title: 'Macro', drill: 'Tulis satu macro_rules! sederhana.' },
  { at: '14:28:29', title: 'Penutup', drill: 'Tulis ringkasan 5 konsep tersulit untuk dipelajari ulang.' },
]

// Perkiraan akhir video (timestamp terakhirmu hanya memberi titik mulai "Penutup")
const VIDEO_END = '14:30:00'
const MAX_VIDEO_MIN = 90

const toSec = (t: string) => t.split(':').map(Number).reduce((acc, p) => acc * 60 + p, 0)

function rustVideoRows(): Row[] {
  const sized: Sized[] = topics.map((t, i) => {
    const end = i + 1 < topics.length ? topics[i + 1].at : VIDEO_END
    return { ...t, end, min: Math.max(1, Math.round((toSec(end) - toSec(t.at)) / 60)) }
  })

  const days: Sized[][] = []
  let cur: Sized[] = []
  let used = 0
  for (const t of sized) {
    if (cur.length && used + t.min > MAX_VIDEO_MIN) {
      days.push(cur)
      cur = []
      used = 0
    }
    cur.push(t)
    used += t.min
  }
  if (cur.length) days.push(cur)

  return days.map((d) => ({
    title: d.length === 1 ? d[0].title : `${d[0].title} → ${d[d.length - 1].title}`,
    tasks: d.map((t) => `${t.at} – ${t.end} · ${t.title} (${t.min} mnt)`),
    practice: d.map((t) => t.drill).join(' '),
  }))
}

const rustBook = link('The Rust Book', 'https://doc.rust-lang.org/book/')
const rustByExample = link('Rust by Example', 'https://doc.rust-lang.org/rust-by-example/')
const cargoBook = link('The Cargo Book', 'https://doc.rust-lang.org/cargo/')

const rust: Track = {
  id: 'rust',
  title: 'Rust',
  subtitle: 'Dari instalasi sampai concurrency, urut mengikuti video kursusmu.',
  stages: [
    {
      id: 'rust-video',
      title: 'Video kursus (±14,5 jam)',
      description:
        'Urutan topik mengikuti timestamp videomu. Maksimal ±90 menit video per hari karena kamu mengetik ulang sambil menonton.',
      routine: [
        'Tonton per topik, pause, lalu ketik ulang kodenya tanpa copy-paste.',
        'Tutup video, tulis ulang dari ingatan.',
        'Kerjakan latihan hari itu di sesi latihan dan praktek.',
      ],
      units: makeUnits('rust-video', [
        ...rustVideoRows(),
        {
          title: 'Proyek penutup: aplikasi catatan CLI',
          practice:
            'Buat program CLI sederhana untuk menambah, melihat, dan menyimpan catatan ke file. Kerjakan tanpa melihat video.',
        },
      ]),
    },
    {
      id: 'rust-crate',
      title: 'Lanjutan 1: Crate & modul',
      description: 'Materi lanjutan di luar video. Sumber utama berbahasa Inggris.',
      links: [rustBook, cargoBook],
      units: makeUnits('rust-crate', [
        {
          title: 'Package, crate, dan modul',
          practice: 'Pecah proyek catatanmu menjadi beberapa modul (mod, pub, use).',
          links: [link('Rust Book: Packages, Crates, Modules', 'https://doc.rust-lang.org/book/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html')],
        },
        {
          title: 'Memakai crate dari crates.io',
          practice: 'Tambahkan satu crate ke Cargo.toml (misal rand) dan pakai di proyekmu.',
          links: [link('crates.io', 'https://crates.io/'), link('docs.rs', 'https://docs.rs/')],
        },
        {
          title: 'Membuat library crate sendiri',
          practice: 'Pindahkan logika catatan ke library crate, panggil dari main.rs.',
          links: [cargoBook],
        },
      ]),
    },
    {
      id: 'rust-test',
      title: 'Lanjutan 2: Unit test',
      description: 'Menguji kode yang sudah kamu tulis di tahap sebelumnya.',
      links: [rustBook, rustByExample],
      units: makeUnits('rust-test', [
        {
          title: 'Dasar #[test] dan assert!',
          practice: 'Tulis 5 test untuk fungsi-fungsi di library crate-mu.',
          links: [link('Rust Book: Automated Tests', 'https://doc.rust-lang.org/book/ch11-00-testing.html')],
        },
        {
          title: 'Menguji error: should_panic dan Result',
          practice: 'Tulis test untuk kasus gagal pada fungsi yang mengembalikan Result.',
        },
        {
          title: 'Unit test vs integration test (folder tests/)',
          practice: 'Buat satu integration test yang memakai library crate-mu dari luar.',
        },
      ]),
    },
    {
      id: 'rust-conc',
      title: 'Lanjutan 3: Concurrency',
      description: 'Tahap terakhir. Ownership harus sudah kuat sebelum masuk sini.',
      links: [rustBook, rustByExample],
      units: makeUnits('rust-conc', [
        {
          title: 'Thread: spawn dan join',
          practice: 'Jalankan 4 thread yang masing-masing menghitung sebagian penjumlahan.',
          links: [link('Rust Book: Concurrency', 'https://doc.rust-lang.org/book/ch16-00-concurrency.html')],
        },
        {
          title: 'Message passing dengan channel (mpsc)',
          practice: 'Kirim hasil hitung dari tiap thread ke thread utama lewat channel.',
        },
        {
          title: 'State bersama: Mutex dan Arc',
          practice: 'Buat counter yang dinaikkan banyak thread dengan Arc<Mutex<_>>.',
        },
        {
          title: 'Send, Sync, dan proyek kecil paralel',
          practice: 'Buat program yang memproses banyak file secara paralel dan menggabungkan hasilnya.',
        },
      ]),
    },
  ],
}

/* ------------------------------------------------------------------ */
/* BAHASA JEPANG                                                       */
/* ------------------------------------------------------------------ */

const irodori = link('Irodori (cari edisi bahasa Indonesia)', 'https://www.irodori.jpf.go.jp/en/')

const kanaUnits = (
  stageId: string,
  script: string,
  sets: [string, string][],
  readTitle: string,
  readTask: string,
): Unit[] =>
  makeUnits(stageId, [
    ...sets.map(([t, chars]) => ({
      title: `${t} · ${chars}`,
      links: [yt(`belajar ${script} ${t}`)],
    })),
    { title: readTitle, tasks: [readTask] },
    {
      title: `Ujian akhir ${script}`,
      tasks: ['Tulis seluruh tabel dari ingatan lalu cocokkan.', 'Ulangi huruf yang salah dengan flashcard.'],
    },
  ])

const kanaRoutine = [
  'Tonton video pengenalan huruf (±10 menit).',
  'Tulis tangan tiap huruf 5 kali sambil mengucapkannya keras-keras.',
  'Kuis diri dengan flashcard, ulangi huruf hari-hari sebelumnya.',
]

const irodoriUnits = (stageId: string, lessons: number): Unit[] =>
  makeUnits(
    stageId,
    Array.from({ length: lessons }, (_, i) => {
      const n = i + 1
      return [
        { title: `Lesson ${n} · Hari 1: kosakata & ungkapan kunci`, tasks: [`Pelajari kosakata dan ungkapan utama Lesson ${n}.`, 'Masukkan kata baru ke flashcard.'] },
        { title: `Lesson ${n} · Hari 2: listening`, tasks: [`Dengarkan audio Lesson ${n} berulang-ulang.`, 'Kerjakan latihan listening.'] },
        { title: `Lesson ${n} · Hari 3: speaking & tata bahasa`, tasks: ['Latihan speaking dengan audio (tirukan kalimatnya).', 'Pelajari pola tata bahasa lesson ini.'] },
        { title: `Lesson ${n} · Hari 4: reading, writing & review`, tasks: ['Kerjakan latihan reading dan writing.', `Review semua kosakata Lesson ${n}, tes diri sendiri.`] },
      ]
    }).flat(),
  )

const japanese: Track = {
  id: 'jepang',
  title: 'Bahasa Jepang',
  subtitle: 'Dari nol: hiragana, katakana, lalu Irodori A1 sampai A2.',
  stages: [
    {
      id: 'jp-hira',
      title: 'Hiragana',
      description: 'Syarat mutlak sebelum belajar yang lain. Jangan lanjut sebelum ujian akhir lulus.',
      routine: kanaRoutine,
      links: [irodori],
      units: kanaUnits(
        'jp-hira',
        'hiragana',
        [
          ['Baris A & KA', 'あいうえお かきくけこ'],
          ['Baris SA & TA', 'さしすせそ たちつてと'],
          ['Baris NA & HA', 'なにぬねの はひふへほ'],
          ['Baris MA & YA', 'まみむめも やゆよ'],
          ['Baris RA, WA & N', 'らりるれろ わをん'],
          ['Dakuten & handakuten', 'が ざ だ ば ぱ'],
          ['Youon & っ kecil', 'きゃ しゅ ちょ, っ'],
        ],
        'Membaca kata sederhana',
        'Baca dan tulis 20 kata hiragana sederhana (contoh: salam dan nama benda).',
      ),
    },
    {
      id: 'jp-kata',
      title: 'Katakana',
      description: 'Struktur sama dengan hiragana. Katakana dipakai untuk kata serapan.',
      routine: kanaRoutine,
      links: [irodori],
      units: kanaUnits(
        'jp-kata',
        'katakana',
        [
          ['Baris A & KA', 'アイウエオ カキクケコ'],
          ['Baris SA & TA', 'サシスセソ タチツテト'],
          ['Baris NA & HA', 'ナニヌネノ ハヒフヘホ'],
          ['Baris MA & YA', 'マミムメモ ヤユヨ'],
          ['Baris RA, WA & N', 'ラリルレロ ワヲン'],
          ['Dakuten & handakuten', 'ガ ザ ダ バ パ'],
          ['Youon, ッ & tanda panjang ー', 'キャ シュ チョ, ッ, ー'],
        ],
        'Membaca kata serapan',
        'Baca dan tulis 20 kata serapan katakana (contoh: nama makanan dan minuman).',
      ),
    },
    {
      id: 'jp-starter',
      title: 'Irodori Starter (A1)',
      description: '18 lesson, tiap lesson dirancang ±150–180 menit sehingga dibagi 4 hari. Pakai edisi bahasa Indonesia.',
      links: [irodori],
      units: irodoriUnits('jp-starter', 18),
    },
    {
      id: 'jp-elem1',
      title: 'Irodori Elementary 1 (A2)',
      description: '18 lesson, pola belajar sama dengan Starter.',
      links: [irodori],
      units: irodoriUnits('jp-elem1', 18),
    },
    {
      id: 'jp-elem2',
      title: 'Irodori Elementary 2 (A2)',
      description: '18 lesson, penutup level A2. Setelahnya ada Irodori Pre-Intermediate (A2/B1).',
      links: [irodori],
      units: irodoriUnits('jp-elem2', 18),
    },
  ],
}

/* ------------------------------------------------------------------ */
/* BAHASA INGGRIS                                                      */
/* ------------------------------------------------------------------ */

const englishRoutine = [
  'Tonton atau baca materi hari ini (±20 menit).',
  'Catat 5 kata baru beserta contoh kalimat.',
  'Buat 3 kalimat sendiri memakai materi hari ini.',
  'Latihan tambahan di Duolingo atau BBC Learning English.',
]

const englishLinks = [
  link('Duolingo', 'https://www.duolingo.com/'),
  link('BBC Learning English', 'https://www.bbc.co.uk/learningenglish'),
]

const topicRows = (titles: string[]): Row[] =>
  titles.map((t) => ({ title: t, links: [yt(`belajar ${t} bahasa Inggris untuk pemula`)] }))

const english: Track = {
  id: 'inggris',
  title: 'Bahasa Inggris',
  subtitle: 'Dari nol sampai bisa membaca dokumentasi teknis.',
  stages: [
    {
      id: 'en-basic',
      title: 'Dasar',
      description: 'Pelafalan, kosakata awal, dan kalimat paling sederhana.',
      routine: englishRoutine,
      links: englishLinks,
      units: makeUnits('en-basic', topicRows([
        'Alfabet dan pelafalan huruf',
        'Angka, hari, bulan, dan tanggal',
        'Salam dan perkenalan diri',
        'Pronoun dan to be (am, is, are)',
        'Kalimat tanya: what, where, who, when',
        'Benda sekitar: this, that, these, those, a, an, the',
        'Keluarga dan kata sifat dasar',
        'Kosakata sehari-hari: makanan, tempat, aktivitas',
        'Listening dasar: dengar dan tirukan',
        'Review dan tes Dasar',
      ])),
    },
    {
      id: 'en-grammar',
      title: 'Tata bahasa inti',
      description: 'Tenses dasar dan pola kalimat yang paling sering dipakai.',
      routine: englishRoutine,
      links: englishLinks,
      units: makeUnits('en-grammar', topicRows([
        'Simple present (kalimat positif)',
        'Simple present negatif dan pertanyaan (do, does)',
        'Adverb of frequency',
        'Present continuous',
        'Simple present vs present continuous',
        'Can dan can\'t',
        'There is dan there are',
        'Preposisi tempat: in, on, at',
        'Preposisi waktu: in, on, at',
        'Simple past: regular verbs',
        'Simple past: irregular verbs',
        'Past negatif dan pertanyaan (did)',
        'Past continuous',
        'Future: will',
        'Future: be going to',
        'Comparatives dan superlatives',
        'Countable, uncountable, some, any, much, many',
        'Review dan tes Tata bahasa inti',
      ])),
    },
    {
      id: 'en-inter',
      title: 'Menengah',
      description: 'Perfect tenses, modal, conditional, dan struktur kalimat yang lebih panjang.',
      routine: englishRoutine,
      links: englishLinks,
      units: makeUnits('en-inter', topicRows([
        'Present perfect',
        'Present perfect vs simple past',
        'For dan since',
        'Modal: should, must, have to',
        'Modal: may, might, could',
        'Zero dan first conditional',
        'Second conditional',
        'Passive voice (present dan past)',
        'Relative clauses: who, which, that',
        'Reported speech dasar',
        'Gerund dan infinitive',
        'Phrasal verbs yang sering dipakai',
        'Kata sambung: because, although, however',
        'Review dan tes Menengah',
      ])),
    },
    {
      id: 'en-tech',
      title: 'Membaca & menulis teknis',
      description: 'Menerapkan bahasa Inggris langsung untuk belajar Rust dan berkomunikasi sebagai programmer.',
      routine: englishRoutine,
      links: [link('docs.rs', 'https://docs.rs/'), link('Rust Users Forum', 'https://users.rust-lang.org/'), rustBook],
      units: makeUnits('en-tech', [
        { title: 'Kosakata programming dasar (variable, function, error, compile)', links: [yt('kosakata bahasa Inggris programming untuk pemula')] },
        { title: 'Membaca pesan error compiler Rust', practice: 'Sengaja buat 3 error, terjemahkan tiap pesannya ke bahasa Indonesia.' },
        { title: 'Membaca README project open source', practice: 'Ringkas satu README dengan 5 kalimat bahasa Inggris.' },
        { title: 'Membaca The Rust Book (bab awal) pelan-pelan', practice: 'Baca satu bagian, catat kata baru, jelaskan intinya dengan kata sendiri.', links: [rustBook] },
        { title: 'Menulis commit message dan komentar kode dalam bahasa Inggris', practice: 'Tulis ulang 10 komentar/commit di proyekmu ke bahasa Inggris.' },
        { title: 'Membaca dokumentasi crate di docs.rs', practice: 'Pilih satu crate, baca halaman utamanya, jelaskan fungsinya.', links: [link('docs.rs', 'https://docs.rs/')] },
        { title: 'Listening: tutorial Rust berbahasa Inggris dengan subtitle', practice: 'Tonton 15 menit, catat 10 kata yang sering muncul.' },
        { title: 'Menulis pertanyaan di forum', practice: 'Tulis draft pertanyaan tentang ownership dalam bahasa Inggris.', links: [link('Rust Users Forum', 'https://users.rust-lang.org/')] },
        { title: 'Menulis README untuk proyekmu', practice: 'Tulis README lengkap (deskripsi, instalasi, cara pakai) untuk proyek catatan CLI.' },
        { title: 'Review dan tes akhir', practice: 'Baca satu halaman dokumentasi baru tanpa kamus, lalu ringkas.' },
      ]),
    },
  ],
}

export const MAIN_TRACKS: Track[] = [rust, japanese, english]

export const TRACKS: Track[] = [...MAIN_TRACKS, ...EXTRA_TRACKS]