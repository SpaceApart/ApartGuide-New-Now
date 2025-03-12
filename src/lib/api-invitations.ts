import { supabase } from "./supabase";

export async function inviteTeamMember(
  email: string,
  firstName: string,
  lastName: string,
  role: string = "team_member",
) {
  try {
    // Check if team member already has an account
    const { data: teamMemberWithAccount, error: teamMemberCheckError } =
      await supabase
        .from("team_members")
        .select("*")
        .eq("email", email)
        .maybeSingle();

    if (teamMemberCheckError && teamMemberCheckError.code !== "PGRST116") {
      throw teamMemberCheckError;
    }

    if (teamMemberWithAccount && teamMemberWithAccount.has_account) {
      return {
        success: false,
        error: "Ten członek zespołu już posiada konto w systemie",
      };
    }

    // Check if user already exists in auth
    const { data: authData, error: authError } =
      await supabase.auth.admin.listUsers();

    if (authError) {
      console.error("Error checking auth users:", authError);
    } else if (authData?.users) {
      const existingUser = authData.users.find((user) => user.email === email);
      if (existingUser) {
        return {
          success: false,
          error:
            "Użytkownik z tym adresem email już istnieje w systemie autentykacji",
        };
      }
    }

    // Check if user already exists in profiles
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (profileError && profileError.code !== "PGRST116") {
      throw profileError;
    }

    if (profileData) {
      return {
        success: false,
        error:
          "Użytkownik z tym adresem email już istnieje w profilach systemu",
      };
    }

    // Create a team member record in the database
    const { data: teamMemberData, error: teamMemberError } = await supabase
      .from("team_members")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (teamMemberError) throw teamMemberError;

    // If the team member doesn't exist in the database yet, create them
    if (!teamMemberData) {
      const { error: insertError } = await supabase
        .from("team_members")
        .insert([
          {
            email,
            first_name: firstName,
            last_name: lastName,
            role: role,
            team_type: "service", // Default team type
          },
        ]);

      if (insertError) throw insertError;
    }

    // Generate a random password for the initial signup
    const tempPassword =
      Math.random().toString(36).slice(-10) +
      Math.random().toString(36).toUpperCase().slice(-2) +
      "!1";

    // Create the user account with a temporary password
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password: tempPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/set-password`,
          data: {
            firstName,
            lastName,
            role,
            needsPasswordChange: true,
          },
        },
      },
    );

    if (signUpError) throw signUpError;

    // Update the team member to indicate they now have an account
    const { error: updateError } = await supabase
      .from("team_members")
      .update({ has_account: true })
      .eq("email", email);

    if (updateError) {
      console.error(
        "Error updating team member has_account status:",
        updateError,
      );
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error inviting team member:", error);
    return {
      success: false,
      error: error.message || "Nie udało się wysłać zaproszenia",
    };
  }
}
