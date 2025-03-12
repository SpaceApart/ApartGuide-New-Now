import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getProfile } from "@/lib/api";
import { Profile, UserRole } from "@/types/roles";
import { supabase } from "@/lib/supabase";

interface RoleContextType {
  userProfile: Profile | null;
  isLoading: boolean;
  userRole: UserRole | null;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isTeamMember: boolean;
  isGuest: boolean;
  refreshProfile: () => Promise<void>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = async () => {
    if (!user) {
      setUserProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      // Próba pobrania profilu bezpośrednio z Supabase zamiast przez API
      // aby uniknąć problemów z rekurencją
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error fetching profile directly:", profileError);
        throw profileError;
      }

      // Jeśli profil nie istnieje lub wystąpił błąd PGRST116 (not found), poczekaj na trigger
      if (!profile) {
        // Profil powinien zostać utworzony przez trigger bazodanowy
        // Spróbujmy poczekać chwilę i sprawdzić ponownie
        setTimeout(async () => {
          const { data: retryProfile, error: retryError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (retryError && retryError.code !== "PGRST116") {
            console.error("Error fetching profile on retry:", retryError);
          }

          if (retryProfile) {
            setUserProfile(retryProfile);
          } else {
            // Jeśli nadal nie ma profilu, utwórz go ręcznie jako fallback
            const defaultRole = user.user_metadata?.role || "guest";
            const firstName = user.user_metadata?.firstName || "";
            const lastName = user.user_metadata?.lastName || "";

            const newProfile = {
              id: user.id,
              email: user.email || "",
              first_name: firstName,
              last_name: lastName,
              role: defaultRole as UserRole,
              avatar_url: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

            // Zapisz profil w bazie danych
            const { data, error } = await supabase
              .from("profiles")
              .insert([newProfile])
              .select();

            if (error) {
              console.error("Error creating profile as fallback:", error);
              setUserProfile(newProfile); // Użyj lokalnie utworzonego profilu
            } else if (data && data.length > 0) {
              setUserProfile(data[0]);
            }
          }
        }, 1000);
      } else {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      // Utwórz tymczasowy profil, aby aplikacja mogła działać
      if (user) {
        const tempProfile = {
          id: user.id,
          email: user.email || "",
          first_name: user.user_metadata?.firstName || "",
          last_name: user.user_metadata?.lastName || "",
          role: (user.user_metadata?.role || "guest") as UserRole,
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUserProfile(tempProfile);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadProfile();
    }
  }, [user, authLoading]);

  const refreshProfile = async () => {
    setIsLoading(true);
    await loadProfile();
  };

  const userRole = userProfile?.role || null;
  const isSuperAdmin = userRole === "super_admin";
  const isAdmin = userRole === "admin" || isSuperAdmin;
  const isTeamMember = userRole === "team_member" || isAdmin;
  const isGuest = userRole === "guest" || !userRole;

  const value = {
    userProfile,
    isLoading: isLoading || authLoading,
    userRole,
    isSuperAdmin,
    isAdmin,
    isTeamMember,
    isGuest,
    refreshProfile,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
