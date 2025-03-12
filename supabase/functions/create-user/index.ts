import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, password, firstName, lastName, role } = await req.json();

    if (!email || !password) {
      throw new Error("Missing required fields: email, password");
    }

    // Create user with provided role and auto-confirm email
    const { data: userData, error: userError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          firstName,
          lastName,
          role: role || "team_member",
        },
      });

    if (userError) throw userError;

    // Create profile for the user
    if (userData.user) {
      const { error: profileError } = await supabase.from("profiles").upsert([
        {
          id: userData.user.id,
          email,
          first_name: firstName || "",
          last_name: lastName || "",
          role: role || "team_member",
        },
      ]);

      if (profileError) {
        console.error("Error creating profile:", profileError);
        // We don't throw here because we want to continue with the process
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: userData.user,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error creating user:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to create user",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
