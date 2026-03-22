import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ClientForm } from "../components/ClientForm";

describe("ClientForm", () => {
  it("should render name field", () => {
    render(<ClientForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it("should render email field", () => {
    render(<ClientForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("should render company field", () => {
    render(<ClientForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
  });

  it("should render phone field", () => {
    render(<ClientForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
  });

  it("should render status select", () => {
    render(<ClientForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
  });

  it("should render submit button", () => {
    render(<ClientForm onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("should validate name is required", async () => {
    render(<ClientForm onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it("should call onSubmit with form data when valid", async () => {
    const onSubmit = vi.fn();
    render(<ClientForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Acme Corp" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "contact@acme.com" },
    });
    fireEvent.change(screen.getByLabelText(/company/i), {
      target: { value: "Acme" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Acme Corp",
          email: "contact@acme.com",
          company: "Acme",
        })
      );
    });
  });

  it("should pre-fill form when editing existing client", () => {
    const client = {
      id: "1",
      name: "Existing Client",
      email: "existing@test.com",
      company: "Existing Co",
      phone: "123456",
      status: "active" as const,
    };
    render(<ClientForm client={client} onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/name/i)).toHaveValue("Existing Client");
    expect(screen.getByLabelText(/email/i)).toHaveValue("existing@test.com");
    expect(screen.getByLabelText(/company/i)).toHaveValue("Existing Co");
  });

  it("should show saving state", () => {
    render(<ClientForm onSubmit={vi.fn()} isLoading />);
    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
  });
});
