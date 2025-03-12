import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  sendTemplateEmail,
  sendInvitationEmail,
  sendPasswordResetEmail,
} from "../lib/email";
import { supabase } from "../lib/supabase";

// Mock supabase client
vi.mock("../lib/supabase", () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

describe("Email Functions", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("sendTemplateEmail", () => {
    it("should call supabase.functions.invoke with correct parameters", async () => {
      const templateName = "test-template";
      const to = "test@example.com";
      const templateData = { key: "value" };
      const userId = "user-123";
      const propertyId = "property-456";

      supabase.functions.invoke.mockResolvedValue({ data: {}, error: null });

      await sendTemplateEmail(
        templateName,
        to,
        templateData,
        userId,
        propertyId,
      );

      expect(supabase.functions.invoke).toHaveBeenCalledWith("send-email", {
        body: { templateName, to, templateData, userId, propertyId },
      });
    });

    it("should return success when email is sent successfully", async () => {
      supabase.functions.invoke.mockResolvedValue({
        data: { id: "email-123" },
        error: null,
      });

      const result = await sendTemplateEmail(
        "template",
        "test@example.com",
        {},
      );

      expect(result).toEqual({ success: true, data: { id: "email-123" } });
    });

    it("should return error when email sending fails", async () => {
      const error = new Error("Failed to send email");
      supabase.functions.invoke.mockResolvedValue({ data: null, error });

      const result = await sendTemplateEmail(
        "template",
        "test@example.com",
        {},
      );

      expect(result).toEqual({
        success: false,
        error: "Failed to send email",
      });
    });
  });

  describe("sendInvitationEmail", () => {
    it("should call sendTemplateEmail with correct parameters", async () => {
      const to = "test@example.com";
      const firstName = "Test";
      const invitationLink = "https://example.com/invitation";

      // Mock sendTemplateEmail by temporarily replacing it
      const originalSendTemplateEmail = sendTemplateEmail;
      global.sendTemplateEmail = vi.fn().mockResolvedValue({ success: true });

      await sendInvitationEmail(to, firstName, invitationLink);

      expect(global.sendTemplateEmail).toHaveBeenCalledWith("invitation", to, {
        first_name: firstName,
        invitation_link: invitationLink,
      });

      // Restore original function
      global.sendTemplateEmail = originalSendTemplateEmail;
    });
  });

  describe("sendPasswordResetEmail", () => {
    it("should call sendTemplateEmail with correct parameters", async () => {
      const to = "test@example.com";
      const resetLink = "https://example.com/reset";

      // Mock sendTemplateEmail by temporarily replacing it
      const originalSendTemplateEmail = sendTemplateEmail;
      global.sendTemplateEmail = vi.fn().mockResolvedValue({ success: true });

      await sendPasswordResetEmail(to, resetLink);

      expect(global.sendTemplateEmail).toHaveBeenCalledWith(
        "password_reset",
        to,
        {
          reset_link: resetLink,
        },
      );

      // Restore original function
      global.sendTemplateEmail = originalSendTemplateEmail;
    });
  });
});
