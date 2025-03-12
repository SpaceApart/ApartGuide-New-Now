import { supabase } from "./supabase";

/**
 * Send an email using a template
 * @param templateName The name of the template to use
 * @param to The recipient email address
 * @param templateData The data to use in the template
 * @param userId Optional user ID to associate with the email log
 * @param propertyId Optional property ID to associate with the email log
 * @returns A promise that resolves to the result of the email sending
 */
export async function sendTemplateEmail(
  templateName: string,
  to: string,
  templateData: Record<string, string>,
  userId?: string,
  propertyId?: string,
) {
  try {
    const { data, error } = await supabase.functions.invoke("send-email", {
      body: { templateName, to, templateData, userId, propertyId },
    });

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error.message || "Failed to send email",
    };
  }
}

/**
 * Send an invitation email
 * @param to The recipient email address
 * @param firstName The recipient's first name
 * @param invitationLink The link to activate the account
 * @returns A promise that resolves to the result of the email sending
 */
export async function sendInvitationEmail(
  to: string,
  firstName: string,
  invitationLink: string,
) {
  return sendTemplateEmail("invitation", to, {
    first_name: firstName,
    invitation_link: invitationLink,
  });
}

/**
 * Send a password reset email
 * @param to The recipient email address
 * @param resetLink The link to reset the password
 * @returns A promise that resolves to the result of the email sending
 */
export async function sendPasswordResetEmail(to: string, resetLink: string) {
  return sendTemplateEmail("password_reset", to, {
    reset_link: resetLink,
  });
}

/**
 * Send a welcome email
 * @param to The recipient email address
 * @param firstName The recipient's first name
 * @param loginLink The link to log in
 * @returns A promise that resolves to the result of the email sending
 */
export async function sendWelcomeEmail(
  to: string,
  firstName: string,
  loginLink: string,
) {
  return sendTemplateEmail("welcome", to, {
    first_name: firstName,
    login_link: loginLink,
  });
}
