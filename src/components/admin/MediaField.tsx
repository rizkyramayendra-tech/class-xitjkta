import { useRef, useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { StorageImage } from "@/components/StorageImage";
import { removeFile, uploadFile, type Bucket } from "@/lib/cms";

type Props = {
  label: string;
  value?: string | null;
  onChange: (ref: string) => void;
  bucket?: Bucket;
  folder?: string;
  accept?: string;
  preview?: boolean;
};

export function MediaField({
  label,
  value,
  onChange,
  bucket = "media",
  folder = "umum",
  accept = "image/jpeg,image/jpg,image/png,image/webp",
  preview = true,
}: Props) {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setBusy(true);
    try {
      const ref = await uploadFile(bucket, file, folder);
      onChange(ref);
      toast.success("Berkas berhasil diunggah.");
    } catch {
      toast.error("Gagal mengunggah berkas. Periksa ukuran dan format berkas.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-start gap-3">
        {preview ? (
          <StorageImage
            src={value}
            alt={`Pratinjau ${label}`}
            className="h-20 w-20 shrink-0 rounded-lg border border-border object-cover"
          />
        ) : null}
        <div className="flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            aria-label={`Unggah ${label}`}
            className="block w-full text-sm file:mr-3 file:rounded-md file:border file:border-border file:bg-secondary file:px-3 file:py-1.5 file:text-sm"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
          {busy ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              Mengunggah…
              <Progress value={70} className="h-1 w-24" />
            </div>
          ) : null}
          {value ? (
            <div className="flex items-center gap-2">
              <p className="truncate text-xs text-muted-foreground">{value}</p>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={async () => {
                  await removeFile(value);
                  onChange("");
                  toast.success("Berkas dihapus.");
                }}
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">Hapus berkas</span>
              </Button>
            </div>
          ) : (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Upload className="h-3.5 w-3.5" aria-hidden="true" /> JPG, JPEG, PNG, atau WEBP.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
