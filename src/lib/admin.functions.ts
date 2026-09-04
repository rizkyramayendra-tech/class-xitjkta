import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const setupSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(10).max(200),
});

/** Public: tells the login page whether the single admin account exists yet. */
export const getAdminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("admin_config")
    .select("admin_email, setup_completed")
    .eq("id", true)
    .maybeSingle();
  return {
    setupCompleted: Boolean(data?.setup_completed),
    // Masked so the authorized address is not fully exposed publicly.
    maskedEmail: (data?.admin_email ?? "").replace(/^(.{3}).*(@.*)$/, "$1•••$2"),
  };
});

/**
 * One-time activation of the single authorized administrator account.
 * Only the pre-authorized email can be activated, and only once.
 * The password is never stored by the app — it goes straight to Auth.
 */
export const setupAdminAccount = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => setupSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: config, error } = await supabaseAdmin
      .from("admin_config")
      .select("admin_email, setup_completed")
      .eq("id", true)
      .maybeSingle();
    if (error || !config) throw new Error("Konfigurasi administrator tidak ditemukan.");
    if (config.setup_completed) throw new Error("Akun administrator sudah aktif. Silakan masuk.");
    if (config.admin_email.toLowerCase() !== data.email.toLowerCase()) {
      throw new Error("Email ini tidak diotorisasi sebagai administrator.");
    }

    const { error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (createError && !/already/i.test(createError.message)) {
      throw new Error("Gagal membuat akun administrator.");
    }

    await supabaseAdmin
      .from("admin_config")
      .update({ setup_completed: true, updated_at: new Date().toISOString() })
      .eq("id", true);

    await supabaseAdmin.from("activity_logs").insert({
      actor_email: data.email,
      action: "setup",
      entity: "admin",
      detail: "Aktivasi akun administrator",
    });

    return { ok: true };
  });
