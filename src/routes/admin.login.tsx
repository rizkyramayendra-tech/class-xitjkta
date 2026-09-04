import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Lock, Network } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { getAdminStatus, setupAdminAccount } from "@/lib/admin.functions";
import { logActivity } from "@/lib/cms";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Login Administrator — XI TJKT A" },
      { name: "description", content: "Halaman masuk khusus administrator kelas XI TJKT A." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Login Administrator — XI TJKT A" },
      { property: "og:description", content: "Halaman masuk khusus administrator kelas XI TJKT A." },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const status = useServerFn(getAdminStatus);
  const setup = useServerFn(setupAdminAccount);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"login" | "forgot">("login");

  const { data: adminStatus, refetch } = useQuery({
    queryKey: ["admin-status"],
    queryFn: () => status({}),
  });

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  const needsSetup = adminStatus ? !adminStatus.setupCompleted : false;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Jika email terdaftar, tautan pemulihan telah dikirim.");
        setMode("login");
        return;
      }

      if (needsSetup) {
        if (password.length < 10) {
          toast.error("Kata sandi minimal 10 karakter.");
          return;
        }
        if (password !== confirm) {
          toast.error("Konfirmasi kata sandi tidak cocok.");
          return;
        }
        await setup({ data: { email: email.trim(), password } });
        toast.success("Akun administrator aktif. Silakan masuk.");
        await refetch();
        setPassword("");
        setConfirm("");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      await logActivity("login", "admin", "Masuk ke dashboard admin");
      void navigate({ to: "/admin", replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      toast.error(
        /diotorisasi|sudah aktif|tidak ditemukan/i.test(message)
          ? message
          : "Email atau kata sandi salah.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid-tech flex min-h-screen items-center justify-center px-4 py-12">
      <div className="panel w-full max-w-md p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Network className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="font-display text-2xl font-bold">
            {mode === "forgot"
              ? "Pemulihan Kata Sandi"
              : needsSetup
                ? "Aktivasi Administrator"
                : "Login Administrator"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "forgot"
              ? "Masukkan email administrator untuk menerima tautan pemulihan."
              : needsSetup
                ? "Buat kata sandi untuk akun administrator resmi kelas."
                : "Halaman ini khusus administrator kelas XI TJKT A."}
          </p>
          {adminStatus?.maskedEmail ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Email terotorisasi: {adminStatus.maskedEmail}
            </p>
          ) : null}
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {mode === "login" ? (
            <div className="space-y-1.5">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                autoComplete={needsSetup ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          ) : null}
          {mode === "login" && needsSetup ? (
            <div className="space-y-1.5">
              <Label htmlFor="confirm">Konfirmasi Kata Sandi</Label>
              <Input
                id="confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
          ) : null}

          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" aria-hidden="true" /> : <Lock className="mr-1.5 h-4 w-4" aria-hidden="true" />}
            {mode === "forgot" ? "Kirim Tautan" : needsSetup ? "Aktifkan Akun" : "Masuk"}
          </Button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm">
          <button
            type="button"
            className="text-primary underline-offset-4 hover:underline"
            onClick={() => setMode((m) => (m === "login" ? "forgot" : "login"))}
          >
            {mode === "login" ? "Lupa kata sandi?" : "Kembali ke login"}
          </button>
          <Link to="/" className="text-muted-foreground underline-offset-4 hover:underline">
            Kembali ke website
          </Link>
        </div>
      </div>
    </main>
  );
}
