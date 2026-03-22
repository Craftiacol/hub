import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoginPage } from "@/app/login/LoginPage";

vi.mock("@/features/auth/actions/login", () => ({
  loginAction: vi.fn(),
}));

describe("LoginPage", () => {
  it("should render Craftia branding", () => {
    render(<LoginPage />);
    expect(screen.getByText("Craftia")).toBeInTheDocument();
  });

  it("should render sign in subtitle", () => {
    render(<LoginPage />);
    expect(screen.getByText(/sign in to your dashboard/i)).toBeInTheDocument();
  });

  it("should render the login form", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("should render the sign in button", () => {
    render(<LoginPage />);
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });
});
