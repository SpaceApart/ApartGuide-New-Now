import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { signUp, signIn, resetPassword } from "../lib/auth";
import { supabase } from "../lib/supabase";

// Mock supabase client
vi.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      getSession: vi.fn(),
      getUser: vi.fn(),
    },
  },
}));

describe("Authentication Functions", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("signUp", () => {
    it("should call supabase.auth.signUp with correct parameters", async () => {
      const email = "test@example.com";
      const password = "password123";
      const metadata = { firstName: "Test", lastName: "User", role: "admin" };

      supabase.auth.signUp.mockResolvedValue({
        data: { user: { id: "123" } },
        error: null,
      });

      await signUp(email, password, metadata);

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email,
        password,
        options: {
          data: {
            firstName: metadata.firstName,
            lastName: metadata.lastName,
            role: metadata.role,
          },
          emailRedirectTo: expect.any(String),
        },
      });
    });

    it("should return error when signup fails", async () => {
      const email = "test@example.com";
      const password = "password123";
      const error = new Error("Signup failed");

      supabase.auth.signUp.mockResolvedValue({ data: null, error });

      const result = await signUp(email, password);

      expect(result.error).toBe(error);
    });
  });

  describe("signIn", () => {
    it("should call supabase.auth.signInWithPassword with correct parameters", async () => {
      const email = "test@example.com";
      const password = "password123";

      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { session: {} },
        error: null,
      });

      await signIn(email, password);

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email,
        password,
      });
    });

    it("should throw error when signin fails", async () => {
      const email = "test@example.com";
      const password = "password123";
      const error = new Error("Invalid credentials");

      supabase.auth.signInWithPassword.mockResolvedValue({ data: null, error });

      await expect(signIn(email, password)).rejects.toThrow(error);
    });
  });

  describe("resetPassword", () => {
    it("should call supabase.auth.resetPasswordForEmail with correct parameters", async () => {
      const email = "test@example.com";

      supabase.auth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: null,
      });

      await resetPassword(email);

      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(email, {
        redirectTo: expect.any(String),
      });
    });

    it("should throw error when reset password fails", async () => {
      const email = "test@example.com";
      const error = new Error("Reset password failed");

      supabase.auth.resetPasswordForEmail.mockResolvedValue({
        data: null,
        error,
      });

      await expect(resetPassword(email)).rejects.toThrow(error);
    });
  });
});
