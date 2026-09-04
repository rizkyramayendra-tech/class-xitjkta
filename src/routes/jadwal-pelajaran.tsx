import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader, EmptyState } from "@/components/site/SiteLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { DAYS, useTable } from "@/lib/cms";

export const Route = createFileRoute("/jadwal-pelajaran")({
  head: () => ({
    meta: [
      { title: "Jadwal Pelajaran — XI TJKT A SMKN 1 Gunung Talang" },
      {
        name: "description",
        content: "Jadwal pelajaran mingguan kelas XI TJKT A SMKN 1 Gunung Talang.",
      },
      { property: "og:title", content: "Jadwal Pelajaran — XI TJKT A" },
      { property: "og:description", content: "Jadwal pelajaran mingguan kelas XI TJKT A." },
    ],
  }),
  component: JadwalPelajaran,
});

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

function JadwalPelajaran() {
  const { data, isLoading } = useTable<Schedule>("schedules", {
    orderBy: "order_no",
    ascending: true,
  });

  return (
    <SiteLayout>
      <PageHeader
        title="Jadwal Pelajaran"
        description="Jadwal mingguan kelas XI TJKT A. Diperbarui oleh administrator kelas."
      />
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10">
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : !data?.length ? (
          <EmptyState text="Jadwal pelajaran belum tersedia." />
        ) : (
          DAYS.map((day) => {
            const rows = data.filter((r) => r.day === day);
            if (!rows.length) return null;
            return (
              <section key={day} aria-labelledby={`hari-${day}`}>
                <h2 id={`hari-${day}`} className="mb-3 font-display text-lg font-semibold">
                  {day}
                </h2>
                <div className="panel overflow-x-auto">
                  <table className="w-full min-w-[560px] text-sm">
                    <caption className="sr-only">Jadwal pelajaran hari {day}</caption>
                    <thead className="bg-secondary text-left">
                      <tr>
                        <th scope="col" className="p-3 font-semibold">
                          Jam
                        </th>
                        <th scope="col" className="p-3 font-semibold">
                          Mata Pelajaran
                        </th>
                        <th scope="col" className="p-3 font-semibold">
                          Guru
                        </th>
                        <th scope="col" className="p-3 font-semibold">
                          Ruang
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.id} className="border-t border-border">
                          <td className="whitespace-nowrap p-3 font-mono text-xs">
                            {[row.start_time, row.end_time].filter(Boolean).join(" – ") || "-"}
                          </td>
                          <td className="p-3 font-medium">{row.subject}</td>
                          <td className="p-3 text-muted-foreground">{row.teacher || "-"}</td>
                          <td className="p-3 text-muted-foreground">{row.room || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })
        )}
      </div>
    </SiteLayout>
  );
}
