import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { StorageImage } from "@/components/StorageImage";
import { useSiteContent } from "@/lib/cms";

export const Route = createFileRoute("/informasi-sekolah")({
  head: () => ({
    meta: [
      { title: "Informasi Sekolah — SMKN 1 Gunung Talang" },
      {
        name: "description",
        content: "Informasi SMKN 1 Gunung Talang: alamat, program keahlian, kontak, dan media sosial sekolah.",
      },
      { property: "og:title", content: "Informasi Sekolah — SMKN 1 Gunung Talang" },
      { property: "og:description", content: "Profil dan kontak resmi SMKN 1 Gunung Talang." },
    ],
  }),
  component: InformasiSekolah,
});

function InformasiSekolah() {
  const { data } = useSiteContent("school_info");

  const rows = [
    ["Nama Sekolah", data?['name']],
    ["Alamat", data?['address']],
    ["Telepon", data?['phone']],
    ["Email", data?['email']],
    ["Website", data?['website']],
    ["Instagram", data?['instagram']],
    ["Facebook", data?['facebook']],
    ["YouTube", data?['youtube']],
  ] as const;

  return (
    <SiteLayout>
      <PageHeader title="Informasi Sekolah" description="Profil singkat dan data resmi sekolah." />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <section className="panel p-6">
            <div className="flex items-center gap-4">
              <StorageImage
                src={data?['logo_url']}
                alt="Logo SMKN 1 Gunung Talang"
                className="h-16 w-16 rounded-lg border border-border object-cover"
              />
              <div>
                <h2 className="font-display text-xl font-bold">{data?['name'] || "-"}</h2>
                <p className="text-sm text-muted-foreground">{data?['address'] || "-"}</p>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {data?['description'] || "Belum diisi."}
            </p>
          </section>

          <section className="panel mt-6 p-6">
            <h2 className="font-display text-lg font-semibold">Program Keahlian</h2>
            <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
              {data?['majors'] || "-"}
            </p>
          </section>

          <dl className="panel mt-6 divide-y divide-border">
            {rows.map(([label, value]) => (
              <div key={label} className="grid gap-1 p-4 sm:grid-cols-3">
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="break-words font-medium sm:col-span-2">{value || "-"}</dd>
              </div>
            ))}
          </dl>
        </div>
        <aside>
          <StorageImage
            src={data?['photo_url']}
            alt="Foto gedung SMKN 1 Gunung Talang"
            className="aspect-[4/3] w-full rounded-xl border border-border object-cover"
          />
        </aside>
      </div>
    </SiteLayout>
  );
}
