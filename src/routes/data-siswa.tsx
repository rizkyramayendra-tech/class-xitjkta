import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { SiteLayout, PageHeader, EmptyState } from "@/components/site/SiteLayout";
import { StorageImage } from "@/components/StorageImage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTable } from "@/lib/cms";

export const Route = createFileRoute("/data-siswa")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Data Siswa — XI TJKT A SMKN 1 Gunung Talang" },
      {
        name: "description",
        content: "Direktori 34 siswa kelas XI TJKT A SMKN 1 Gunung Talang lengkap dengan pencarian.",
      },
      { property: "og:title", content: "Data Siswa — XI TJKT A" },
      { property: "og:description", content: "Direktori siswa kelas XI TJKT A." },
    ],
  }),
  component: DataSiswa,
});

type Student = {
  id: string;
  order_no: number;
  name: string;
  nickname: string | null;
  nis: string | null;
  gender: string | null;
  photo_url: string | null;
  info: string | null;
};

function DataSiswa() {
  const { data, isLoading } = useTable<Student>("students", {
    orderBy: "order_no",
    ascending: true,
  });
  const [term, setTerm] = useState("");
  const [sort, setSort] = useState("order");
  const [gender, setGender] = useState("all");
  const [selected, setSelected] = useState<Student | null>(null);

  const students = useMemo(() => {
    let rows = [...(data ?? [])];
    if (term.trim()) {
      const q = term.trim().toLowerCase();
      rows = rows.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.nickname ?? "").toLowerCase().includes(q) ||
          (s.nis ?? "").toLowerCase().includes(q),
      );
    }
    if (gender !== "all") rows = rows.filter((s) => (s.gender ?? "") === gender);
    if (sort === "name") rows.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "name-desc") rows.sort((a, b) => b.name.localeCompare(a.name));
    if (sort === "order") rows.sort((a, b) => a.order_no - b.order_no);
    return rows;
  }, [data, term, sort, gender]);

  return (
    <SiteLayout>
      <PageHeader
        title="Data Siswa"
        description="Direktori siswa kelas XI TJKT A. Klik kartu siswa untuk melihat detail."
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
        <div className="panel mb-8 flex flex-col gap-3 p-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Cari nama siswa…"
              aria-label="Cari siswa"
              className="pl-9"
            />
          </div>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="sm:w-48" aria-label="Filter jenis kelamin">
              <SelectValue placeholder="Semua" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Siswa</SelectItem>
              <SelectItem value="Laki-laki">Laki-laki</SelectItem>
              <SelectItem value="Perempuan">Perempuan</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="sm:w-48" aria-label="Urutkan siswa">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="order">Nomor Urut</SelectItem>
              <SelectItem value="name">Nama (A–Z)</SelectItem>
              <SelectItem value="name-desc">Nama (Z–A)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full" />
            ))}
          </div>
        ) : students.length === 0 ? (
          <EmptyState text="Tidak ada siswa yang cocok dengan pencarian." />
        ) : (
          <ul className="stagger-children grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {students.map((student) => (
              <li key={student.id}>
                <Button
                  type="button"
                  onClick={() => setSelected(student)}
                   variant="ghost"
                   className="panel panel-interactive h-auto w-full flex-col items-stretch overflow-hidden p-0 text-left whitespace-normal"
                >
                  <StorageImage
                    src={student.photo_url}
                    alt={`Foto ${student.name}`}
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <div className="w-full p-3 sm:p-4">
                    <p className="text-xs text-muted-foreground">No. {student.order_no}</p>
                    <p className="font-semibold">{student.name}</p>
                    {student.nickname ? (
                      <p className="text-xs text-muted-foreground">{student.nickname}</p>
                    ) : null}
                  </div>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
            <DialogDescription>Nomor urut {selected?.order_no}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
            <StorageImage
              src={selected?.photo_url}
              alt={`Foto ${selected?.name ?? "siswa"}`}
              className="aspect-[4/5] w-full rounded-lg border border-border object-cover"
            />
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Nama Panggilan</dt>
                <dd>{selected?.nickname || "-"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">NIS</dt>
                <dd>{selected?.nis || "-"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Jenis Kelamin</dt>
                <dd>{selected?.gender || "-"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Informasi Tambahan</dt>
                <dd className="whitespace-pre-line">{selected?.info || "-"}</dd>
              </div>
            </dl>
          </div>
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
}
