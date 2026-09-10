import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/** Untyped view of the client for generic, table-name-driven helpers. */
export const db = supabase as unknown as SupabaseClient;

export type Json = Record<string, string>;

/** ---------- Site content (singleton JSON documents) ---------- */

export const SITE_KEYS = ["site", "class_profile", "teacher", "school_info", "contact"] as const;
export type SiteKey = (typeof SITE_KEYS)[number];

export function useSiteContent(key: SiteKey) {
  return useQuery({
    queryKey: ["site_content", key],
    staleTime: 30_000,
    queryFn: async (): Promise<Json> => {
      const { data, error } = await supabase
        .from("site_content")
        .select("data")
        .eq("key", key)
        .maybeSingle();
      if (error) throw error;
      return ((data?.data ?? {}) as Json) || {};
    },
  });
}

export async function saveSiteContent(key: SiteKey, data: Json) {
  const { error } = await supabase
    .from("site_content")
    .upsert({ key, data, updated_at: new Date().toISOString() });
  if (error) throw error;
}

/** ---------- Storage helpers (private buckets + signed urls) ---------- */

export type Bucket = "media" | "files";

export async function uploadFile(bucket: Bucket, file: File, folder: string) {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  return `${bucket}/${path}`;
}

export async function removeFile(ref: string) {
  const [bucket, ...rest] = ref.split("/");
  if (!bucket || rest.length === 0) return;
  await supabase.storage.from(bucket).remove([rest.join("/")]);
}

export async function signedUrl(ref?: string | null) {
  if (!ref) return null;
  if (/^https?:\/\//.test(ref)) return ref;
  const [bucket, ...rest] = ref.split("/");
  if (!bucket || rest.length === 0) return null;
  const { data } = await supabase.storage.from(bucket).createSignedUrl(rest.join("/"), 60 * 60 * 24);
  return data?.signedUrl ?? null;
}

export function useSignedUrl(ref?: string | null) {
  return useQuery({
    queryKey: ["signed-url", ref],
    enabled: !!ref,
    staleTime: 1000 * 60 * 60,
    queryFn: () => signedUrl(ref),
  });
}

/** ---------- Activity log ---------- */

export async function logActivity(action: string, entity: string, detail?: string) {
  const { data } = await supabase.auth.getUser();
  await supabase.from("activity_logs").insert({
    action,
    entity,
    detail: detail ?? null,
    actor_email: data.user?.email ?? null,
  });
}

/** ---------- Generic table hooks ---------- */

export type TableName =
  | "students"
  | "schedules"
  | "resources"
  | "announcements"
  | "events"
  | "duty_roster"
  | "achievements"
  | "gallery";

type ListOptions = {
  orderBy?: string;
  ascending?: boolean;
  limit?: number;
  publishedOnly?: boolean;
  filter?: { column: string; value: string };
};

export function useTable<T = Record<string, unknown>>(table: TableName, options: ListOptions = {}) {
  const { orderBy = "created_at", ascending = false, limit, publishedOnly = true, filter } = options;
  return useQuery({
    queryKey: ["table", table, options],
    staleTime: 15_000,
    queryFn: async (): Promise<T[]> => {
      let query = db.from(table).select("*").order(orderBy, { ascending });
      if (publishedOnly) query = query.eq("status", "published");
      if (filter) query = query.eq(filter.column, filter.value);
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}

export function useInvalidateAll() {
  const qc = useQueryClient();
  return () => {
    void qc.invalidateQueries({ queryKey: ["table"] });
    void qc.invalidateQueries({ queryKey: ["site_content"] });
    void qc.invalidateQueries({ queryKey: ["stats"] });
    void qc.invalidateQueries({ queryKey: ["logs"] });
  };
}

/** ---------- Misc ---------- */

export const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] as const;

export const SUBJECTS = [
  "TJKN",
  "Sejarah",
  "KJ",
  "Bahasa Inggris",
  "PPJ",
  "MK",
  "PAI",
  "Bahasa Indonesia",
  "PIL",
  "PKN",
  "PKK",
  "ASJ",
  "PKPJ",
  "PJOK",
  "Matematika",
  "BK",
  "Gr.W",
  "Ekskul",
];

export function formatDate(value?: string | null) {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function formatDateTime(value?: string | null) {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}
