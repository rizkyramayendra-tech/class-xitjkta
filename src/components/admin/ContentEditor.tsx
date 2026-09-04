import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaField } from "@/components/admin/MediaField";
import { logActivity, saveSiteContent, useInvalidateAll, useSiteContent, type Json, type SiteKey } from "@/lib/cms";

export type ContentField = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "image";
  hint?: string;
};

export function ContentEditor({
  contentKey,
  title,
  description,
  fields,
}: {
  contentKey: SiteKey;
  title: string;
  description: string;
  fields: ContentField[];
}) {
  const { data, isLoading } = useSiteContent(contentKey);
  const [form, setForm] = useState<Json>({});
  const [saving, setSaving] = useState(false);
  const invalidate = useInvalidateAll();

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  async function save() {
    setSaving(true);
    try {
      await saveSiteContent(contentKey, form);
      await logActivity("update", `site_content:${contentKey}`, `Memperbarui ${title}`);
      invalidate();
      toast.success("Perubahan tersimpan dan langsung tampil di website.");
    } catch {
      toast.error("Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Memuat konten…</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <form
        className="panel max-w-3xl space-y-5 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        {fields.map((field) => {
          const id = `content-${field.name}`;
          if (field.type === "image") {
            return (
              <MediaField
                key={field.name}
                label={field.label}
                value={form[field.name] ?? ""}
                folder={contentKey}
                onChange={(ref) => setForm((f) => ({ ...f, [field.name]: ref }))}
              />
            );
          }
          return (
            <div key={field.name} className="space-y-1.5">
              <Label htmlFor={id}>{field.label}</Label>
              {field.type === "textarea" ? (
                <Textarea
                  id={id}
                  rows={4}
                  value={form[field.name] ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
                />
              ) : (
                <Input
                  id={id}
                  value={form[field.name] ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
                />
              )}
              {field.hint ? <p className="text-xs text-muted-foreground">{field.hint}</p> : null}
            </div>
          );
        })}
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          Simpan Perubahan
        </Button>
      </form>
    </div>
  );
}
