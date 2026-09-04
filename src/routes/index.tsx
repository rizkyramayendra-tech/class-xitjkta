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
    <div className="mb-4 flex items-center justify-between gap-3">
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
    { value: profile?['student_count'] ?? "34", label: "Siswa", icon: Users },
    { value: "1", label: "Wali Kelas", icon: GraduationCap },
    { value: profile?['year'] ?? "2026–2027", label: "Tahun Pembelajaran", icon: CalendarDays },
    { value: "TJKT", label: "Jurusan", icon: BookOpen },
  ];

  const materi = (tugas.data ?? []).filter((r) => r.type !== "tugas");
  const tugasOnly = (tugas.data ?? []).filter((r) => r.type === "tugas");

  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="pointer-events-none absolute inset-0 grid-tech opacity-40" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <Badge variant="secondary" className="mb-4">
              {site?['hero_year'] ?? "Tahun Pembelajaran 2026–2027"}
            </Badge>
            <h1 className="font-display text-4xl font-bold sm:text-5xl lg:text-6xl">
              {site?['hero_title'] ?? "XI TJKT A"}
            </h1>
            <p className="mt-3 text-lg font-medium text-primary">
              {site?['hero_subtitle'] ?? "Teknik Jaringan Komputer dan Telekomunikasi"}
            </p>
            <p className="text-sm text-muted-foreground">
              {site?['hero_school'] ?? "SMKN 1 Gunung Talang"}
            </p>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {site?['hero_description'] ?? "Portal resmi kelas XI TJKT A."}
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
          <div className="relative">
            {site?['hero_image_url'] ? (
              <StorageImage
                src={site['hero_image_url']}
                alt="Foto utama kelas XI TJKT A"
                loading="eager"
                className="aspect-[16/10] w-full rounded-2xl border border-border object-cover shadow-panel"
              />
            ) : (
              <img
                src={heroImage}
                alt="Rak server dan panel jaringan di laboratorium TJKT"
                width={1600}
                height={1000}
                className="aspect-[16/10] w-full rounded-2xl border border-border object-cover shadow-panel"
              />
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border px-0 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-background p-6 text-center">
              <stat.icon className="mx-auto mb-2 h-5 w-5 text-primary" aria-hidden="true" />
              <p className="font-display text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-2">
        <section aria-labelledby="pengumuman-terbaru">
          <SectionTitle title="Pengumuman Terbaru" to="/pengumuman" icon={Megaphone} />
          {announcements.isLoading ? (
            <ListSkeleton />
          ) : announcements.data?.length ? (
            <ul className="space-y-3">
              {announcements.data.map((item) => (
                <li key={item.id} className="panel p-4">
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
                <li key={item.id} className="panel p-4">
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
                <li key={item.id} className="panel p-4">
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
                <li key={item.id} className="panel p-4">
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
                <li key={item.id} className="panel p-4">
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
            <div className="grid grid-cols-3 gap-2">
              {galeri.data.map((item) => (
                <StorageImage
                  key={item.id}
                  src={item.image_url}
                  alt={item.caption ?? item.title}
                  className="aspect-square w-full rounded-lg border border-border object-cover"
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
