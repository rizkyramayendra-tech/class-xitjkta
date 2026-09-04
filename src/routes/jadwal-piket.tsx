import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader, EmptyState } from "@/components/site/SiteLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { useTable } from "@/lib/cms";

export const Route = createFileRoute("/jadwal-piket")({
  head: () => ({
    meta: [
      { title: "Jadwal Piket — XI TJKT A SMKN 1 Gunung Talang" },
      {
        name: "description",
        content: "Jadwal piket harian kelas XI TJKT A SMKN 1 Gunung Talang dari Senin sampai Jumat.",
      },
      { property: "og:title", content: "Jadwal Piket — XI TJKT A" },
      { property: "og:description", content: "Daftar petugas piket kelas XI TJKT A setiap hari." },
    ],
  }),
  component: JadwalPiket,
});

type Duty = { id: string; day: string; member_name: string; order_no: number };

const DUTY_DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

function JadwalPiket() {
  const { data, isLoading } = useTable<Duty>("duty_roster", {
    orderBy: "order_no",
    ascending: true,
  });

  return (
    <SiteLayout>
      <PageHeader
        title="Jadwal Piket"
        description="Petugas piket kebersihan kelas XI TJKT A setiap harinya."
      />
      <div className="mx-auto max-w-7xl px-4 py-10">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : !data?.length ? (
          <EmptyState text="Jadwal piket belum tersedia." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DUTY_DAYS.map((day) => {
              const rows = data.filter((r) => r.day === day);
              if (!rows.length) return null;
              return (
                <section key={day} className="panel p-5">
                  <h2 className="mb-3 flex items-center justify-between font-display text-lg font-semibold">
                    {day}
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {rows.length} orang
                    </span>
                  </h2>
                  <ol className="space-y-1.5 text-sm">
                    {rows.map((row, index) => (
                      <li key={row.id} className="flex items-center gap-3 rounded-md bg-secondary/60 px-3 py-2">
                        <span className="font-mono text-xs text-muted-foreground">{index + 1}</span>
                        <span className="font-medium">{row.member_name}</span>
                      </li>
                    ))}
                  </ol>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
