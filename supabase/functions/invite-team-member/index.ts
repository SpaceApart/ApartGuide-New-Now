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

    const {
      email,
      firstName,
      lastName,
      role,
      teamType = "service",
    } = await req.json();

    if (!email || !firstName || !lastName) {
      throw new Error("Missing required fields");
    }

    // Check if user already exists in auth
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

    // Generate a random password for the initial signup
    const tempPassword =
      Math.random().toString(36).slice(-10) +
      Math.random().toString(36).toUpperCase().slice(-2) +
      "!1";

    // Create the user account with a temporary password
    const { data: signUpData, error: signUpError } =
      await supabase.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true, // Don't require email verification
        user_metadata: {
          firstName,
          lastName,
          role: role || "team_member",
          needsPasswordChange: true,
        },
      });

    if (signUpError) throw signUpError;

    // Create profile for the user
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: signUpData.user.id,
        email: email,
        first_name: firstName,
        last_name: lastName,
        role: role || "team_member",
      },
    ]);

    if (profileError) {
      console.error("Error creating profile:", profileError);
      // We don't throw here because we want to continue with the process
    }

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

    // Send email verification with the temporary password
    const { error: emailError } = await supabase.auth.admin.generateLink({
      type: "signup",
      email,
      options: {
        redirectTo: `${req.headers.get("origin")}/auth/set-password`,
      },
    });

    if (emailError) {
      console.error("Error sending verification email:", emailError);
      throw emailError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Zaproszenie wysłane na adres ${email}. Tymczasowe hasło: ${tempPassword}`,
        password: tempPassword,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error inviting team member:", error);

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
