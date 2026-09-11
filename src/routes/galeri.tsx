import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { SiteLayout, PageHeader, EmptyState } from "@/components/site/SiteLayout";
import { StorageImage } from "@/components/StorageImage";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate, useTable } from "@/lib/cms";

export const Route = createFileRoute("/galeri")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Galeri — XI TJKT A SMKN 1 Gunung Talang" },
      {
        name: "description",
        content: "Dokumentasi foto kegiatan kelas XI TJKT A SMKN 1 Gunung Talang.",
      },
      { property: "og:title", content: "Galeri — XI TJKT A" },
      { property: "og:description", content: "Dokumentasi kegiatan kelas XI TJKT A." },
    ],
  }),
  component: Galeri,
});

type GalleryItem = {
  id: string;
  title: string;
  caption: string | null;
  category: string | null;
  image_url: string;
  date: string | null;
};

function Galeri() {
  const { data, isLoading } = useTable<GalleryItem>("gallery", {
    orderBy: "order_no",
    ascending: true,
  });
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState("Semua");
  const [active, setActive] = useState<GalleryItem | null>(null);

  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set((data ?? []).map((i) => i.category).filter(Boolean)))],
    [data],
  ) as string[];

  const items = useMemo(() => {
    let rows = data ?? [];
    if (category !== "Semua") rows = rows.filter((r) => r.category === category);
    if (term.trim()) {
      const q = term.toLowerCase();
      rows = rows.filter(
        (r) => r.title.toLowerCase().includes(q) || (r.caption ?? "").toLowerCase().includes(q),
      );
    }
    return rows;
  }, [data, term, category]);

  return (
    <SiteLayout>
      <PageHeader title="Galeri" description="Momen dan dokumentasi kegiatan kelas XI TJKT A." />
       <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
         <div className="panel mb-8 flex flex-col gap-3 p-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                aria-pressed={category === cat}
                 size="sm"
                 variant={category === cat ? "default" : "outline"}
                 className="h-8 rounded-full px-3 text-xs"
              >
                {cat}
              </Button>
            ))}
          </div>
          <div className="relative md:w-72">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Cari foto…"
              aria-label="Cari foto galeri"
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        ) : !items.length ? (
          <EmptyState text="Belum ada foto pada galeri." />
        ) : (
           <ul className="stagger-children grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <li key={item.id}>
                 <Button
                  type="button"
                   variant="ghost"
                   className="panel panel-interactive group block h-auto w-full overflow-hidden p-0"
                  onClick={() => setActive(item)}
                  aria-label={`Perbesar foto ${item.title}`}
                >
                  <StorageImage
                    src={item.image_url}
                    alt={item.caption ?? item.title}
                    className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                 </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{active?.title}</DialogTitle>
          </DialogHeader>
          <StorageImage
            src={active?.image_url}
            alt={active?.caption ?? active?.title ?? "Foto galeri"}
            className="max-h-[70vh] w-full rounded-lg object-contain"
          />
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {active?.category ? <Badge variant="secondary">{active.category}</Badge> : null}
            <span>{formatDate(active?.date)}</span>
          </div>
           {active?.caption ? <p className="break-words text-sm">{active.caption}</p> : null}
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
}
