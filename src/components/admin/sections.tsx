import { CrudManager, type CrudConfig } from "@/components/admin/CrudManager";
import { ContentEditor, type ContentField } from "@/components/admin/ContentEditor";
import { DAYS, SUBJECTS, type SiteKey } from "@/lib/cms";

const STATUS_FIELD = {
  name: "status",
  label: "Status Publikasi",
  type: "select" as const,
  options: ["published", "draft"] as const,
};

export const CRUD_SECTIONS: Record<string, CrudConfig> = {
  "data-siswa": {
    table: "students",
    title: "Data Siswa",
    description: "Kelola daftar siswa XI TJKT A.",
    singular: "Siswa",
    orderBy: "order_no",
    ascending: true,
    defaults: { status: "published", order_no: 0, gender: "L" },
    columns: [
      { name: "order_no", label: "No" },
      { name: "name", label: "Nama" },
      { name: "nickname", label: "Panggilan" },
      { name: "gender", label: "L/P" },
      { name: "status", label: "Status" },
    ],
    fields: [
      { name: "order_no", label: "Nomor Urut", type: "number" },
      { name: "name", label: "Nama Lengkap", type: "text", required: true },
      { name: "nickname", label: "Nama Panggilan", type: "text" },
      { name: "nis", label: "NIS", type: "text" },
      { name: "gender", label: "Jenis Kelamin", type: "select", options: ["L", "P"] },
      { name: "info", label: "Keterangan", type: "textarea" },
      { name: "photo_url", label: "Foto Siswa", type: "image", folder: "siswa" },
      STATUS_FIELD,
    ],
  },
  "jadwal-pelajaran": {
    table: "schedules",
    title: "Jadwal Pelajaran",
    description: "Atur jadwal mata pelajaran per hari.",
    singular: "Jadwal",
    orderBy: "order_no",
    ascending: true,
    defaults: { status: "published", order_no: 1, day: "Senin" },
    columns: [
      { name: "day", label: "Hari" },
      { name: "order_no", label: "Jam ke" },
      { name: "subject", label: "Mata Pelajaran" },
      { name: "teacher", label: "Guru" },
      { name: "status", label: "Status" },
    ],
    fields: [
      { name: "day", label: "Hari", type: "select", options: DAYS },
      { name: "order_no", label: "Jam Ke", type: "number" },
      { name: "subject", label: "Mata Pelajaran", type: "select", options: SUBJECTS, required: true },
      { name: "teacher", label: "Guru Pengampu", type: "text" },
      { name: "start_time", label: "Jam Mulai (mis. 07:30)", type: "text" },
      { name: "end_time", label: "Jam Selesai (mis. 09:00)", type: "text" },
      { name: "room", label: "Ruang", type: "text" },
      STATUS_FIELD,
    ],
  },
  "tugas-materi": {
    table: "resources",
    title: "Tugas & Materi",
    description: "Unggah tugas, materi, dan modul pembelajaran.",
    singular: "Tugas/Materi",
    orderBy: "date",
    defaults: { status: "published", type: "tugas" },
    columns: [
      { name: "title", label: "Judul" },
      { name: "type", label: "Jenis" },
      { name: "subject", label: "Mapel" },
      { name: "due_date", label: "Deadline" },
      { name: "status", label: "Status" },
    ],
    fields: [
      { name: "title", label: "Judul", type: "text", required: true },
      { name: "type", label: "Jenis", type: "select", options: ["tugas", "materi", "modul"] },
      { name: "subject", label: "Mata Pelajaran", type: "select", options: SUBJECTS },
      { name: "description", label: "Deskripsi", type: "textarea" },
      { name: "date", label: "Tanggal", type: "date" },
      { name: "due_date", label: "Batas Pengumpulan", type: "date" },
      { name: "file_url", label: "Berkas (PDF/Dokumen)", type: "file", folder: "materi" },
      { name: "link_url", label: "Tautan Eksternal", type: "text", placeholder: "https://" },
      STATUS_FIELD,
    ],
  },
  pengumuman: {
    table: "announcements",
    title: "Pengumuman",
    description: "Kelola pengumuman kelas.",
    singular: "Pengumuman",
    orderBy: "date",
    defaults: { status: "published", pinned: false },
    columns: [
      { name: "title", label: "Judul" },
      { name: "date", label: "Tanggal" },
      { name: "status", label: "Status" },
    ],
    fields: [
      { name: "title", label: "Judul", type: "text", required: true },
      { name: "content", label: "Isi Pengumuman", type: "textarea" },
      { name: "date", label: "Tanggal", type: "date" },
      { name: "image_url", label: "Gambar Pendukung", type: "image", folder: "pengumuman" },
      { name: "pinned", label: "Tandai Penting (disematkan)", type: "switch" },
      STATUS_FIELD,
    ],
  },
  agenda: {
    table: "events",
    title: "Agenda Kegiatan",
    description: "Kelola agenda dan kegiatan kelas.",
    singular: "Agenda",
    orderBy: "date",
    ascending: true,
    defaults: { status: "published" },
    columns: [
      { name: "title", label: "Kegiatan" },
      { name: "date", label: "Tanggal" },
      { name: "location", label: "Lokasi" },
      { name: "status", label: "Status" },
    ],
    fields: [
      { name: "title", label: "Nama Kegiatan", type: "text", required: true },
      { name: "date", label: "Tanggal", type: "date" },
      { name: "time", label: "Waktu (mis. 08.00 WIB)", type: "text" },
      { name: "location", label: "Lokasi", type: "text" },
      { name: "description", label: "Deskripsi", type: "textarea" },
      { name: "image_url", label: "Gambar", type: "image", folder: "agenda" },
      STATUS_FIELD,
    ],
  },
  "jadwal-piket": {
    table: "duty_roster",
    title: "Jadwal Piket",
    description: "Kelola pembagian regu piket harian.",
    singular: "Petugas Piket",
    orderBy: "order_no",
    ascending: true,
    defaults: { status: "published", day: "Senin", order_no: 1 },
    columns: [
      { name: "day", label: "Hari" },
      { name: "order_no", label: "No" },
      { name: "member_name", label: "Nama" },
      { name: "status", label: "Status" },
    ],
    fields: [
      { name: "day", label: "Hari", type: "select", options: DAYS },
      { name: "member_name", label: "Nama Petugas", type: "text", required: true },
      { name: "order_no", label: "Urutan", type: "number" },
      STATUS_FIELD,
    ],
  },
  prestasi: {
    table: "achievements",
    title: "Prestasi",
    description: "Kelola prestasi siswa dan kelas.",
    singular: "Prestasi",
    orderBy: "year",
    defaults: { status: "published" },
    columns: [
      { name: "title", label: "Prestasi" },
      { name: "category", label: "Kategori" },
      { name: "year", label: "Tahun" },
      { name: "status", label: "Status" },
    ],
    fields: [
      { name: "title", label: "Nama Prestasi", type: "text", required: true },
      { name: "category", label: "Kategori", type: "text", placeholder: "Akademik / Non-Akademik" },
      { name: "year", label: "Tahun", type: "text" },
      { name: "participants", label: "Peraih", type: "text" },
      { name: "description", label: "Deskripsi", type: "textarea" },
      { name: "image_url", label: "Foto/Sertifikat", type: "image", folder: "prestasi" },
      STATUS_FIELD,
    ],
  },
  galeri: {
    table: "gallery",
    title: "Galeri",
    description: "Kelola dokumentasi foto kegiatan kelas.",
    singular: "Foto",
    orderBy: "order_no",
    ascending: true,
    defaults: { status: "published", order_no: 0 },
    columns: [
      { name: "title", label: "Judul" },
      { name: "category", label: "Kategori" },
      { name: "date", label: "Tanggal" },
      { name: "status", label: "Status" },
    ],
    fields: [
      { name: "title", label: "Judul Foto", type: "text", required: true },
      { name: "image_url", label: "Foto", type: "image", folder: "galeri" },
      { name: "category", label: "Kategori", type: "text" },
      { name: "caption", label: "Keterangan", type: "textarea" },
      { name: "date", label: "Tanggal", type: "date" },
      { name: "order_no", label: "Urutan", type: "number" },
      STATUS_FIELD,
    ],
  },
};

type ContentSection = {
  key: SiteKey;
  title: string;
  description: string;
  fields: ContentField[];
};

export const CONTENT_SECTIONS: Record<string, ContentSection> = {
  tampilan: {
    key: "site",
    title: "Tampilan Website",
    description: "Ubah judul, hero, logo, dan footer website.",
    fields: [
      { name: "site_title", label: "Judul Website" },
      { name: "hero_title", label: "Judul Hero" },
      { name: "hero_subtitle", label: "Subjudul Hero" },
      { name: "hero_school", label: "Nama Sekolah di Hero" },
      { name: "hero_year", label: "Tahun Ajaran" },
      { name: "hero_description", label: "Deskripsi Hero", type: "textarea" },
      { name: "hero_image_url", label: "Gambar Hero", type: "image" },
      { name: "logo_url", label: "Logo Website", type: "image" },
      { name: "footer_text", label: "Teks Footer" },
      { name: "footer_note", label: "Catatan Footer" },
    ],
  },
  "profil-kelas": {
    key: "class_profile",
    title: "Profil Kelas",
    description: "Kelola identitas, visi, misi, dan motto kelas.",
    fields: [
      { name: "class_name", label: "Nama Kelas" },
      { name: "major", label: "Jurusan" },
      { name: "school", label: "Sekolah" },
      { name: "year", label: "Tahun Ajaran" },
      { name: "student_count", label: "Jumlah Siswa" },
      { name: "homeroom", label: "Wali Kelas" },
      { name: "about", label: "Tentang Kelas", type: "textarea" },
      { name: "vision", label: "Visi", type: "textarea" },
      { name: "mission", label: "Misi (pisahkan dengan baris baru)", type: "textarea" },
      { name: "goals", label: "Tujuan (pisahkan dengan baris baru)", type: "textarea" },
      { name: "motto", label: "Motto" },
      { name: "image_url", label: "Foto Kelas", type: "image" },
    ],
  },
  "wali-kelas": {
    key: "teacher",
    title: "Wali Kelas",
    description: "Kelola profil dan pesan wali kelas.",
    fields: [
      { name: "name", label: "Nama Wali Kelas" },
      { name: "position", label: "Jabatan" },
      { name: "photo_url", label: "Foto", type: "image" },
      { name: "description", label: "Deskripsi", type: "textarea" },
      { name: "message", label: "Pesan untuk Siswa", type: "textarea" },
    ],
  },
  "informasi-sekolah": {
    key: "school_info",
    title: "Informasi Sekolah",
    description: "Kelola profil dan kontak sekolah.",
    fields: [
      { name: "name", label: "Nama Sekolah" },
      { name: "address", label: "Alamat", type: "textarea" },
      { name: "description", label: "Deskripsi", type: "textarea" },
      { name: "majors", label: "Jurusan (pisahkan dengan baris baru)", type: "textarea" },
      { name: "phone", label: "Telepon" },
      { name: "email", label: "Email" },
      { name: "website", label: "Website" },
      { name: "instagram", label: "Instagram" },
      { name: "facebook", label: "Facebook" },
      { name: "youtube", label: "YouTube" },
      { name: "logo_url", label: "Logo Sekolah", type: "image" },
      { name: "photo_url", label: "Foto Sekolah", type: "image" },
    ],
  },
  kontak: {
    key: "contact",
    title: "Kontak",
    description: "Kelola informasi kontak dan peta lokasi.",
    fields: [
      { name: "address", label: "Alamat", type: "textarea" },
      { name: "email", label: "Email" },
      { name: "phone", label: "Telepon" },
      { name: "whatsapp", label: "WhatsApp" },
      { name: "instagram", label: "Instagram" },
      { name: "website", label: "Website" },
      { name: "map_embed", label: "URL Embed Google Maps", type: "textarea", hint: "Gunakan tautan embed dari Google Maps." },
      { name: "note", label: "Catatan", type: "textarea" },
    ],
  },
};

export function SectionRenderer({ slug }: { slug: string }) {
  const crud = CRUD_SECTIONS[slug];
  if (crud) return <CrudManager config={crud} />;
  const content = CONTENT_SECTIONS[slug];
  if (content)
    return (
      <ContentEditor
        contentKey={content.key}
        title={content.title}
        description={content.description}
        fields={content.fields}
      />
    );
  return null;
}
