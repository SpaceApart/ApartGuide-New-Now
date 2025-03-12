import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "../pages/auth/register";
import { signUp } from "../lib/auth";
import { useToast } from "../components/ui/use-toast";

// Mock dependencies
vi.mock("../lib/auth", () => ({
  signUp: vi.fn(),
  getCurrentUser: vi.fn().mockResolvedValue(null),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("../components/ui/use-toast", () => ({
  useToast: vi.fn().mockReturnValue({
    toast: vi.fn(),
  }),
}));

vi.mock("../components/auth/RegisterForm", () => ({
  default: ({ onSubmit }: { onSubmit: (values: any) => void }) => (
    <div data-testid="register-form">
      <button
        data-testid="submit-button"
        onClick={() =>
          onSubmit({
            email: "test@example.com",
            password: "password123",
            firstName: "Test",
            lastName: "User",
          })
        }
      >
        Submit
      </button>
    </div>
  ),
}));

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the register form", () => {
    render(<RegisterPage />);
    expect(screen.getByTestId("register-form")).toBeInTheDocument();
  });

  it("should call signUp with correct values when form is submitted", async () => {
    const mockSignUp = signUp as vi.Mock;
    mockSignUp.mockResolvedValue({ data: {}, error: null });

    const mockToast = vi.fn();
    (useToast as vi.Mock).mockReturnValue({ toast: mockToast });

    render(<RegisterPage />);

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
        {
          firstName: "Test",
          lastName: "User",
          role: "admin",
        },
      );
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: "Konto utworzone pomyślnie",
      description: "Sprawdź swoją skrzynkę email, aby potwierdzić rejestrację.",
      variant: "default",
    });
  });

  it("should show error toast when registration fails", async () => {
    const mockError = new Error("Registration failed");
    const mockSignUp = signUp as vi.Mock;
    mockSignUp.mockResolvedValue({ data: null, error: mockError });

    const mockToast = vi.fn();
    (useToast as vi.Mock).mockReturnValue({ toast: mockToast });

    render(<RegisterPage />);

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Błąd rejestracji",
        description: "Registration failed",
        variant: "destructive",
      });
    });
  });
});
