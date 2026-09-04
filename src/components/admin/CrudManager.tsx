import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MediaField } from "@/components/admin/MediaField";
import { db, logActivity, type Bucket, type TableName } from "@/lib/cms";

export type Field = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "select" | "image" | "file" | "switch";
  options?: readonly string[];
  required?: boolean;
  placeholder?: string;
  bucket?: Bucket;
  folder?: string;
};

export type CrudConfig = {
  table: TableName;
  title: string;
  description: string;
  singular: string;
  fields: Field[];
  columns: { name: string; label: string }[];
  defaults: Record<string, unknown>;
  orderBy?: string;
  ascending?: boolean;
};

type Row = Record<string, unknown>;

export function CrudManager({ config }: { config: CrudConfig }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Row>({});
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Row | null>(null);
  const [search, setSearch] = useState("");

  const listKey = ["admin-table", config.table] as const;
  const { data, isLoading } = useQuery({
    queryKey: listKey,
    queryFn: async () => {
      const { data: rows, error } = await db
        .from(config.table)
        .select("*")
        .order(config.orderBy ?? "created_at", { ascending: config.ascending ?? false });
      if (error) throw error;
      return (rows ?? []) as Row[];
    },
  });

  const rows = useMemo(() => {
    if (!search.trim()) return data ?? [];
    const q = search.toLowerCase();
    return (data ?? []).filter((row) =>
      config.columns.some((col) => String(row[col.name] ?? "").toLowerCase().includes(q)),
    );
  }, [data, search, config.columns]);

  function openCreate() {
    setEditing(null);
    setForm({ ...config.defaults });
    setOpen(true);
  }

  function openEdit(row: Row) {
    setEditing(row);
    setForm({ ...row });
    setOpen(true);
  }

  async function save() {
    for (const field of config.fields) {
      if (field.required && !String(form[field.name] ?? "").trim()) {
        toast.error(`${field.label} wajib diisi.`);
        return;
      }
    }
    setSaving(true);
    try {
      const payload: Row = {};
      for (const field of config.fields) {
        let value = form[field.name];
        if (field.type === "number") value = Number(value ?? 0);
        if (value === "") value = null;
        payload[field.name] = value ?? null;
      }
      if (editing) {
        const { error } = await db.from(config.table).update(payload).eq("id", editing['id'] as string);
        if (error) throw error;
        await logActivity("update", config.table, `Mengubah ${config.singular}`);
        toast.success(`${config.singular} berhasil diperbarui.`);
      } else {
        const { error } = await db.from(config.table).insert(payload);
        if (error) throw error;
        await logActivity("create", config.table, `Menambah ${config.singular}`);
        toast.success(`${config.singular} berhasil ditambahkan.`);
      }
      void qc.invalidateQueries({ queryKey: listKey });
      void qc.invalidateQueries({ queryKey: ["table"] });
      void qc.invalidateQueries({ queryKey: ["stats"] });
      setOpen(false);
    } catch {
      toast.error("Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    try {
      const { error } = await db.from(config.table).delete().eq("id", toDelete['id'] as string);
      if (error) throw error;
      await logActivity("delete", config.table, `Menghapus ${config.singular}`);
      toast.success("Data berhasil dihapus.");
      void qc.invalidateQueries({ queryKey: listKey });
      void qc.invalidateQueries({ queryKey: ["table"] });
      void qc.invalidateQueries({ queryKey: ["stats"] });
    } catch {
      toast.error("Gagal menghapus data.");
    } finally {
      setToDelete(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">{config.title}</h1>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
        <div className="flex gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari…"
            aria-label={`Cari ${config.title}`}
            className="sm:w-52"
          />
          <Button onClick={openCreate}>
            <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" /> Tambah
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="panel p-10 text-center text-sm text-muted-foreground">
          Belum ada data. Klik “Tambah” untuk membuat {config.singular.toLowerCase()} pertama.
        </div>
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-secondary text-left">
              <tr>
                {config.columns.map((col) => (
                  <th key={col.name} scope="col" className="p-3 font-semibold">
                    {col.label}
                  </th>
                ))}
                <th scope="col" className="p-3 text-right font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={String(row['id'])} className="border-t border-border align-top">
                  {config.columns.map((col) => (
                    <td key={col.name} className="max-w-[280px] p-3">
                      {col.name === "status" ? (
                        <Badge variant={row['status'] === "published" ? "default" : "secondary"}>
                          {row['status'] === "published" ? "Terbit" : "Draf"}
                        </Badge>
                      ) : (
                        <span className="line-clamp-2 break-words">
                          {String(row[col.name] ?? "-") || "-"}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="whitespace-nowrap p-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(row)}>
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Ubah</span>
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setToDelete(row)}>
                      <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
                      <span className="sr-only">Hapus</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Ubah ${config.singular}` : `Tambah ${config.singular}`}
            </DialogTitle>
            <DialogDescription>Lengkapi data di bawah lalu simpan.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void save();
            }}
          >
            {config.fields.map((field) => {
              const value = form[field.name];
              const id = `field-${field.name}`;
              if (field.type === "image" || field.type === "file") {
                return (
                  <MediaField
                    key={field.name}
                    label={field.label}
                    value={typeof value === "string" ? value : ""}
                    bucket={field.bucket ?? (field.type === "file" ? "files" : "media")}
                    folder={field.folder ?? config.table}
                    preview={field.type === "image"}
                    onChange={(ref) => setForm((f) => ({ ...f, [field.name]: ref }))}
                  />
                );
              }
              if (field.type === "select") {
                return (
                  <div key={field.name} className="space-y-1.5">
                    <Label htmlFor={id}>{field.label}</Label>
                    <Select
                      value={String(value ?? "")}
                      onValueChange={(v) => setForm((f) => ({ ...f, [field.name]: v }))}
                    >
                      <SelectTrigger id={id}>
                        <SelectValue placeholder="Pilih…" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              }
              if (field.type === "switch") {
                return (
                  <div key={field.name} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <Label htmlFor={id}>{field.label}</Label>
                    <Switch
                      id={id}
                      checked={Boolean(value)}
                      onCheckedChange={(checked) =>
                        setForm((f) => ({ ...f, [field.name]: checked }))
                      }
                    />
                  </div>
                );
              }
              if (field.type === "textarea") {
                return (
                  <div key={field.name} className="space-y-1.5">
                    <Label htmlFor={id}>{field.label}</Label>
                    <Textarea
                      id={id}
                      rows={4}
                      value={String(value ?? "")}
                      placeholder={field.placeholder}
                      onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
                    />
                  </div>
                );
              }
              return (
                <div key={field.name} className="space-y-1.5">
                  <Label htmlFor={id}>{field.label}</Label>
                  <Input
                    id={id}
                    type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                    value={String(value ?? "")}
                    placeholder={field.placeholder}
                    required={field.required}
                    onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
                  />
                </div>
              );
            })}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin ingin menghapus data ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmDelete()}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
