import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { SiteLayout, PageHeader, EmptyState } from "@/components/site/SiteLayout";
import { StorageImage } from "@/components/StorageImage";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, useTable } from "@/lib/cms";

export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda Kelas — XI TJKT A SMKN 1 Gunung Talang" },
      {
        name: "description",
        content: "Agenda dan kegiatan kelas XI TJKT A SMKN 1 Gunung Talang beserta waktu dan lokasinya.",
      },
      { property: "og:title", content: "Agenda Kelas — XI TJKT A" },
      { property: "og:description", content: "Jadwal kegiatan dan acara kelas XI TJKT A." },
    ],
  }),
  component: Agenda,
});

type Event = {
  id: string;
  title: string;
  date: string;
  time: string | null;
  location: string | null;
  description: string | null;
  image_url: string | null;
};

function Agenda() {
  const { data, isLoading } = useTable<Event>("events", { orderBy: "date", ascending: true });

  return (
    <SiteLayout>
      <PageHeader title="Agenda" description="Kegiatan dan acara yang akan dan telah dilaksanakan kelas." />
       <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : !data?.length ? (
          <EmptyState text="Belum ada agenda kegiatan." />
        ) : (
           <ol className="stagger-children space-y-4">
            {data.map((item) => (
               <li key={item.id} className="panel panel-interactive grid gap-5 p-5 sm:grid-cols-[160px_minmax(0,1fr)] sm:p-6">
                <StorageImage
                  src={item.image_url}
                  alt={`Foto kegiatan ${item.title}`}
                  className="aspect-video w-full rounded-lg border border-border object-cover"
                />
                 <div className="min-w-0">
                  <h2 className="font-display text-lg font-semibold">{item.title}</h2>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> {formatDate(item.date)}
                    </span>
                    {item.time ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {item.time}
                      </span>
                    ) : null}
                    {item.location ? (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {item.location}
                      </span>
                    ) : null}
                  </div>
                   <p className="mt-3 break-words whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </SiteLayout>
  );
}
