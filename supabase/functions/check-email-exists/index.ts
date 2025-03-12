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

    const { email, excludeId } = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    // Check if team member with this email already exists
    const { data: existingTeamMember, error: teamMemberError } = await supabase
      .from("team_members")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (teamMemberError && teamMemberError.code !== "PGRST116") {
      throw teamMemberError;
    }

    if (existingTeamMember) {
      // If we're excluding an ID (for edit form) and it matches, don't count it as existing
      if (excludeId && existingTeamMember.id === excludeId) {
        // This is the same team member, so it's not a conflict
      } else {
        return new Response(
          JSON.stringify({
            exists: true,
            message: "Ten email jest już przypisany do członka zespołu",
            source: "team_members",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    // Check if user already exists in auth
    const { data: users, error: searchError } =
      await supabase.auth.admin.listUsers();

    if (searchError) throw searchError;

    const existingUser = users?.users?.find((user) => user.email === email);

    if (existingUser) {
      return new Response(
        JSON.stringify({
          exists: true,
          message: "Ten email jest już zarejestrowany w systemie",
          source: "auth",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
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
      return new Response(
        JSON.stringify({
          exists: true,
          message: "Ten email jest już przypisany do profilu użytkownika",
          source: "profiles",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // If we got here, email is available
    return new Response(
      JSON.stringify({
        exists: false,
        message: "Email jest dostępny",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error checking email:", error);

    return new Response(
      JSON.stringify({
        error: error.message || "Nie udało się sprawdzić dostępności emaila",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
