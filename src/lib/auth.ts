import { supabase } from "./supabase";
import { Session, User } from "@supabase/supabase-js";
import { UserRole } from "@/types/roles";

export type AuthUser = User | null;

export async function signUp(
  email: string,
  password: string,
  metadata?: { firstName?: string; lastName?: string; role?: UserRole },
) {
  // Simple signup without any additional operations
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        firstName: metadata?.firstName,
        lastName: metadata?.lastName,
        role: metadata?.role || "guest",
      },
      emailRedirectTo: `${window.location.origin}/auth/login`,
    },
  });
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        // Set default role for social login users
        role: "admin",
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signInWithFacebook() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        // Set default role for social login users
        role: "admin",
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function getCurrentSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return data.user;
}
