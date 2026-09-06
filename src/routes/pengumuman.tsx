import { createFileRoute } from "@tanstack/react-router";
import { Pin } from "lucide-react";
import { SiteLayout, PageHeader, EmptyState } from "@/components/site/SiteLayout";
import { StorageImage } from "@/components/StorageImage";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, useTable } from "@/lib/cms";

export const Route = createFileRoute("/pengumuman")({
  head: () => ({
    meta: [
      { title: "Pengumuman — XI TJKT A SMKN 1 Gunung Talang" },
      {
        name: "description",
        content: "Pengumuman resmi kelas XI TJKT A SMKN 1 Gunung Talang untuk siswa dan orang tua.",
      },
      { property: "og:title", content: "Pengumuman — XI TJKT A" },
      { property: "og:description", content: "Pengumuman terbaru kelas XI TJKT A." },
    ],
  }),
  component: Pengumuman,
});

type Announcement = {
  id: string;
  title: string;
  content: string | null;
  date: string;
  image_url: string | null;
  pinned: boolean;
};

function Pengumuman() {
  const { data, isLoading } = useTable<Announcement>("announcements", { orderBy: "date" });
  const items = [...(data ?? [])].sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <SiteLayout>
      <PageHeader title="Pengumuman" description="Informasi penting dari wali kelas dan pengurus kelas." />
       <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        ) : !items.length ? (
          <EmptyState text="Belum ada pengumuman." />
        ) : (
           <ul className="stagger-children space-y-5">
            {items.map((item) => (
               <li key={item.id} className="panel panel-interactive overflow-hidden">
                {item.image_url ? (
                  <StorageImage
                    src={item.image_url}
                    alt={`Banner pengumuman ${item.title}`}
                    className="aspect-[21/9] w-full object-cover"
                  />
                ) : null}
                 <article className="p-5 sm:p-6">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {item.pinned ? (
                      <Badge>
                        <Pin className="mr-1 h-3 w-3" aria-hidden="true" /> Penting
                      </Badge>
                    ) : null}
                    <span className="text-xs text-muted-foreground">{formatDate(item.date)}</span>
                  </div>
                  <h2 className="font-display text-xl font-semibold">{item.title}</h2>
                   <p className="mt-2 break-words whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {item.content}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SiteLayout>
  );
}
