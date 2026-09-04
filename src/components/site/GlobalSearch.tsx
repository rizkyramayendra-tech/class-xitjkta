import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/cms";

type Hit = { label: string; group: string; to: string };

const SOURCES: { table: string; column: string; group: string; to: string }[] = [
  { table: "students", column: "name", group: "Siswa", to: "/data-siswa" },
  { table: "resources", column: "title", group: "Tugas & Materi", to: "/tugas-materi" },
  { table: "announcements", column: "title", group: "Pengumuman", to: "/pengumuman" },
  { table: "events", column: "title", group: "Agenda", to: "/agenda" },
  { table: "achievements", column: "title", group: "Prestasi", to: "/prestasi" },
  { table: "gallery", column: "title", group: "Galeri", to: "/galeri" },
  { table: "schedules", column: "subject", group: "Jadwal Pelajaran", to: "/jadwal-pelajaran" },
  { table: "duty_roster", column: "member_name", group: "Jadwal Piket", to: "/jadwal-piket" },
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (term.trim().length < 2) {
      setHits([]);
      return;
    }
    let active = true;
    setLoading(true);
    const timer = setTimeout(async () => {
      const results = await Promise.all(
        SOURCES.map(async (source) => {
          const { data } = await db
            .from(source.table)
            .select(source.column)
            .eq("status", "published")
            .ilike(source.column, `%${term.trim()}%`)
            .limit(4);
          return ((data ?? []) as Record<string, string>[]).map((row) => ({
            label: row[source.column] ?? "",
            group: source.group,
            to: source.to,
          }));
        }),
      );
      if (!active) return;
      setHits(results.flat().filter((hit) => hit.label));
      setLoading(false);
    }, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [term]);

  const groups = Array.from(new Set(hits.map((h) => h.group)));

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-muted-foreground"
        onClick={() => setOpen(true)}
        aria-label="Buka pencarian"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Cari…</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Cari siswa, tugas, pengumuman, agenda…"
          value={term}
          onValueChange={setTerm}
        />
        <CommandList>
          <CommandEmpty>
            {loading ? "Mencari…" : term.length < 2 ? "Ketik minimal 2 huruf." : "Tidak ada hasil."}
          </CommandEmpty>
          {groups.map((group) => (
            <CommandGroup key={group} heading={group}>
              {hits
                .filter((hit) => hit.group === group)
                .map((hit, index) => (
                  <CommandItem
                    key={`${group}-${index}`}
                    value={`${hit.label} ${group}`}
                    onSelect={() => {
                      setOpen(false);
                      void navigate({ to: hit.to });
                    }}
                  >
                    {hit.label}
                  </CommandItem>
                ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
