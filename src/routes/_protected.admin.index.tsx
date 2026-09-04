import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  CalendarDays,
  Images,
  ListChecks,
  Megaphone,
  Trophy,
  Users,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ActivityLog } from "@/components/admin/ActivityLog";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/cms";

export const Route = createFileRoute("/_protected/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard Admin — XI TJKT A" },
      { name: "description", content: "Dashboard administrator kelas XI TJKT A." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Dashboard Admin — XI TJKT A" },
      { property: "og:description", content: "Dashboard administrator kelas XI TJKT A." },
    ],
  }),
  component: AdminDashboard,
});

const CARDS = [
  { table: "students", label: "Siswa", section: "data-siswa", icon: Users },
  { table: "resources", label: "Tugas & Materi", section: "tugas-materi", icon: BookOpen },
  { table: "announcements", label: "Pengumuman", section: "pengumuman", icon: Megaphone },
  { table: "events", label: "Agenda", section: "agenda", icon: CalendarDays },
  { table: "achievements", label: "Prestasi", section: "prestasi", icon: Trophy },
  { table: "gallery", label: "Galeri", section: "galeri", icon: Images },
  { table: "schedules", label: "Jadwal Pelajaran", section: "jadwal-pelajaran", icon: CalendarDays },
  { table: "duty_roster", label: "Jadwal Piket", section: "jadwal-piket", icon: ListChecks },
] as const;

function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const entries = await Promise.all(
        CARDS.map(async (card) => {
          const { count } = await db
            .from(card.table)
            .select("id", { count: "exact", head: true });
          return [card.table, count ?? 0] as const;
        }),
      );
      return Object.fromEntries(entries) as Record<string, number>;
    },
  });

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan konten website kelas XI TJKT A.
        </p>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {CARDS.map((card) => (
          <Link key={card.table} to="/admin/$section" params={{ section: card.section }} className="panel p-5 transition-colors hover:border-primary">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <card.icon className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            {isLoading ? (
              <Skeleton className="mt-2 h-8 w-14" />
            ) : (
              <p className="mt-1 font-display text-3xl font-bold">{data?.[card.table] ?? 0}</p>
            )}
          </Link>
        ))}
      </div>

      <ActivityLog />
    </AdminShell>
  );
}
