import { createFileRoute } from "@tanstack/react-router";
import { Globe, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { useSiteContent } from "@/lib/cms";

export const Route = createFileRoute("/kontak")({
  head: () => ({
    meta: [
      { title: "Kontak — XI TJKT A SMKN 1 Gunung Talang" },
      {
        name: "description",
        content: "Kontak kelas XI TJKT A SMKN 1 Gunung Talang: alamat, email, telepon, dan media sosial.",
      },
      { property: "og:title", content: "Kontak — XI TJKT A" },
      { property: "og:description", content: "Hubungi pengurus kelas XI TJKT A SMKN 1 Gunung Talang." },
    ],
  }),
  component: Kontak,
});

function Kontak() {
  const { data } = useSiteContent("contact");

  const items = [
    { icon: MapPin, label: "Alamat", value: data?.['address'] },
    { icon: Mail, label: "Email", value: data?.['email'] },
    { icon: Phone, label: "Telepon", value: data?.['phone'] },
    { icon: MessageCircle, label: "WhatsApp", value: data?.['whatsapp'] },
    { icon: Instagram, label: "Instagram", value: data?.['instagram'] },
    { icon: Globe, label: "Website", value: data?.['website'] },
  ];

  return (
    <SiteLayout>
      <PageHeader title="Kontak" description="Informasi kontak resmi kelas XI TJKT A." />
       <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-2 lg:py-16">
        <div>
          <ul className="panel divide-y divide-border">
            {items.map((item) => (
               <li key={item.label} className="flex items-start gap-4 p-4 transition-colors hover:bg-secondary/50">
                 <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-secondary text-primary"><item.icon className="h-4 w-4" aria-hidden="true" /></span>
                 <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="break-words font-medium">{item.value || "-"}</p>
                </div>
              </li>
            ))}
          </ul>
          {data?.['note'] ? (
            <p className="mt-4 text-sm text-muted-foreground">{data['note']}</p>
          ) : null}
        </div>
        <div className="panel overflow-hidden">
          {data?.['map_embed'] ? (
            <iframe
              title="Peta lokasi sekolah"
              src={data['map_embed']}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-96 w-full border-0"
            />
          ) : (
             <div className="grid h-80 place-items-center text-sm text-muted-foreground sm:h-96">
              Peta belum tersedia.
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
