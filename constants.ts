import { Extracurricular, Announcement } from './types';

export const SCHOOL_LOGO_PATH = 'https://i.imgur.com/qZyL3sA.png'; 
export const SCHOOL_NAME = 'SMK NEGERI 9 SEMARANG';

export const EXTRACURRICULARS: Extracurricular[] = [
  { id: 1, name: 'Basket', description: 'Kembangkan skill dribble, shooting, dan kerja sama tim di lapangan.', image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 2, name: 'Paduan Suara', description: 'Salurkan bakat menyanyimu dan harmonisasikan suara dalam tim.', image: 'https://www.hipwee.com/wp-content/uploads/2017/08/hipwee-22-03-2014-Konser-Paragita-03.jpg' },
  { id: 3, name: 'Paskibra', description: 'Bentuk kedisiplinan, kepemimpinan, dan cinta tanah air.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp69WK5fHq5q0gboNlIITMchNPkgsrwsoCmA&s' },
  { id: 4, name: 'Futsal', description: 'Tingkatkan kecepatan, teknik, dan strategi permainan futsalmu.', image: 'https://awsimages.detik.net.id/community/media/visual/2023/10/13/teknik-dasar-dalam-permainan-futsal-yang-harus-dikuasai.jpeg?w=800' },
  { id: 5, name: 'Band', description: 'Ekspresikan dirimu melalui musik dan tampil di berbagai acara sekolah.', image: 'https://media.istockphoto.com/id/1391884768/vector/alternative-band-musicians-concert-with-crowd-silhouettes.jpg?s=612x612&w=0&k=20&c=vzy4deVEqBKVAGXuo5H_Bl2h9khJTq_dO2vNl_uFGCQ=' },
  { id: 6, name: 'PMR', description: 'Belajar pertolongan pertama dan menjadi relawan kemanusiaan.', image: 'https://asset.kompas.com/crops/JwYFOuKAad9Z7T9yez4OfyJliFk=/0x0:1999x1332/1200x800/data/photo/2020/02/24/5e53bd6ca9933.jpg' },
  { id: 7, name: 'Pramuka', description: 'Kembangkan karakter, kemandirian, dan cinta alam melalui kegiatan kepramukaan.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMfO1Si-rwH8bmEt1eAP-Pz6ZoGwusJW6NdQ&s' },
  { id: 8, name: 'Robotika', description: 'Pelajari teknologi, programming, dan inovasi dalam bidang robotika.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzp6-KOsbiA7dUyXrPdfDEy_E5NpYFflsqYA&s' },
  { id: 9, name: 'Karawitan', description: 'Lestarikan seni musik tradisional Jawa dengan gamelan dan vokal.', image: 'https://assets-a1.kompasiana.com/items/album/2018/03/09/budaya-kental-gamelan-jogja-5aa1abafdd0fa83c570278f2.jpg?t=o&v=770' },
  { id: 10, name: 'Tari', description: 'Ekspresikan budaya dan seni melalui gerakan tari tradisional dan modern.', image: 'https://mediacenter.palangkaraya.go.id/wp-content/uploads/sites/24/2025/05/IMG_20250520_232519_1028_x_768_piksel.jpg' },
  { id: 11, name: 'Dance', description: 'Kembangkan kreativitas dan percaya diri melalui berbagai jenis tarian modern.', image: 'https://www.rockstaracademy.com/lib/images/news/contemporary-dance-for-beginners.jpeg' },
  { id: 12, name: 'Kolintang', description: 'Mainkan alat musik tradisional Minahasa dan tampil dalam berbagai pertunjukan.', image: 'https://www.newstimes.id/wp-content/uploads/2024/05/Yuk-Mengenal-Fakta-Kolintang-Asal-Minahasa-yang-Diakui-Dunia-Internasional.jpg' },
  { id: 13, name: 'Angklung', description: 'Pelajari dan mainkan alat musik bambu khas Sunda dalam ensemble musik.', image: 'https://data.hellowork-asia.com/images/blogs/2311-651ebff84bad4.jpeg' },
  { id: 14, name: 'BTQ', description: 'Tingkatkan kemampuan baca tulis Al-Quran dan pemahaman agama Islam.', image: 'https://smpn4tp.sch.id/wp-content/uploads/2023/01/WhatsApp-Image-2023-01-29-at-20.36.38.jpeg' },
  { id: 15, name: 'Rebana', description: 'Pelajari seni musik islami dengan alat musik rebana dan sholawat.', image: 'https://www.senibudayabetawi.com/wp-content/uploads/2021/04/IMG_20210425_112939.jpg' }
];
// As per user request for class selection
export const CLASSES: string[] = [
  'X AKL 1', 'X AKL 2',
  'X MPLB 1', 'X MPLB 2', 'X MPLB 3',
  'X PM 1', 'X PM 2', 'X PM 3',
  'X PPLG',
  'XI AKL 1', 'XI AKL 2',
  'XI MPLB 1', 'XI MPLB 2', 'XI MPLB 3',
  'XI PM 1', 'XI PM 2', 'XI PM 3',
  'XI PPLG',
  'XII AKL 1', 'XII AKL 2',
  'XII MPLB 1', 'XII MPLB 2', 'XII MPLB 3',
  'XII PM 1', 'XII PM 2', 'XII PM 3',
  'XII PPLG',
];

// Placeholder data based on the user's image
export const ANNOUNCEMENTS: Announcement[] = [
    { 
        id: 1, 
        title: 'Hasil Seleksi Ekstra Basket', 
        description: 'Diumumkan tanggal 20 September 2025.',
        sheetUrl: 'https://docs.google.com/spreadsheets/d/1YEcl1vHjF31g13jqTuNpRiOUohDbORBRNx2omn4bFfc/edit?usp=sharing',
        borderColor: 'border-rose-500',
        icon: 'M10 18a8 8 0 100-16 8 8 0 000 16zm-2-7a2 2 0 11-4 0 2 2 0 014 0zM14 6a2 2 0 11-4 0 2 2 0 014 0z'
    },
    { 
        id: 2, 
        title: 'Audisi Paduan Suara', 
        description: 'Dilaksanakan tanggal 15 September 2025.',
        sheetUrl: 'https://docs.google.com/spreadsheets/d/1ne0sIE-KTWN1FJg9ANOoBXA_bZmxxmKCXwt8T-Zoc7I/edit?usp=sharing',
        borderColor: 'border-green-500',
        icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z'
    },
    { 
        id: 3, 
        title: 'Seleksi Paskibra', 
        description: 'Pendaftaran dibuka hingga 25 September 2025.',
        sheetUrl: 'https://docs.google.com/spreadsheets/d/1vUSQPmmiqEZRc6airOa7f86NcRy17BPTnv8m4LebBEo/edit?usp=sharing',
        borderColor: 'border-purple-500',
        icon: 'M3 21v-2l7-4L17 4l2 2-10 13H3z'
    },
    { 
        id: 4, 
        title: 'Ekstra Futsal', 
        description: 'Pengumuman akan diadakan pada 18 September 2025.',
        sheetUrl: 'https://docs.google.com/spreadsheets/d/1-u_rCR5ZOiN4tkCPItrBxLdXL2zSOFHpp1FWMyq9YJM/edit?usp=sharing',
        borderColor: 'border-red-500',
        icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9v-2h2v2zm0-4H9V7h2v6z'
    },
];
