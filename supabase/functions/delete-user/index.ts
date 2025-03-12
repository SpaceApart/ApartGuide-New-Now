import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, userId } = await req.json();

    if (!email && !userId) {
      throw new Error(
        "Missing required fields: either email or userId must be provided",
      );
    }

    let userIdToDelete = userId;

    // If we only have email, find the user ID
    if (!userIdToDelete && email) {
      const { data: users, error: searchError } =
        await supabase.auth.admin.listUsers();

      if (searchError) throw searchError;

      const user = users?.users?.find((user) => user.email === email);

      if (user) {
        userIdToDelete = user.id;
      } else {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Nie znaleziono użytkownika o podanym adresie email",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    // Delete user from profiles
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userIdToDelete);

    if (profileError) {
      console.error("Error deleting profile:", profileError);
    }

    // Delete user from property_team
    const { error: teamError } = await supabase
      .from("property_team")
      .delete()
      .eq("user_id", userIdToDelete);

    if (teamError) {
      console.error("Error deleting from property_team:", teamError);
    }

    // Delete user from auth
    const { error: authError } =
      await supabase.auth.admin.deleteUser(userIdToDelete);

    if (authError) throw authError;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting user:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Nie udało się usunąć użytkownika",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
