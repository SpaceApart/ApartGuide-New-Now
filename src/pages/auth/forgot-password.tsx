import React, { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";
import { useToast } from "@/components/ui/use-toast";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: { email: string }) => {
    setIsLoading(true);
    try {
      const { data } = await resetPassword(values.email);

      // Send password reset email
      const resetLink = `${window.location.origin}/auth/reset-password?token=${data?.user?.confirmation_token}`;
      const { success: emailSuccess } = await sendPasswordResetEmail(
        values.email,
        resetLink,
      );

      // Form handles success state internally
      toast({
        title: "Email wysłany",
        description: emailSuccess
          ? "Sprawdź swoją skrzynkę email, aby zresetować hasło."
          : "Link do resetowania hasła został wygenerowany, ale wystąpił problem z wysłaniem emaila.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Błąd wysyłania emaila",
        description:
          error.message || "Sprawdź swój adres email i spróbuj ponownie",
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
      <ForgotPasswordForm
        onSubmit={handleSubmit}
        onBackToLogin={handleBackToLogin}
      />
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
