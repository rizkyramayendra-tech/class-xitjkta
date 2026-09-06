import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/cms";
import { supabase } from "@/integrations/supabase/client";

export function ActivityLog() {
  const { data, isLoading } = useQuery({
    queryKey: ["logs"],
    queryFn: async () => {
      const { data: rows, error } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return rows ?? [];
    },
  });

  return (
     <div className="mx-auto max-w-[1200px]">
      <div className="mb-6">
         <span className="mb-3 block h-1 w-9 rounded-full bg-primary" aria-hidden="true" />
         <h1 className="font-display text-2xl font-bold sm:text-3xl">Riwayat Aktivitas</h1>
        <p className="text-sm text-muted-foreground">100 aktivitas administrator terakhir.</p>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (data ?? []).length === 0 ? (
        <p className="panel p-10 text-center text-sm text-muted-foreground">Belum ada aktivitas.</p>
      ) : (
         <ul className="panel divide-y divide-border overflow-hidden">
          {(data ?? []).map((log) => (
             <li key={log.id} className="flex flex-wrap items-center gap-3 p-4 text-sm transition-colors hover:bg-secondary/40">
              <Badge variant="secondary">{log.action}</Badge>
              <span className="font-medium">{log.entity ?? "-"}</span>
              <span className="text-muted-foreground">{log.detail ?? ""}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {log.actor_email ?? "-"} · {formatDateTime(log.created_at)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
