import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/lib/cms";

export function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["admin-user"],
    queryFn: async () => (await supabase.auth.getUser()).data.user,
  });

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 10) {
      toast.error("Kata sandi baru minimal 10 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
      // @ts-expect-error current_password is required by Lovable Cloud auth
      current_password: currentPassword,
    });
    setBusy(false);
    if (error) {
      toast.error("Gagal mengubah kata sandi. Pastikan kata sandi saat ini benar.");
      return;
    }
    await logActivity("update", "admin", "Mengubah kata sandi administrator");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Kata sandi berhasil diperbarui.");
  }

  async function changeEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error: cfgError } = await supabase
      .from("admin_config")
      .update({ pending_email: newEmail.trim().toLowerCase(), updated_at: new Date().toISOString() })
      .eq("id", true);
    if (cfgError) {
      setBusy(false);
      toast.error("Gagal menyimpan email administrator baru.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    setBusy(false);
    if (error) {
      toast.error("Gagal mengirim permintaan penggantian email.");
      return;
    }
    await logActivity("update", "admin", "Mengajukan penggantian email administrator");
    toast.success("Tautan konfirmasi telah dikirim ke email baru Anda.");
    setNewEmail("");
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Pengaturan Keamanan</h1>
        <p className="text-sm text-muted-foreground">
          Akun administrator tunggal: <strong>{user?.email ?? "-"}</strong>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form className="panel space-y-4 p-6" onSubmit={changePassword}>
          <h2 className="font-display text-lg font-semibold">Ubah Kata Sandi</h2>
          <div className="space-y-1.5">
            <Label htmlFor="current-password">Kata Sandi Saat Ini</Label>
            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-password">Kata Sandi Baru</Label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">Minimal 10 karakter.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Konfirmasi Kata Sandi Baru</Label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={busy}>
            {busy ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            Simpan Kata Sandi
          </Button>
        </form>

        <form className="panel space-y-4 p-6" onSubmit={changeEmail}>
          <h2 className="font-display text-lg font-semibold">Ubah Email Administrator</h2>
          <p className="text-sm text-muted-foreground">
            Email baru harus dikonfirmasi melalui tautan yang dikirim ke alamat tersebut. Hanya satu
            akun administrator yang berlaku.
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="new-email">Email Baru</Label>
            <Input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" variant="outline" disabled={busy}>
            Kirim Konfirmasi
          </Button>
        </form>
      </div>
    </div>
  );
}
