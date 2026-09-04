import { useSignedUrl } from "@/lib/cms";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

type Props = {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  loading?: "lazy" | "eager";
};

export function StorageImage({ src, alt, className, fallbackClassName, loading = "lazy" }: Props) {
  const { data: url, isLoading } = useSignedUrl(src);

  if (!src || (!url && !isLoading)) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className,
          fallbackClassName,
        )}
      >
        <ImageIcon className="h-6 w-6" aria-hidden="true" />
      </div>
    );
  }

  if (!url) return <div className={cn("animate-pulse bg-muted", className)} aria-hidden="true" />;

  return <img src={url} alt={alt} loading={loading} decoding="async" className={className} />;
}
