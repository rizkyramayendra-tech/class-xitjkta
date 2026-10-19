import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { isPublishedAsset, parseStorageRef, PUBLIC_ASSET_TTL_SECONDS } from "@/lib/storage-access";

/** Public capability issuance, never an unrestricted storage signer. */
export const getPublishedAssetUrl = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ ref: z.string().min(1).max(1024) }).parse(input))
  .handler(async ({ data }) => {
    const parsed = parseStorageRef(data.ref);
    if (!parsed) return null;
    const backendUrl = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"];
    if (!backendUrl || !key) return null;
    const { createClient } = await import("@supabase/supabase-js");
    const publicClient = createClient(backendUrl, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      } },
    });
    try {
      const allowed = await isPublishedAsset(data.ref, {
        hasPublishedReference: async (table, column, ref) => {
          const { data: rows, error } = await publicClient.from(table).select("id").eq("status", "published").eq(column, ref).limit(1);
          if (error) throw error;
          return Boolean(rows?.length);
        },
        siteDocuments: async () => {
          const { data: rows, error } = await publicClient.from("site_content").select("data");
          if (error) throw error;
          return (rows ?? []).map((row) => row.data);
        },
      });
      if (!allowed) return null;
      // Privileged signing happens only after a publishable, RLS-scoped read authorizes the exact object.
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: signed, error } = await supabaseAdmin.storage.from(parsed.bucket).createSignedUrl(parsed.path, PUBLIC_ASSET_TTL_SECONDS);
      if (error || !signed) return null;
      const result = new URL(signed.signedUrl);
      const browserOrigin = new URL(import.meta.env['VITE_SUPABASE_URL']);
      result.protocol = browserOrigin.protocol;
      result.host = browserOrigin.host;
      return result.toString();
    } catch {
      return null;
    }
  });