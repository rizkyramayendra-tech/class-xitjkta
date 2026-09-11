import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { StorageImage } from "@/components/StorageImage";
import { RichText } from "@/components/ui/rich-text";
import { useSiteContent } from "@/lib/cms";

export const Route = createFileRoute("/wali-kelas")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Wali Kelas — XI TJKT A SMKN 1 Gunung Talang" },
      {
        name: "description",
        content: "Profil wali kelas XI TJKT A SMKN 1 Gunung Talang beserta pesan untuk siswa.",
      },
      { property: "og:title", content: "Wali Kelas — XI TJKT A" },
      { property: "og:description", content: "Profil dan pesan wali kelas XI TJKT A." },
    ],
  }),
  component: WaliKelas,
});

function WaliKelas() {
  const { data } = useSiteContent("teacher");

  return (
    <SiteLayout>
      <PageHeader title="Wali Kelas" description="Pembimbing dan penanggung jawab kelas XI TJKT A." />
       <div className="mx-auto max-w-5xl px-4 py-12 lg:py-16">
         <div className="panel grid gap-8 p-5 sm:p-6 md:grid-cols-[240px_minmax(0,1fr)] md:p-8">
          <StorageImage
            src={data?.['photo_url']}
            alt={`Foto ${data?.['name'] ?? "wali kelas"}`}
             className="mx-auto aspect-[3/4] max-h-[420px] w-full max-w-xs rounded-lg border border-border object-cover shadow-panel md:max-h-none"
          />
          <div>
            <h2 className="font-display text-2xl font-bold">{data?.['name'] || "Wali Kelas XI TJKT A"}</h2>
            <p className="mt-1 text-sm font-medium text-primary">{data?.['position'] || "Wali Kelas"}</p>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {data?.['description'] ? <RichText text={data['description']} /> : "Belum diisi."}
            </p>
            <blockquote className="mt-6 rounded-lg border-l-4 border-primary bg-secondary p-4 text-sm italic">
              "{data?.['message'] ? <RichText text={data['message']} /> : "Belum ada pesan."}"
            </blockquote>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
