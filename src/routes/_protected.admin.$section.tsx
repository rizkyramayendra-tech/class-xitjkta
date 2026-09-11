import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { ActivityLog } from "@/components/admin/ActivityLog";
import { SecuritySettings } from "@/components/admin/SecuritySettings";
import { SectionRenderer, CONTENT_SECTIONS, CRUD_SECTIONS } from "@/components/admin/sections";

export const Route = createFileRoute("/_protected/admin/$section")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Kelola Konten — Admin XI TJKT A" },
      { name: "description", content: "Kelola konten website kelas XI TJKT A." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Kelola Konten — Admin XI TJKT A" },
      { property: "og:description", content: "Kelola konten website kelas XI TJKT A." },
    ],
  }),
  component: AdminSection,
});

function AdminSection() {
  const { section } = Route.useParams();

  let body: React.ReactNode;
  if (section === "keamanan") body = <SecuritySettings />;
  else if (section === "aktivitas") body = <ActivityLog />;
  else if (CRUD_SECTIONS[section] || CONTENT_SECTIONS[section]) body = <SectionRenderer slug={section} />;
  else
    body = (
      <div className="panel p-10 text-center">
        <h1 className="font-display text-xl font-bold">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Menu yang Anda tuju tidak tersedia.{" "}
          <Link to="/admin" className="text-primary underline-offset-4 hover:underline">
            Kembali ke dashboard
          </Link>
        </p>
      </div>
    );

  return <AdminShell>{body}</AdminShell>;
}
