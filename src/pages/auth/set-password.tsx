import React, { useState, useEffect } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { updatePassword } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const SetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Check if we have a session when this page loads
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        // If no session and we have a token in the URL, try to use it
        const token = searchParams.get("token");
        if (token) {
          try {
            // Try to exchange the token for a session
            const { error } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: "email",
            });

            if (error) {
              console.error("Error verifying email:", error);
              toast({
                title: "Błąd weryfikacji",
                description:
                  "Link weryfikacyjny wygasł lub jest nieprawidłowy. Spróbuj ponownie.",
                variant: "destructive",
              });
              navigate("/auth/login");
            }
          } catch (error) {
            console.error("Error during verification:", error);
          }
        }
      }
    };

    checkSession();
  }, [searchParams, navigate, toast]);

  const handleSubmit = async (values: { password: string }) => {
    setIsLoading(true);
    try {
      await updatePassword(values.password);

      // Also update the user metadata to remove the needsPasswordChange flag
      await supabase.auth.updateUser({
        data: { needsPasswordChange: false },
      });

      toast({
        title: "Hasło ustawione",
        description:
          "Twoje hasło zostało pomyślnie ustawione. Możesz się teraz zalogować.",
        variant: "default",
      });
      navigate("/auth/login");
    } catch (error: any) {
      toast({
        title: "Błąd ustawiania hasła",
        description: error.message || "Spróbuj ponownie później",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/auth/login");
  };

  return (
    <AuthLayout>
      <ResetPasswordForm
        onSubmit={handleSubmit}
        onBackToLogin={handleBackToLogin}
        token={searchParams.get("token") || ""}
      />
    </AuthLayout>
  );
};

export default SetPasswordPage;
