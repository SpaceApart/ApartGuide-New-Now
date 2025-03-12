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

    const { email, firstName, lastName, role } = await req.json();

    if (!email || !firstName || !lastName) {
      throw new Error("Missing required fields");
    }

    // Check if user already exists
    const { data: users, error: searchError } =
      await supabase.auth.admin.listUsers();

    if (searchError) throw searchError;

    const existingUser = users?.users?.find((user) => user.email === email);

    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Użytkownik z tym adresem email już istnieje w systemie",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Send invitation
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: {
        firstName,
        lastName,
        role: role || "team_member",
      },
      redirectTo: `${req.headers.get("origin")}/auth/set-password`,
    });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error inviting user:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Nie udało się wysłać zaproszenia",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
