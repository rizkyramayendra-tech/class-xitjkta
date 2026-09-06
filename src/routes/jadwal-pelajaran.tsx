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
       <div className="stagger-children mx-auto max-w-7xl space-y-8 px-4 py-10 sm:py-14">
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
                 <div className="grid gap-3 md:hidden">
                   {rows.map((row) => (
                     <article key={row.id} className="panel panel-interactive p-4">
                       <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                         <h3 className="min-w-0 font-display font-semibold">{row.subject}</h3>
                         <span className="shrink-0 rounded-md bg-secondary px-2 py-1 font-mono text-[11px] text-secondary-foreground">
                           {[row.start_time, row.end_time].filter(Boolean).join(" – ") || "-"}
                         </span>
                       </div>
                       <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
                         <div><dt className="text-muted-foreground">Guru</dt><dd className="mt-0.5 font-medium">{row.teacher || "-"}</dd></div>
                         <div><dt className="text-muted-foreground">Ruang</dt><dd className="mt-0.5 font-medium">{row.room || "-"}</dd></div>
                       </dl>
                     </article>
                   ))}
                 </div>
                 <div className="panel hidden overflow-x-auto md:block">
                   <table className="w-full text-sm">
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
                         <tr key={row.id} className="border-t border-border transition-colors hover:bg-secondary/50">
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
