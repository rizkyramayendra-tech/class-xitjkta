import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Clock3,
  Inbox,
  LaptopMinimal,
  Megaphone,
  MapPin,
  Trophy,
  Users,
  BookOpen,
  Images,
  Router,
  Server,
  ShieldCheck,
  Sparkles,
  RadioTower,
  Wifi,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Beranda,
});

type Announcement = { id: string; title: string; content: string | null; date: string };
type Event = { id: string; title: string; date: string; location: string | null };
type Resource = { id: string; title: string; subject: string | null; type: string; date: string | null };
type Achievement = { id: string; title: string; year: string | null; category: string | null };
type GalleryItem = { id: string; title: string; image_url: string; caption: string | null };
type Schedule = {
  id: string;
  day: string;
  start_time: string | null;
  end_time: string | null;
  subject: string;
  teacher: string | null;
  room: string | null;
  order_no: number;
};

function SectionTitle({ id, title, to, icon: Icon }: { id: string; title: string; to: string; icon: typeof Users }) {
  return (
    <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
      <h2 id={id} className="flex min-w-0 items-center gap-2 font-display text-base font-semibold sm:text-lg">
        <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        {title}
      </h2>
      <Button asChild variant="ghost" size="sm">
        <Link to={to}>
          <span className="hidden sm:inline">Lihat semua</span><ArrowRight className="h-4 w-4" aria-hidden="true" />
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

function HomeEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-5 py-7 text-center">
      <span className="mb-2.5 grid h-9 w-9 place-items-center rounded-md bg-secondary text-primary">
        <Inbox className="h-4 w-4" aria-hidden="true" />
      </span>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

const quickLinks = [
  { to: "/data-siswa", title: "Data Siswa", description: "Informasi anggota kelas XI TJKT A.", icon: Users },
  { to: "/jadwal-pelajaran", title: "Jadwal Pelajaran", description: "Susunan 16 mata pelajaran kelas.", icon: CalendarDays },
  { to: "/tugas-materi", title: "Tugas & Materi", description: "Akses tugas dan bahan pembelajaran.", icon: BookOpen },
  { to: "/pengumuman", title: "Pengumuman", description: "Informasi terbaru untuk seluruh kelas.", icon: Megaphone },
  { to: "/agenda", title: "Agenda", description: "Jadwal kegiatan dan agenda kelas.", icon: ClipboardList },
  { to: "/jadwal-piket", title: "Jadwal Piket", description: "Pembagian tugas kebersihan kelas.", icon: ShieldCheck },
] as const;

function NetworkVisual() {
  return (
    <div className="relative mx-auto aspect-[16/10] w-full max-w-xl overflow-hidden rounded-xl border border-primary/20 bg-card shadow-panel" aria-hidden="true">
      <div className="grid-tech absolute inset-0 opacity-60" />
      <div className="absolute inset-x-0 top-0 h-px bg-primary/50" />
      <div className="absolute left-5 top-5 rounded-md border border-border bg-background/90 px-2.5 py-1.5 font-mono text-[9px] font-semibold uppercase text-muted-foreground shadow-sm backdrop-blur">
        TJKT Network / Online
      </div>
      <svg className="network-lines absolute inset-0 h-full w-full text-primary/55" viewBox="0 0 520 325" fill="none">
        <path d="M82 84 176 120 263 69 357 111 443 72" />
        <path d="M176 120 119 225 250 260 357 207 443 248" />
        <path d="M263 69 270 164 357 207" />
        <path d="M82 84 68 239 119 225" />
        <path d="M270 164 176 120M270 164 250 260M270 164 443 248" />
      </svg>

      <div className="absolute left-[12%] top-[24%] grid h-11 w-11 place-items-center rounded-lg border border-border bg-background text-primary shadow-sm">
        <Server className="h-5 w-5" />
      </div>
      <div className="absolute right-[10%] top-[18%] grid h-9 w-9 place-items-center rounded-full border border-primary/30 bg-background text-primary shadow-sm">
        <Wifi className="h-4 w-4" />
      </div>
      <div className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl border border-primary/30 bg-primary text-primary-foreground shadow-panel">
        <Router className="h-9 w-9" />
      </div>
      <div className="absolute bottom-[18%] left-[14%] grid h-10 w-10 place-items-center rounded-lg border border-border bg-background text-primary shadow-sm">
        <LaptopMinimal className="h-5 w-5" />
      </div>
      <div className="absolute bottom-[18%] right-[12%] grid h-11 w-11 place-items-center rounded-lg border border-border bg-background text-primary shadow-sm">
        <RadioTower className="h-5 w-5" />
      </div>

      <div className="absolute bottom-3 left-3 right-3 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-lg border border-border bg-background/95 px-3 py-2 shadow-sm backdrop-blur sm:bottom-4 sm:left-4 sm:right-4 sm:py-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-secondary text-primary"><Sparkles className="h-4 w-4" /></span>
        <span className="min-w-0">
          <span className="block text-[10px] font-semibold uppercase text-muted-foreground">Kompetensi Keahlian</span>
          <span className="block truncate text-xs font-semibold sm:text-sm">Teknik Jaringan & Telekomunikasi</span>
        </span>
      </div>
    </div>
  );
}

function useJakartaToday() {
  const [today, setToday] = useState<{ day: string; date: string } | null>(null);

  useEffect(() => {
    const now = new Date();
    setToday({
      day: new Intl.DateTimeFormat("id-ID", { weekday: "long", timeZone: "Asia/Jakarta" }).format(now),
      date: new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(now),
    });
  }, []);

  return today;
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
  const schedules = useTable<Schedule>("schedules", { orderBy: "order_no", ascending: true });
  const today = useJakartaToday();
  const todaySchedules = today ? schedules.data?.filter((item) => item.day.toLocaleLowerCase("id-ID") === today.day.toLocaleLowerCase("id-ID")) ?? [] : [];
  const featuredQuickLink = quickLinks.find((item) => item.to === "/jadwal-pelajaran");
  const supportingQuickLinks = quickLinks.filter((item) => item.to !== "/jadwal-pelajaran");

  const stats = [
    { value: "34", label: "Siswa", icon: Users },
    { value: "16", label: "Mata Pelajaran", icon: BookOpen },
    { value: "2", label: "Kegiatan", icon: ClipboardList },
    { value: "2026–2027", label: "Tahun Pembelajaran", icon: CalendarDays },
  ];

  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="pointer-events-none absolute inset-0 grid-tech opacity-30" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-7 px-4 py-8 sm:py-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1.08fr)] lg:gap-12 lg:py-12">
          <div className="reveal-up">
            <Badge variant="secondary" className="mb-3 border border-primary/15 font-mono text-[10px] tracking-normal">
              <RadioTower className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
              PORTAL AKADEMIK TEKNOLOGI
            </Badge>
            <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">
              {site?.['hero_title'] ?? "XI TJKT A"}
            </h1>
            <p className="mt-2 text-base font-semibold leading-snug text-primary sm:text-lg">
              {site?.['hero_subtitle'] ?? "Teknik Jaringan Komputer dan Telekomunikasi"}
            </p>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-muted-foreground">
              <span>{site?.['hero_school'] ?? "SMKN 1 Gunung Talang"}</span>
              <span aria-hidden="true">•</span>
              <span>{site?.['hero_year'] ?? "2026–2027"}</span>
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {site?.['hero_description'] ?? "Pusat informasi akademik, kegiatan, dan pembelajaran kelas XI TJKT A."}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
              <Button asChild className="w-full sm:w-auto">
                <Link to="/profil-kelas">Profil Kelas <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link to="/jadwal-pelajaran">Jadwal Pelajaran</Link>
              </Button>
            </div>
          </div>
          <div className="reveal-up [animation-delay:120ms]">
            <NetworkVisual />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card" aria-label="Ringkasan kelas">
        <div className="stagger-children mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={stat.label} className={`flex items-center gap-3 border-border px-4 py-3.5 sm:px-6 ${index % 2 === 0 ? "border-r" : ""} ${index < 2 ? "border-b lg:border-b-0" : ""} lg:border-r lg:last:border-r-0`}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-secondary text-primary"><stat.icon className="h-4 w-4" aria-hidden="true" /></span>
              <span className="min-w-0">
                <span className="block font-display text-lg font-bold leading-tight sm:text-xl">{stat.value}</span>
                <span className="block text-[11px] leading-tight text-muted-foreground sm:text-xs">{stat.label}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-8 sm:pt-10" aria-labelledby="jadwal-hari-ini">
        <div className="overflow-hidden rounded-lg border border-primary/20 bg-card shadow-panel">
          <div className="grid gap-4 border-b border-border bg-secondary/60 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
                <CalendarCheck2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 id="jadwal-hari-ini" className="font-display text-lg font-semibold">Jadwal Hari Ini</h2>
                <p className="truncate text-xs text-muted-foreground">{today ? `${today.day}, ${today.date}` : "Memuat tanggal hari ini..."}</p>
              </div>
            </div>
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/jadwal-pelajaran">Lihat Jadwal Lengkap <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="p-4 sm:p-5">
            {schedules.isLoading || !today ? (
              <div className="grid gap-3 md:grid-cols-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : todaySchedules.length ? (
              <div className="grid gap-3 md:grid-cols-2">
                {todaySchedules.slice(0, 4).map((item) => (
                  <article key={item.id} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-lg border border-border bg-background p-3.5 transition-colors hover:border-primary/30">
                    <div className="flex min-w-20 flex-col items-center justify-center rounded-md bg-secondary px-2 py-2 font-mono text-[11px] font-semibold text-secondary-foreground">
                      <Clock3 className="mb-1 h-4 w-4 text-primary" aria-hidden="true" />
                      {[item.start_time, item.end_time].filter(Boolean).join("–") || "-"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold">{item.subject}</h3>
                      <p className="mt-1 truncate text-xs text-muted-foreground">{item.teacher || "Guru belum dicantumkan"}</p>
                      {item.room ? <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground"><MapPin className="h-3 w-3" aria-hidden="true" />{item.room}</p> : null}
                    </div>
                  </article>
                ))}
                {todaySchedules.length > 4 ? <p className="text-xs text-muted-foreground md:col-span-2">Dan {todaySchedules.length - 4} pelajaran lainnya pada jadwal lengkap.</p> : null}
              </div>
            ) : (
              <HomeEmptyState title="Belum ada jadwal untuk hari ini." description="Jadwal akan ditampilkan setelah administrator mengisinya." />
            )}
            <Button asChild variant="outline" size="sm" className="mt-3 w-full sm:hidden">
              <Link to="/jadwal-pelajaran">Lihat Jadwal Lengkap <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:py-10" aria-labelledby="akses-cepat">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-primary">Akses Cepat</p>
            <h2 id="akses-cepat" className="font-display text-xl font-bold sm:text-2xl">Informasi kelas dalam satu tempat</h2>
          </div>
        </div>
        <div className="stagger-children grid gap-3 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.7fr)]">
          {featuredQuickLink ? (
            <Link to={featuredQuickLink.to} className="group relative grid min-h-40 grid-cols-[minmax(0,1fr)_auto] overflow-hidden rounded-lg border border-primary/20 bg-primary p-5 text-primary-foreground shadow-panel transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span className="relative z-10 flex min-w-0 flex-col justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-primary-foreground/15"><featuredQuickLink.icon className="h-5 w-5" aria-hidden="true" /></span>
                <span className="mt-6">
                  <span className="block font-display text-lg font-semibold">{featuredQuickLink.title}</span>
                  <span className="mt-1 block max-w-xs text-xs leading-relaxed text-primary-foreground/80">{featuredQuickLink.description}</span>
                </span>
              </span>
              <ArrowRight className="relative z-10 h-5 w-5 self-end transition-transform group-hover:translate-x-1" aria-hidden="true" />
              <CalendarDays className="absolute -bottom-5 right-7 h-28 w-28 text-primary-foreground/10" aria-hidden="true" />
            </Link>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2">
            {supportingQuickLinks.map((item, index) => (
              <Link key={item.to} to={item.to} className={`panel panel-interactive group grid min-h-24 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3.5 ${index === supportingQuickLinks.length - 1 ? "sm:col-span-2" : ""}`}>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-secondary text-primary"><item.icon className="h-4 w-4" aria-hidden="true" /></span>
                <span className="min-w-0">
                  <span className="block font-display text-sm font-semibold">{item.title}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{item.description}</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-border bg-surface">
      <div className="stagger-children mx-auto grid max-w-7xl gap-7 px-4 py-8 lg:grid-cols-2 lg:py-10">
        <section aria-labelledby="pengumuman-terbaru">
          <SectionTitle id="pengumuman-terbaru" title="Pengumuman Terbaru" to="/pengumuman" icon={Megaphone} />
          {announcements.isLoading ? (
            <ListSkeleton />
          ) : announcements.data?.length ? (
            <ul className="space-y-3">
              {announcements.data.map((item) => (
                 <li key={item.id} className="panel panel-interactive border-l-2 border-l-primary p-4">
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.content}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{formatDate(item.date)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <HomeEmptyState title="Belum ada pengumuman." description="Informasi terbaru akan ditampilkan setelah administrator menambahkannya." />
          )}
        </section>

        <section aria-labelledby="agenda-terdekat">
          <SectionTitle id="agenda-terdekat" title="Agenda Terdekat" to="/agenda" icon={CalendarDays} />
          {events.isLoading ? (
            <ListSkeleton />
          ) : events.data?.length ? (
            <ul className="space-y-3">
              {events.data.map((item) => (
                 <li key={item.id} className="panel panel-interactive grid grid-cols-[auto_minmax(0,1fr)] gap-3 p-4">
                   <span className="grid h-9 w-9 place-items-center rounded-md bg-secondary text-primary"><CalendarCheck2 className="h-4 w-4" aria-hidden="true" /></span>
                   <span className="min-w-0">
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDate(item.date)} · {item.location ?? "-"}
                  </p>
                   </span>
                </li>
              ))}
            </ul>
          ) : (
            <HomeEmptyState title="Belum ada agenda." description="Agenda kelas akan ditampilkan setelah administrator menambahkannya." />
          )}
        </section>

        <section aria-labelledby="tugas-materi-terbaru">
          <SectionTitle id="tugas-materi-terbaru" title="Tugas & Materi Terbaru" to="/tugas-materi" icon={BookOpen} />
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
            <HomeEmptyState title="Belum ada tugas atau materi." description="Data akan ditampilkan setelah administrator menambahkannya." />
          )}
        </section>

        <section aria-labelledby="prestasi-terbaru">
          <SectionTitle id="prestasi-terbaru" title="Prestasi Terbaru" to="/prestasi" icon={Trophy} />
          {prestasi.isLoading ? (
            <ListSkeleton />
          ) : prestasi.data?.length ? (
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
            <HomeEmptyState title="Belum ada prestasi." description="Prestasi kelas akan ditampilkan setelah administrator menambahkannya." />
          )}
        </section>

        <section aria-labelledby="galeri-terbaru" className="lg:col-span-2">
          <SectionTitle id="galeri-terbaru" title="Galeri Terbaru" to="/galeri" icon={Images} />
          {galeri.isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{[0, 1, 2, 3, 4, 5].map((item) => <Skeleton key={item} className="aspect-square w-full" />)}</div>
          ) : galeri.data?.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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
            <HomeEmptyState title="Belum ada foto." description="Galeri kelas akan ditampilkan setelah administrator menambahkannya." />
          )}
        </section>
      </div>
      </div>
    </SiteLayout>
  );
}
