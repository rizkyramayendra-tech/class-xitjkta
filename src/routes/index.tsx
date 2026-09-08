import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  Megaphone,
  Trophy,
  Users,
  BookOpen,
  Images,
  Router,
  Server,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  RadioTower,
  Wifi,
} from "lucide-react";
import { EmptyState, SiteLayout } from "@/components/site/SiteLayout";
import { StorageImage } from "@/components/StorageImage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, useSiteContent, useTable } from "@/lib/cms";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "XI TJKT A — Portal Kelas SMKN 1 Gunung Talang" },
      {
        name: "description",
        content:
          "Portal resmi kelas XI TJKT A SMKN 1 Gunung Talang. Informasi jadwal pelajaran, tugas, materi, agenda, prestasi, dan galeri kelas.",
      },
      { property: "og:title", content: "XI TJKT A — Portal Kelas SMKN 1 Gunung Talang" },
      {
        property: "og:description",
        content: "Informasi jadwal, tugas, agenda, prestasi, dan galeri kelas XI TJKT A.",
      },
    ],
  }),
  component: Beranda,
});

type Announcement = { id: string; title: string; content: string | null; date: string };
type Event = { id: string; title: string; date: string; location: string | null };
type Resource = { id: string; title: string; subject: string | null; type: string; date: string | null };
type Achievement = { id: string; title: string; year: string | null; category: string | null };
type GalleryItem = { id: string; title: string; image_url: string; caption: string | null };

function SectionTitle({ title, to, icon: Icon }: { title: string; to: string; icon: typeof Users }) {
  return (
    <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
        {title}
      </h2>
      <Button asChild variant="ghost" size="sm">
        <Link to={to}>
          Lihat semua <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-2">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

const quickLinks = [
  { to: "/data-siswa", title: "Data Siswa", description: "Informasi anggota kelas XI TJKT A.", icon: Users },
  { to: "/jadwal-pelajaran", title: "Jadwal Pelajaran", description: "Susunan 17 mata pelajaran kelas.", icon: CalendarDays },
  { to: "/tugas-materi", title: "Tugas & Materi", description: "Akses tugas dan bahan pembelajaran.", icon: BookOpen },
  { to: "/pengumuman", title: "Pengumuman", description: "Informasi terbaru untuk seluruh kelas.", icon: Megaphone },
  { to: "/agenda", title: "Agenda", description: "Jadwal kegiatan dan agenda kelas.", icon: ClipboardList },
  { to: "/jadwal-piket", title: "Jadwal Piket", description: "Pembagian tugas kebersihan kelas.", icon: ShieldCheck },
] as const;

function NetworkVisual() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-panel" aria-hidden="true">
      <div className="grid-tech absolute inset-0 opacity-50" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-accent/70 to-transparent" />
      <svg className="network-lines absolute inset-0 h-full w-full text-primary/40" viewBox="0 0 520 390" fill="none">
        <path d="M95 88 188 138 268 75 360 122 435 74" />
        <path d="M188 138 122 235 246 288 360 232 435 300" />
        <path d="M268 75 275 190 360 232" />
        <path d="M95 88 65 285 122 235" />
        <path d="M275 190 188 138M275 190 246 288M275 190 435 300" />
      </svg>

      <div className="absolute left-[12%] top-[17%] grid h-11 w-11 place-items-center rounded-lg border border-border bg-background text-primary shadow-sm">
        <Server className="h-5 w-5" />
      </div>
      <div className="absolute right-[10%] top-[13%] grid h-9 w-9 place-items-center rounded-full border border-primary/30 bg-background text-primary shadow-sm">
        <Wifi className="h-4 w-4" />
      </div>
      <div className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl border border-primary/30 bg-primary text-primary-foreground shadow-panel">
        <Router className="h-9 w-9" />
      </div>
      <div className="absolute bottom-[17%] left-[15%] grid h-10 w-10 place-items-center rounded-lg border border-border bg-background text-primary shadow-sm">
        <UserRoundCheck className="h-5 w-5" />
      </div>
      <div className="absolute bottom-[16%] right-[12%] grid h-11 w-11 place-items-center rounded-lg border border-border bg-background text-primary shadow-sm">
        <RadioTower className="h-5 w-5" />
      </div>

      <div className="absolute bottom-4 left-4 right-4 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-lg border border-border bg-background/90 px-3 py-2.5 shadow-sm backdrop-blur">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-secondary text-primary"><Sparkles className="h-4 w-4" /></span>
        <span className="min-w-0">
          <span className="block text-[10px] font-semibold uppercase text-muted-foreground">Kompetensi Keahlian</span>
          <span className="block truncate text-xs font-semibold sm:text-sm">Teknik Jaringan & Telekomunikasi</span>
        </span>
      </div>
    </div>
  );
}

function Beranda() {
  const { data: site } = useSiteContent("site");
  const { data: profile } = useSiteContent("class_profile");
  const announcements = useTable<Announcement>("announcements", {
    orderBy: "date",
    limit: 3,
  });
  const events = useTable<Event>("events", { orderBy: "date", ascending: true, limit: 3 });
  const tugas = useTable<Resource>("resources", { orderBy: "created_at", limit: 3 });
  const prestasi = useTable<Achievement>("achievements", { limit: 3 });
  const galeri = useTable<GalleryItem>("gallery", { orderBy: "order_no", ascending: true, limit: 6 });

  const stats = [
    { value: profile?.['student_count'] ?? "34", label: "Siswa", icon: Users },
    { value: "1", label: "Wali Kelas", icon: GraduationCap },
    { value: "17", label: "Mata Pelajaran", icon: BookOpen },
    { value: profile?.['year'] ?? "2026–2027", label: "Tahun Pembelajaran", icon: CalendarDays },
  ];

  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="pointer-events-none absolute inset-0 grid-tech opacity-25" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:py-12 lg:grid-cols-[1fr_0.9fr] lg:gap-12 lg:py-16">
          <div className="reveal-up">
            <Badge variant="secondary" className="mb-4">
              <RadioTower className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
              Portal Akademik Teknologi
            </Badge>
            <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {site?.['hero_title'] ?? "XI TJKT A"}
            </h1>
            <p className="mt-3 text-base font-semibold text-primary sm:text-lg">
              {site?.['hero_subtitle'] ?? "Teknik Jaringan Komputer dan Telekomunikasi"}
            </p>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-muted-foreground">
              <span>{site?.['hero_school'] ?? "SMKN 1 Gunung Talang"}</span>
              <span aria-hidden="true">•</span>
              <span>{site?.['hero_year'] ?? "2026–2027"}</span>
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {site?.['hero_description'] ?? "Pusat informasi akademik dan kegiatan kelas XI TJKT A yang ringkas, terhubung, dan mudah diakses."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/profil-kelas">Profil Kelas <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/jadwal-pelajaran">Jadwal Pelajaran</Link>
              </Button>
            </div>
          </div>
          <div className="reveal-up [animation-delay:120ms]">
            <NetworkVisual />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="stagger-children mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={stat.label} className={`flex items-center gap-3 border-border px-4 py-4 sm:px-6 ${index % 2 === 0 ? "border-r" : ""} ${index < 2 ? "border-b lg:border-b-0" : ""} lg:border-r lg:last:border-r-0`}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-secondary text-primary"><stat.icon className="h-4 w-4" aria-hidden="true" /></span>
              <span className="min-w-0">
                <span className="block font-display text-lg font-bold sm:text-xl">{stat.value}</span>
                <span className="block truncate text-[11px] text-muted-foreground sm:text-xs">{stat.label}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-primary">Akses Cepat</p>
            <h2 className="font-display text-2xl font-bold">Informasi kelas dalam satu tempat</h2>
          </div>
        </div>
        <div className="stagger-children grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((item) => (
            <Link key={item.to} to={item.to} className="panel panel-interactive group grid min-h-28 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-secondary text-primary"><item.icon className="h-5 w-5" aria-hidden="true" /></span>
              <span className="min-w-0">
                <span className="block font-display text-sm font-semibold">{item.title}</span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{item.description}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <div className="border-t border-border bg-surface">
      <div className="stagger-children mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-2 lg:py-12">
        <section aria-labelledby="pengumuman-terbaru">
          <SectionTitle title="Pengumuman Terbaru" to="/pengumuman" icon={Megaphone} />
          {announcements.isLoading ? (
            <ListSkeleton />
          ) : announcements.data?.length ? (
            <ul className="space-y-3">
              {announcements.data.map((item) => (
                 <li key={item.id} className="panel panel-interactive p-4">
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.content}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{formatDate(item.date)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState text="Belum ada pengumuman. Data akan ditampilkan di sini setelah tersedia." />
          )}
        </section>

        <section aria-labelledby="agenda-terdekat">
          <SectionTitle title="Agenda Terdekat" to="/agenda" icon={CalendarDays} />
          {events.isLoading ? (
            <ListSkeleton />
          ) : events.data?.length ? (
            <ul className="space-y-3">
              {events.data.map((item) => (
                 <li key={item.id} className="panel panel-interactive p-4">
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDate(item.date)} · {item.location ?? "-"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState text="Belum ada agenda. Data akan ditampilkan di sini setelah tersedia." />
          )}
        </section>

        <section aria-labelledby="tugas-materi-terbaru">
          <SectionTitle title="Tugas & Materi Terbaru" to="/tugas-materi" icon={BookOpen} />
          {tugas.isLoading ? (
            <ListSkeleton />
          ) : tugas.data?.length ? (
            <ul className="space-y-3">
              {tugas.data.map((item) => (
                 <li key={item.id} className="panel panel-interactive p-4">
                   <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
                     <span className="min-w-0">
                       <span className="block truncate font-semibold">{item.title}</span>
                       <span className="mt-1 block text-sm text-muted-foreground">{item.subject ?? "-"}</span>
                     </span>
                     <Badge variant="secondary" className="h-fit capitalize">{item.type}</Badge>
                   </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState text="Belum ada tugas atau materi. Data akan ditampilkan di sini setelah tersedia." />
          )}
        </section>

        <section aria-labelledby="prestasi-terbaru">
          <SectionTitle title="Prestasi Terbaru" to="/prestasi" icon={Trophy} />
          {prestasi.data?.length ? (
            <ul className="space-y-3">
              {prestasi.data.map((item) => (
                 <li key={item.id} className="panel panel-interactive p-4">
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {[item.category, item.year].filter(Boolean).join(" · ") || "-"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState text="Belum ada prestasi. Data akan ditampilkan di sini setelah tersedia." />
          )}
        </section>

        <section aria-labelledby="galeri-terbaru">
          <SectionTitle title="Galeri Terbaru" to="/galeri" icon={Images} />
          {galeri.data?.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {galeri.data.map((item) => (
                <StorageImage
                  key={item.id}
                  src={item.image_url}
                  alt={item.caption ?? item.title}
                  className="aspect-square w-full rounded-lg border border-border object-cover shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-panel"
                />
              ))}
            </div>
          ) : (
            <EmptyState text="Belum ada foto. Galeri akan ditampilkan di sini setelah tersedia." />
          )}
        </section>
      </div>
      </div>
    </SiteLayout>
  );
}
