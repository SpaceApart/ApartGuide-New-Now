import { supabase } from "./supabase";

export async function checkEmailExists(email: string, excludeId?: string) {
  try {
    // Use the Edge Function to check if the email exists
    const { data, error } = await supabase.functions.invoke(
      "check-email-exists",
      {
        body: { email, excludeId },
      },
    );

    if (error) throw error;

    return data;
  } catch (error: any) {
    console.error("Error checking email:", error);
    return {
      error: error.message || "Nie udało się sprawdzić dostępności emaila",
    };
  }
}
