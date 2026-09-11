import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { StorageImage } from "@/components/StorageImage";
import { useSiteContent } from "@/lib/cms";

export const Route = createFileRoute("/profil-kelas")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Profil Kelas — XI TJKT A SMKN 1 Gunung Talang" },
      {
        name: "description",
        content:
          "Profil kelas XI TJKT A: identitas kelas, visi, misi, motto, dan tujuan kelas di SMKN 1 Gunung Talang.",
      },
      { property: "og:title", content: "Profil Kelas — XI TJKT A" },
      { property: "og:description", content: "Identitas, visi, misi, motto, dan tujuan kelas XI TJKT A." },
    ],
  }),
  component: ProfilKelas,
});

function ProfilKelas() {
  const { data } = useSiteContent("class_profile");

  const identity = [
    ["Nama Kelas", data?.['class_name']],
    ["Jurusan", data?.['major']],
    ["Sekolah", data?.['school']],
    ["Tahun Pembelajaran", data?.['year']],
    ["Jumlah Siswa", data?.['student_count']],
    ["Wali Kelas", data?.['homeroom']],
  ] as const;

  const blocks = [
    ["Tentang Kelas", data?.['about']],
    ["Visi", data?.['vision']],
    ["Misi", data?.['mission']],
    ["Motto", data?.['motto']],
    ["Tujuan", data?.['goals']],
  ] as const;

  return (
    <SiteLayout>
      <PageHeader
        title="Profil Kelas"
        description="Identitas resmi dan arah pengembangan kelas XI TJKT A."
      />
       <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <dl className="panel divide-y divide-border">
              {identity.map(([label, value]) => (
                <div key={label} className="grid gap-1 p-4 sm:grid-cols-3">
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                   <dd className="break-words font-medium sm:col-span-2">{value || "-"}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 space-y-6">
              {blocks.map(([title, value]) => (
                 <section key={title} className="panel panel-interactive p-6">
                  <h2 className="font-display text-lg font-semibold">{title}</h2>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {value || "Belum diisi."}
                  </p>
                </section>
              ))}
            </div>
          </div>
          <aside>
            <StorageImage
              src={data?.['image_url']}
              alt="Foto kelas XI TJKT A"
               className="aspect-[4/3] w-full rounded-lg border border-border object-cover shadow-panel lg:sticky lg:top-24"
            />
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}
