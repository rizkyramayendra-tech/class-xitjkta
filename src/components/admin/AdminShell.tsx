import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  CalendarDays,
  Contact,
  GraduationCap,
  Images,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Megaphone,
  Menu,
  Moon,
  Network,
  Palette,
  School,
  ShieldCheck,
  Sun,
  Trophy,
  Users,
  BookOpen,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/lib/cms";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const ADMIN_MENU = [
  { slug: "", label: "Dashboard", icon: LayoutDashboard },
  { slug: "profil-kelas", label: "Profil Kelas", icon: School },
  { slug: "data-siswa", label: "Data Siswa", icon: Users },
  { slug: "wali-kelas", label: "Wali Kelas", icon: GraduationCap },
  { slug: "jadwal-pelajaran", label: "Jadwal Pelajaran", icon: CalendarDays },
  { slug: "tugas-materi", label: "Tugas & Materi", icon: BookOpen },
  { slug: "pengumuman", label: "Pengumuman", icon: Megaphone },
  { slug: "agenda", label: "Agenda", icon: CalendarDays },
  { slug: "jadwal-piket", label: "Jadwal Piket", icon: ListChecks },
  { slug: "prestasi", label: "Prestasi", icon: Trophy },
  { slug: "galeri", label: "Galeri", icon: Images },
  { slug: "informasi-sekolah", label: "Informasi Sekolah", icon: School },
  { slug: "kontak", label: "Kontak", icon: Contact },
  { slug: "tampilan", label: "Tampilan Website", icon: Palette },
  { slug: "keamanan", label: "Pengaturan Keamanan", icon: ShieldCheck },
  { slug: "aktivitas", label: "Riwayat Aktivitas", icon: Activity },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { theme, toggle } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    await logActivity("logout", "admin", "Keluar dari dashboard");
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/admin/login", replace: true });
  }

  const nav = (
    <nav className="space-y-1" aria-label="Menu admin">
      {ADMIN_MENU.map((item) => {
        const to = item.slug ? `/admin/${item.slug}` : "/admin";
        const active = pathname === to;
        const linkProps = item.slug
          ? ({ to: "/admin/$section", params: { section: item.slug } } as const)
          : ({ to: "/admin" } as const);
        return (
          <Link
            key={item.label}
            {...linkProps}
            onClick={() => setOpen(false)}
            className={cn(
               "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-all",
              active
                 ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
      <Button
        type="button"
        variant="ghost"
        onClick={() => void signOut()}
        className="h-9 w-full justify-start gap-2.5 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Logout
      </Button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-sidebar-border bg-sidebar p-4 lg:sticky lg:top-0 lg:block">
        <Link to="/" className="mb-6 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Network className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block font-display text-sm font-bold">Admin XI TJKT A</span>
            <span className="block text-[11px] text-muted-foreground">Lihat website publik</span>
          </span>
        </Link>
        {nav}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/90 px-4 shadow-sm backdrop-blur-xl lg:flex lg:justify-end">
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label={open ? "Tutup menu admin" : "Buka menu admin"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </Button>
           <span className="truncate font-display text-sm font-semibold lg:hidden">Dashboard Admin</span>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">Lihat Website</Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggle}
              aria-label={theme === "dark" ? "Mode terang" : "Mode gelap"}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </div>
        </header>

         <div className={cn("grid border-b border-border bg-sidebar transition-[grid-template-rows,opacity] duration-300 lg:hidden", open ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0")}>
           <div className="max-h-[calc(100vh-64px)] overflow-y-auto"><div className="p-4">{nav}</div></div>
         </div>

         <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
