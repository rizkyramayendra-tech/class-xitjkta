import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  GraduationCap,
  Megaphone,
  Trophy,
  Users,
  BookOpen,
  Images,
  RadioTower,
  Wifi,
} from "lucide-react";
import heroImage from "@/assets/hero-network.jpg";
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
    { value: profile?.['year'] ?? "2026–2027", label: "Tahun Pembelajaran", icon: CalendarDays },
    { value: "TJKT", label: "Jurusan", icon: BookOpen },
  ];

  const materi = (tugas.data ?? []).filter((r) => r.type !== "tugas");
  const tugasOnly = (tugas.data ?? []).filter((r) => r.type === "tugas");

  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="pointer-events-none absolute inset-0 grid-tech opacity-35" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <span className="network-pulse absolute left-[8%] top-[18%] h-2 w-2 rounded-full bg-primary" />
          <span className="network-pulse absolute left-[36%] top-[72%] h-2.5 w-2.5 rounded-full bg-primary [animation-delay:700ms]" />
          <span className="network-pulse absolute right-[12%] top-[12%] h-2 w-2 rounded-full bg-primary [animation-delay:1400ms]" />
        </div>
        <div className="relative mx-auto grid min-h-[calc(100svh-68px)] max-w-7xl content-center items-center gap-10 px-4 py-12 lg:grid-cols-[1.08fr_0.92fr] lg:py-16">
          <div className="reveal-up">
            <Badge variant="secondary" className="mb-4">
              {site?.['hero_year'] ?? "Tahun Pembelajaran 2026–2027"}
            </Badge>
            <h1 className="max-w-3xl font-display text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
              {site?.['hero_title'] ?? "XI TJKT A"}
            </h1>
            <p className="mt-5 flex items-center gap-2 text-base font-semibold text-primary sm:text-lg">
              <RadioTower className="h-5 w-5 shrink-0" aria-hidden="true" />
              {site?.['hero_subtitle'] ?? "Teknik Jaringan Komputer dan Telekomunikasi"}
            </p>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {site?.['hero_school'] ?? "SMKN 1 Gunung Talang"}
            </p>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {site?.['hero_description'] ?? "Portal resmi kelas XI TJKT A."}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/profil-kelas">Lihat Profil Kelas</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/data-siswa">Lihat Data Siswa</Link>
              </Button>
            </div>
          </div>
          <div className="relative reveal-up [animation-delay:120ms]">
            <div className="absolute -inset-3 rounded-2xl border border-primary/15" aria-hidden="true" />
            {site?.['hero_image_url'] ? (
              <StorageImage
                src={site['hero_image_url']}
                alt="Foto utama kelas XI TJKT A"
                loading="eager"
                className="aspect-[16/10] w-full rounded-xl border border-border object-cover shadow-panel"
              />
            ) : (
              <img
                src={heroImage}
                alt="Rak server dan panel jaringan di laboratorium TJKT"
                width={1600}
                height={1000}
                className="aspect-[16/10] w-full rounded-xl border border-border object-cover shadow-panel"
              />
            )}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-md border border-border bg-background/90 px-3 py-2 text-xs font-semibold shadow-panel backdrop-blur">
              <Wifi className="h-4 w-4 text-primary" aria-hidden="true" />
              Teknik Jaringan Komputer dan Telekomunikasi
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="stagger-children mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={stat.label} className={`border-border bg-background p-5 text-center sm:p-7 ${index % 2 === 0 ? "border-r" : ""} ${index < 2 ? "border-b lg:border-b-0" : ""} lg:border-r lg:last:border-r-0`}>
              <stat.icon className="mx-auto mb-2 h-5 w-5 text-primary" aria-hidden="true" />
              <p className="font-display text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="stagger-children mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
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
            <p className="text-sm text-muted-foreground">Belum ada pengumuman.</p>
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
            <p className="text-sm text-muted-foreground">Belum ada agenda.</p>
          )}
        </section>

        <section aria-labelledby="tugas-terbaru">
          <SectionTitle title="Tugas Terbaru" to="/tugas-materi" icon={BookOpen} />
          {tugasOnly.length ? (
            <ul className="space-y-3">
              {tugasOnly.map((item) => (
                 <li key={item.id} className="panel panel-interactive p-4">
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.subject ?? "-"}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada tugas.</p>
          )}
        </section>

        <section aria-labelledby="materi-terbaru">
          <SectionTitle title="Materi Terbaru" to="/tugas-materi" icon={BookOpen} />
          {materi.length ? (
            <ul className="space-y-3">
              {materi.map((item) => (
                 <li key={item.id} className="panel panel-interactive p-4">
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.subject ?? "-"}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada materi.</p>
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
            <p className="text-sm text-muted-foreground">Belum ada prestasi.</p>
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
            <p className="text-sm text-muted-foreground">Belum ada foto.</p>
          )}
        </section>
      </div>
    </SiteLayout>
  );
}
