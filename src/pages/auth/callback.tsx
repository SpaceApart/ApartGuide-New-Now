import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error during OAuth callback:", error);
        navigate("/auth/login");
        return;
      }

      // If we have a user but no role is set, update the user metadata with admin role
      if (data.session?.user) {
        const user = data.session.user;
        const role = user.user_metadata?.role;
        const firstName = user.user_metadata?.firstName;
        const lastName = user.user_metadata?.lastName;
        const needsPasswordChange = user.user_metadata?.needsPasswordChange;

        if (!role) {
          // Set default role to admin for social logins
          await supabase.auth.updateUser({
            data: { role: "admin" },
          });
        }

        // Check if this user was invited as a team member
        const { data: teamMemberData } = await supabase
          .from("team_members")
          .select("*")
          .eq("email", user.email)
          .maybeSingle();

        if (teamMemberData) {
          // If the user exists in team_members table, update their has_account status
          const { error: updateError } = await supabase
            .from("team_members")
            .update({ has_account: true })
            .eq("email", user.email);

          if (updateError) {
            console.error("Error updating team member:", updateError);
          }

          // The profile will be created automatically by the database trigger
        }

        // If the user needs to set a password, redirect to the set-password page
        if (needsPasswordChange) {
          navigate("/auth/set-password");
          return;
        }
      }

      // Redirect to dashboard on successful authentication
      navigate("/dashboard");
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Logowanie...</h2>
        <p className="text-gray-500">Proszę czekać, trwa przekierowanie.</p>
      </div>
    </div>
  );
}
