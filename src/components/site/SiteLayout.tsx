import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Moon, Sun, Network, X, CircleDot, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "@/components/site/GlobalSearch";
import { StorageImage } from "@/components/StorageImage";
import { useSiteContent } from "@/lib/cms";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const NAV = [
  { to: "/", label: "Beranda" },
  { to: "/profil-kelas", label: "Profil Kelas" },
  { to: "/data-siswa", label: "Data Siswa" },
  { to: "/wali-kelas", label: "Wali Kelas" },
  { to: "/jadwal-pelajaran", label: "Jadwal Pelajaran" },
  { to: "/tugas-materi", label: "Tugas & Materi" },
  { to: "/pengumuman", label: "Pengumuman" },
  { to: "/agenda", label: "Agenda" },
  { to: "/jadwal-piket", label: "Jadwal Piket" },
  { to: "/prestasi", label: "Prestasi" },
  { to: "/galeri", label: "Galeri" },
  { to: "/informasi-sekolah", label: "Informasi Sekolah" },
  { to: "/kontak", label: "Kontak" },
] as const;

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      aria-label={theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
    </Button>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data: site } = useSiteContent("site");

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Lewati ke konten
      </a>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto grid h-[68px] max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 2xl:flex">
          <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="Beranda">
            {site?.['logo_url'] ? (
              <StorageImage
                src={site['logo_url']}
                alt="Logo kelas"
                className="h-9 w-9 rounded-md object-cover"
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Network className="h-5 w-5" aria-hidden="true" />
              </span>
            )}
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-sm font-bold">XI TJKT A</span>
              <span className="block text-[11px] text-muted-foreground">
                SMKN 1 Gunung Talang
              </span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-0.5 2xl:flex" aria-label="Navigasi utama">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="relative rounded-md px-2 py-2 text-xs font-medium text-muted-foreground transition-colors after:absolute after:inset-x-2 after:-bottom-[14px] after:h-0.5 after:origin-center after:scale-x-0 after:bg-primary after:transition-transform hover:text-foreground"
                activeProps={{ className: "text-foreground after:scale-x-100" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 2xl:ml-2">
            <GlobalSearch />
            <ThemeToggle />
            <Button
              variant="outline"
              size="icon"
               className="2xl:hidden"
              aria-expanded={open}
              aria-label={open ? "Tutup menu" : "Buka menu"}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        <nav
          className={cn("grid border-t border-border bg-background/95 transition-[grid-template-rows,opacity] duration-300 2xl:hidden", open ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0")}
          aria-label="Navigasi seluler"
        >
          <div className="overflow-hidden">
          <ul className="mx-auto grid max-h-[calc(100vh-68px)] max-w-7xl gap-1 overflow-y-auto px-4 py-4 sm:grid-cols-2">
            {NAV.map((item, index) => (
              <li key={item.to} style={{ transitionDelay: open ? `${Math.min(index * 20, 180)}ms` : "0ms" }} className={cn("transition-all duration-300", open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0")}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: item.to === "/" }}
                   className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                   activeProps={{ className: "bg-secondary text-foreground" }}
                >
                  <CircleDot className="h-3 w-3 text-primary" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          </div>
        </nav>
      </header>

      <main id="konten" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-3">
          <div>
            <p className="whitespace-pre-line font-display text-sm font-semibold">
              {site?.['footer_text'] ??
                "XI TJKT A\nSMKN 1 Gunung Talang\nTeknik Jaringan Komputer dan Telekomunikasi\nTahun Pembelajaran 2026–2027"}
            </p>
          </div>
          <nav aria-label="Tautan footer" className="text-sm">
            <p className="mb-2 font-semibold">Navigasi</p>
            <ul className="grid grid-cols-2 gap-1 text-muted-foreground">
              {NAV.slice(0, 8).map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="text-sm text-muted-foreground">
            <p className="mb-2 font-semibold text-foreground">Portal Kelas</p>
            <p>{site?.['hero_description'] ?? "Portal resmi kelas XI TJKT A."}</p>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row">
            <p>{site?.['footer_note'] ?? "© 2026 XI TJKT A. Seluruh hak cipta."}</p>
            <Link to="/admin/login" className="hover:text-foreground">
              Login Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="relative overflow-hidden border-b border-border bg-surface">
      <div className="pointer-events-none absolute inset-0 grid-tech opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:py-12">
        <span className="mb-3 block h-1 w-10 rounded-full bg-primary" aria-hidden="true" />
        <h1 className="reveal-up font-display text-3xl font-bold sm:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="panel flex min-h-44 flex-col items-center justify-center p-10 text-center text-sm text-muted-foreground">
      <span className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-secondary text-primary"><Inbox className="h-5 w-5" aria-hidden="true" /></span>
      {text}
    </div>
  );
}
