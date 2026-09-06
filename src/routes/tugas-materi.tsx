import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, ExternalLink, Search } from "lucide-react";
import { SiteLayout, PageHeader, EmptyState } from "@/components/site/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, signedUrl, useTable } from "@/lib/cms";

export const Route = createFileRoute("/tugas-materi")({
  head: () => ({
    meta: [
      { title: "Tugas & Materi — XI TJKT A SMKN 1 Gunung Talang" },
      {
        name: "description",
        content: "Kumpulan tugas, materi, dan modul pembelajaran kelas XI TJKT A SMKN 1 Gunung Talang.",
      },
      { property: "og:title", content: "Tugas & Materi — XI TJKT A" },
      { property: "og:description", content: "Tugas, materi, dan modul pembelajaran kelas XI TJKT A." },
    ],
  }),
  component: TugasMateri,
});

type Resource = {
  id: string;
  type: string;
  title: string;
  subject: string | null;
  description: string | null;
  date: string | null;
  due_date: string | null;
  file_url: string | null;
  link_url: string | null;
};

async function openFile(ref: string) {
  const url = await signedUrl(ref);
  if (url) window.open(url, "_blank", "noopener,noreferrer");
}

function TugasMateri() {
  const { data, isLoading } = useTable<Resource>("resources", { orderBy: "created_at" });
  const [tab, setTab] = useState("semua");
  const [term, setTerm] = useState("");

  const items = useMemo(() => {
    let rows = data ?? [];
    if (tab !== "semua") rows = rows.filter((r) => r.type === tab);
    if (term.trim()) {
      const q = term.toLowerCase();
      rows = rows.filter(
        (r) => r.title.toLowerCase().includes(q) || (r.subject ?? "").toLowerCase().includes(q),
      );
    }
    return rows;
  }, [data, tab, term]);

  return (
    <SiteLayout>
      <PageHeader
        title="Tugas & Materi"
        description="Sumber belajar kelas: tugas, materi, modul, berkas, dan tautan pembelajaran."
      />
       <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
         <div className="panel mb-8 flex flex-col gap-3 p-3 md:flex-row md:items-center md:justify-between">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="semua">Semua</TabsTrigger>
              <TabsTrigger value="tugas">Tugas</TabsTrigger>
              <TabsTrigger value="materi">Materi</TabsTrigger>
              <TabsTrigger value="modul">Modul</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative md:w-72">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Cari judul atau mata pelajaran…"
              aria-label="Cari tugas dan materi"
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        ) : !items.length ? (
          <EmptyState text="Belum ada tugas atau materi yang dipublikasikan." />
        ) : (
          <ul className="stagger-children grid gap-4 md:grid-cols-2">
            {items.map((item) => (
               <li key={item.id} className="panel panel-interactive flex flex-col p-5 sm:p-6">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {item.type}
                  </Badge>
                  {item.subject ? <Badge variant="outline">{item.subject}</Badge> : null}
                  {item.due_date ? (
                    <Badge variant="destructive">Tenggat {formatDate(item.due_date)}</Badge>
                  ) : null}
                </div>
                <h2 className="font-display text-lg font-semibold">{item.title}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(item.date)}</p>
                <p className="mt-2 flex-1 whitespace-pre-line text-sm text-muted-foreground">
                  {item.description || "-"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.file_url ? (
                     <Button size="sm" variant="outline" onClick={() => item.file_url && void openFile(item.file_url)}>
                      <Download className="mr-1.5 h-4 w-4" aria-hidden="true" /> Unduh berkas
                    </Button>
                  ) : null}
                  {item.link_url ? (
                    <Button size="sm" variant="outline" asChild>
                      <a href={item.link_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1.5 h-4 w-4" aria-hidden="true" /> Buka tautan
                      </a>
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SiteLayout>
  );
}
