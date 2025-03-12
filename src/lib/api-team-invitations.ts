import { supabase } from "./supabase";

export async function inviteTeamMember(
  email: string,
  firstName: string,
  lastName: string,
  role: string = "team_member",
  teamType: string = "service",
) {
  try {
    // Use the Edge Function to invite the team member
    const { data, error } = await supabase.functions.invoke(
      "invite-team-member",
      {
        body: { email, firstName, lastName, role, teamType },
      },
    );

    if (error) throw error;

    if (!data.success) {
      return {
        success: false,
        error: data.error || "Nie udało się wysłać zaproszenia",
      };
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
