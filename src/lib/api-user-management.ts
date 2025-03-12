import { supabase } from "./supabase";

export async function deleteUser(email: string) {
  try {
    // Use the Edge Function to delete the user
    const { data, error } = await supabase.functions.invoke("delete-user", {
      body: { email },
    });

    if (error) throw error;

    if (!data.success) {
      return {
        success: false,
        error: data.error || "Nie udało się usunąć użytkownika",
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: error.message || "Nie udało się usunąć użytkownika",
    };
  }
}
