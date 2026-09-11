import { createFileRoute } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { SiteLayout, PageHeader, EmptyState } from "@/components/site/SiteLayout";
import { StorageImage } from "@/components/StorageImage";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTable } from "@/lib/cms";

export const Route = createFileRoute("/prestasi")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Prestasi — XI TJKT A SMKN 1 Gunung Talang" },
      {
        name: "description",
        content: "Daftar prestasi siswa kelas XI TJKT A SMKN 1 Gunung Talang di bidang akademik dan non-akademik.",
      },
      { property: "og:title", content: "Prestasi — XI TJKT A" },
      { property: "og:description", content: "Prestasi siswa kelas XI TJKT A." },
    ],
  }),
  component: Prestasi,
});

type Achievement = {
  id: string;
  title: string;
  description: string | null;
  year: string | null;
  category: string | null;
  participants: string | null;
  image_url: string | null;
};

function Prestasi() {
  const { data, isLoading } = useTable<Achievement>("achievements", { orderBy: "created_at" });

  return (
    <SiteLayout>
      <PageHeader title="Prestasi" description="Capaian membanggakan siswa kelas XI TJKT A." />
       <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : !data?.length ? (
          <EmptyState text="Belum ada prestasi yang tercatat." />
        ) : (
           <ul className="stagger-children grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.map((item) => (
               <li key={item.id} className="panel panel-interactive h-full overflow-hidden">
                <StorageImage
                  src={item.image_url}
                  alt={`Dokumentasi prestasi ${item.title}`}
                  className="aspect-video w-full object-cover"
                />
                <div className="p-5">
                  <div className="mb-2 flex flex-wrap gap-2">
                    {item.category ? <Badge variant="secondary">{item.category}</Badge> : null}
                    {item.year ? <Badge variant="outline">{item.year}</Badge> : null}
                  </div>
                  <h2 className="flex items-start gap-2 font-display text-lg font-semibold">
                    <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {item.title}
                  </h2>
                  {item.participants ? (
                    <p className="mt-1 text-xs text-muted-foreground">{item.participants}</p>
                  ) : null}
                  <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SiteLayout>
  );
}
