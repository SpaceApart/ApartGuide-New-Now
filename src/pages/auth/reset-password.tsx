import React, { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { updatePassword } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: { password: string }) => {
    setIsLoading(true);
    try {
      await updatePassword(values.password);
      // Form handles success state internally
      toast({
        title: "Hasło zmienione",
        description: "Twoje hasło zostało pomyślnie zmienione.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Błąd zmiany hasła",
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
        token={token}
      />
    </AuthLayout>
  );
};

export default ResetPasswordPage;
