import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "../components/LoginForm";

describe("LoginForm", () => {
  it("should render email and password fields", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("should render a submit button", () => {
    render(<LoginForm />);
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("should not render a registration link (private dashboard)", () => {
    render(<LoginForm />);
    expect(
      screen.queryByRole("link", { name: /create account/i })
    ).not.toBeInTheDocument();
  });

  it("should show validation error for empty email", async () => {
    render(<LoginForm />);
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it("should show validation error for invalid email", async () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "notanemail" } });
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it("should show validation error for short password", async () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "123" } });
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 6 characters/i)
      ).toBeInTheDocument();
    });
  });

  it("should call onSubmit with email and password when form is valid", async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "password123",
      });
    });
  });

  it("should show error message when login fails", async () => {
    render(<LoginForm error="Invalid credentials" />);
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it("should disable submit button while loading", () => {
    render(<LoginForm isLoading />);
    expect(
      screen.getByRole("button", { name: /signing in/i })
    ).toBeDisabled();
  });
});
