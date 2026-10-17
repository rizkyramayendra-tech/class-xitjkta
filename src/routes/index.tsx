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
  Users,
  BookOpen,
  Router,
  Server,
  RadioTower,
  Wifi,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, useSiteContent, useTable } from "@/lib/cms";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
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

function HomeEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-32 items-center gap-3 py-6">
      <Inbox className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

const quickLinks = [
  { to: "/jadwal-pelajaran", title: "Jadwal Pelajaran", icon: CalendarDays },
  { to: "/data-siswa", title: "Data Siswa", icon: Users },
  { to: "/tugas-materi", title: "Tugas & Materi", icon: BookOpen },
  { to: "/agenda", title: "Kegiatan", icon: ClipboardList },
] as const;

function NetworkVisual() {
  return (
    <div className="relative mx-auto aspect-[16/10] w-full max-w-[340px] overflow-hidden rounded-lg border border-border bg-card" aria-hidden="true">
      <div className="grid-tech absolute inset-0 opacity-25" />
      <div className="absolute inset-x-0 top-0 h-px bg-primary/50" />
      <div className="absolute left-5 top-5 rounded-md border border-border bg-background/90 px-2.5 py-1.5 font-mono text-[9px] font-semibold uppercase text-muted-foreground shadow-sm backdrop-blur">
        Jaringan TJKT
      </div>
      <svg className="absolute inset-0 h-full w-full text-primary/50" viewBox="0 0 520 325" fill="none">
        <path stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 6" d="M82 84 176 120 263 69 357 111 443 72" />
        <path stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 6" d="M176 120 119 225 250 260 357 207 443 248" />
        <path stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 6" d="M263 69 270 164 357 207" />
        <path stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 6" d="M82 84 68 239 119 225" />
        <path stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 6" d="M270 164 176 120M270 164 250 260M270 164 443 248" />
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
  const announcements = useTable<Announcement>("announcements", {
    orderBy: "date",
    limit: 3,
  });
  const schedules = useTable<Schedule>("schedules", { orderBy: "order_no", ascending: true });
  const today = useJakartaToday();
  const todaySchedules = today ? schedules.data?.filter((item) => item.day.toLocaleLowerCase("id-ID") === today.day.toLocaleLowerCase("id-ID")) ?? [] : [];

  const stats = [
    { value: "34", label: "Siswa", icon: Users },
    { value: "16", label: "Mata Pelajaran", icon: BookOpen },
    { value: "2", label: "Kegiatan", icon: ClipboardList },
    { value: "2026–2027", label: "Tahun Pembelajaran", icon: CalendarDays },
  ];

  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-border bg-surface">
        
        <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 py-7 sm:py-9 md:grid-cols-[minmax(0,1fr)_minmax(0,0.55fr)] md:gap-8 lg:py-10">
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
              <Button asChild className="min-h-11 w-full sm:w-auto">
                <Link to="/profil-kelas">Profil Kelas <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="min-h-11 w-full text-foreground sm:w-auto">
                <Link to="/jadwal-pelajaran">Jadwal Pelajaran</Link>
              </Button>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[260px] md:max-w-[340px]">
            <NetworkVisual />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card" aria-label="Ringkasan kelas">
        <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={stat.label} className={`flex items-center gap-3 border-border px-4 py-3.5 sm:px-6 ${index % 2 === 0 ? "border-r" : ""} ${index < 2 ? "border-b lg:border-b-0" : ""} lg:border-r lg:last:border-r-0`}>
              <span className="grid h-7 w-7 shrink-0 place-items-center text-muted-foreground"><stat.icon className="h-4 w-4" aria-hidden="true" /></span>
              <span className="min-w-0">
                <span className="block font-display text-base font-semibold leading-tight sm:text-lg">{stat.value}</span>
                <span className="block text-[11px] leading-tight text-muted-foreground sm:text-xs">{stat.label}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          <section className="min-w-0" aria-labelledby="jadwal-hari-ini">
            <div className="flex items-start gap-2.5 border-b border-border pb-4">
              <CalendarCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div className="min-w-0">
                <h2 id="jadwal-hari-ini" className="font-display text-lg font-semibold">Jadwal Hari Ini</h2>
                <p className="mt-1 text-xs text-muted-foreground">{today ? `${today.day}, ${today.date}` : "Memuat tanggal hari ini…"}</p>
              </div>
            </div>
            {schedules.isLoading || !today ? (
              <div className="space-y-3 py-4">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
            ) : schedules.isError ? (
              <HomeEmptyState title="Jadwal belum dapat dimuat." description="Silakan coba kembali melalui halaman jadwal lengkap." />
            ) : todaySchedules.length ? (
              <ul className="divide-y divide-border">
                {todaySchedules.slice(0, 4).map((item) => (
                  <li key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 py-3.5">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold">{item.subject}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{[item.teacher, item.room].filter(Boolean).join(" · ") || "Guru belum dicantumkan"}</p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1.5 pt-0.5 font-mono text-[11px] text-muted-foreground">
                      <Clock3 className="h-3 w-3" aria-hidden="true" />
                      {[item.start_time, item.end_time].filter(Boolean).join("–") || "—"}
                    </span>
                  </li>
                ))}
                {todaySchedules.length > 4 ? <li className="py-3 text-xs text-muted-foreground">{todaySchedules.length - 4} jadwal lainnya tersedia di halaman lengkap.</li> : null}
              </ul>
            ) : (
              <HomeEmptyState title="Tidak ada jadwal untuk hari ini." description="Lihat jadwal lengkap untuk hari lainnya." />
            )}
            <Button asChild variant="ghost" size="sm" className="mt-2 -ml-3 min-h-11 text-foreground">
              <Link to="/jadwal-pelajaran">Lihat Jadwal Lengkap <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </Button>
          </section>

          <section className="min-w-0" aria-labelledby="pengumuman-terbaru">
            <div className="flex items-start gap-2.5 border-b border-border pb-4">
              <Megaphone className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div className="min-w-0">
                <h2 id="pengumuman-terbaru" className="font-display text-lg font-semibold">Pengumuman Terbaru</h2>
                <p className="mt-1 text-xs text-muted-foreground">Informasi penting untuk kelas</p>
              </div>
            </div>
            {announcements.isLoading ? (
              <div className="space-y-3 py-4">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
            ) : announcements.isError ? (
              <HomeEmptyState title="Pengumuman belum dapat dimuat." description="Silakan coba kembali melalui halaman pengumuman." />
            ) : announcements.data?.length ? (
              <ul className="divide-y divide-border">
                {announcements.data.map((item) => (
                  <li key={item.id} className="py-3.5">
                    <Link to="/pengumuman" className="group block">
                      <h3 className="text-sm font-semibold transition-colors group-hover:text-primary">{item.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{formatDate(item.date)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <HomeEmptyState title="Belum ada pengumuman." description="Pengumuman terbaru akan ditampilkan di sini." />
            )}
            <Button asChild variant="ghost" size="sm" className="mt-2 -ml-3 min-h-11 text-foreground">
              <Link to="/pengumuman">Lihat Semua <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </Button>
          </section>
        </div>

        <section className="mt-8 border-t border-border pt-6 sm:mt-10" aria-labelledby="akses-cepat">
          <h2 id="akses-cepat" className="mb-4 font-display text-base font-semibold">Akses Cepat</h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {quickLinks.map((item) => (
              <Button key={item.to} asChild variant="outline" className="group h-auto min-h-16 justify-start gap-2.5 whitespace-normal rounded-md bg-card px-3 py-3 text-left text-foreground shadow-none sm:px-4">
                <Link to={item.to}>
                  <item.icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="min-w-0 flex-1 text-sm">{item.title}</span>
                  <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block" aria-hidden="true" />
                </Link>
              </Button>
            ))}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
