import React, { useState, useEffect } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";
import { useNavigate } from "react-router-dom";
import {
  signUp,
  signInWithGoogle,
  signInWithFacebook,
  getCurrentUser,
} from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { UserRole } from "@/types/roles";

const RegisterPage = () => {
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

  const handleRegister = async (values: any) => {
    setIsLoading(true);
    try {
      // By default, new users are registered as 'admin' role
      // This is because regular users signing up are property owners/managers
      const { data, error } = await signUp(values.email, values.password, {
        firstName: values.firstName,
        lastName: values.lastName,
        role: "admin" as UserRole,
      });

      if (error) throw error;

      toast({
        title: "Konto utworzone pomyślnie",
        description:
          "Sprawdź swoją skrzynkę email, aby potwierdzić rejestrację.",
        variant: "default",
      });

      // Redirect to login page after successful registration
      navigate("/auth/login");
    } catch (error: any) {
      toast({
        title: "Błąd rejestracji",
        description: error.message || "Sprawdź swoje dane i spróbuj ponownie",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigate("/auth/login");
  };

  const handleGoogleRegister = async () => {
    try {
      await signInWithGoogle();
      // Redirect happens in the callback
    } catch (error: any) {
      toast({
        title: "Błąd rejestracji przez Google",
        description: error.message || "Spróbuj ponownie później",
        variant: "destructive",
      });
    }
  };

  const handleFacebookRegister = async () => {
    try {
      await signInWithFacebook();
      // Redirect happens in the callback
    } catch (error: any) {
      toast({
        title: "Błąd rejestracji przez Facebook",
        description: error.message || "Spróbuj ponownie później",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthLayout>
      <RegisterForm
        onSubmit={handleRegister}
        onLogin={handleLogin}
        onGoogleRegister={handleGoogleRegister}
        onFacebookRegister={handleFacebookRegister}
      />
    </AuthLayout>
  );
};

export default RegisterPage;
