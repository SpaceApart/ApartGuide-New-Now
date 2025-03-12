import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { sendWelcomeEmail } from "@/lib/email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

const InvitationPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const navigate = useNavigate();
  const { toast } = useToast();

  const [invitation, setInvitation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [tempPasswordVerified, setTempPasswordVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!email) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("invitations")
          .select("*")
          .eq("email", email)
          .eq("used", false)
          .gt("expires_at", new Date().toISOString())
          .single();

        if (error) throw error;
        setInvitation(data);
      } catch (error: any) {
        console.error("Error fetching invitation:", error);
        toast({
          title: "Błąd",
          description:
            "Nie znaleziono ważnego zaproszenia dla tego adresu email",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvitation();
  }, [email, toast]);

  const verifyTempPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!tempPassword) {
      setError("Wprowadź tymczasowe hasło");
      return;
    }

    if (tempPassword !== invitation.temp_password) {
      setError("Nieprawidłowe tymczasowe hasło");
      return;
    }

    setTempPasswordVerified(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Hasła nie są identyczne");
      return;
    }

    if (newPassword.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Utwórz konto użytkownika z potwierdzonym emailem
      const { data: authData, error: authError } =
        await supabase.functions.invoke("create-user", {
          body: {
            email: invitation.email,
            password: newPassword,
            firstName: invitation.first_name,
            lastName: invitation.last_name,
            role: invitation.role,
          },
        });

      if (authError) throw authError;

      // 2. Sprawdź czy użytkownik został utworzony
      if (authData?.success && authData?.user) {
        // Profil został już utworzony w edge function

        // 3. Oznacz zaproszenie jako wykorzystane
        const { error: updateError } = await supabase
          .from("invitations")
          .update({ used: true })
          .eq("id", invitation.id);

        if (updateError) throw updateError;

        // Zaloguj użytkownika
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: invitation.email,
          password: newPassword,
        });

        if (signInError) {
          console.error("Error signing in:", signInError);
          throw signInError;
        }

        // 4. Oznacz członka zespołu jako mającego konto
        const { error: teamMemberError } = await supabase
          .from("team_members")
          .update({ has_account: true })
          .eq("email", invitation.email);

        if (teamMemberError) {
          console.error("Error updating team member:", teamMemberError);
        }

        // Send welcome email
        const loginLink = `${window.location.origin}/auth/login`;
        await sendWelcomeEmail(
          invitation.email,
          invitation.first_name,
          loginLink,
        );

        toast({
          title: "Sukces",
          description:
            "Konto zostało utworzone. Zostałeś automatycznie zalogowany.",
          variant: "default",
        });

        // Krótkie opóźnienie przed przekierowaniem, aby sesja miała czas się zapisać
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (error: any) {
      console.error("Error creating account:", error);
      setError(error.message || "Wystąpił błąd podczas tworzenia konta");
      toast({
        title: "Błąd",
        description: error.message || "Nie udało się utworzyć konta",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AuthLayout>
    );
  }

  if (!invitation) {
    return (
      <AuthLayout>
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Nieprawidłowe zaproszenie</h2>
          <p className="mb-6 text-muted-foreground">
            Nie znaleziono ważnego zaproszenia dla tego adresu email lub
            zaproszenie wygasło.
          </p>
          <Button onClick={() => navigate("/auth/login")}>
            Przejdź do logowania
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-2">Aktywuj swoje konto</h2>
        <p className="mb-6 text-muted-foreground">
          Witaj {invitation.first_name}!{" "}
          {tempPasswordVerified
            ? "Ustaw swoje nowe hasło, aby aktywować konto."
            : "Wprowadź tymczasowe hasło, które otrzymałeś w zaproszeniu."}
        </p>

        {!tempPasswordVerified ? (
          <form onSubmit={verifyTempPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input value={invitation.email} disabled />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tymczasowe hasło
              </label>
              <Input
                type="password"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                placeholder="Wprowadź tymczasowe hasło"
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full">
              Weryfikuj hasło
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input value={invitation.email} disabled />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Nowe hasło
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 znaków"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Potwierdź nowe hasło
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Powtórz hasło"
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Aktywuj konto
            </Button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

export default InvitationPage;
