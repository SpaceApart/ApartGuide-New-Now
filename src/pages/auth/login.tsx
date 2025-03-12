import React, { useState, useEffect } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import { useNavigate } from "react-router-dom";
import {
  signIn,
  signInWithGoogle,
  signInWithFacebook,
  getCurrentUser,
} from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (user) {
        navigate("/dashboard");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogin = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      await signIn(values.email, values.password);
      toast({
        title: "Zalogowano pomyślnie",
        description: "Przekierowujemy do panelu...",
        variant: "default",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Błąd logowania",
        description: error.message || "Sprawdź swoje dane i spróbuj ponownie",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/auth/forgot-password");
  };

  const handleRegister = () => {
    navigate("/auth/register");
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      // Redirect happens in the callback
    } catch (error: any) {
      toast({
        title: "Błąd logowania przez Google",
        description: error.message || "Spróbuj ponownie później",
        variant: "destructive",
      });
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signInWithFacebook();
      // Redirect happens in the callback
    } catch (error: any) {
      toast({
        title: "Błąd logowania przez Facebook",
        description: error.message || "Spróbuj ponownie później",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthLayout>
      <LoginForm
        onSubmit={handleLogin}
        onForgotPassword={handleForgotPassword}
        onRegister={handleRegister}
        onGoogleLogin={handleGoogleLogin}
        onFacebookLogin={handleFacebookLogin}
      />
    </AuthLayout>
  );
};

export default LoginPage;
