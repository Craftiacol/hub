import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ClientList } from "../components/ClientList";

const mockClients = [
  {
    id: "1",
    name: "Acme Corp",
    email: "acme@test.com",
    company: "Acme",
    status: "active" as const,
    phone: null,
    website: null,
    notes: null,
    tags: [],
    user_id: "u1",
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
  {
    id: "2",
    name: "Beta Inc",
    email: "beta@test.com",
    company: "Beta",
    status: "lead" as const,
    phone: null,
    website: null,
    notes: null,
    tags: [],
    user_id: "u1",
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
  {
    id: "3",
    name: "Gamma LLC",
    email: "gamma@test.com",
    company: "Gamma",
    status: "inactive" as const,
    phone: null,
    website: null,
    notes: null,
    tags: [],
    user_id: "u1",
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
];

describe("ClientList", () => {
  it("should render all clients", () => {
    render(<ClientList clients={mockClients} />);
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("Beta Inc")).toBeInTheDocument();
    expect(screen.getByText("Gamma LLC")).toBeInTheDocument();
  });

  it("should display client email", () => {
    render(<ClientList clients={mockClients} />);
    expect(screen.getByText("acme@test.com")).toBeInTheDocument();
  });

  it("should display client status", () => {
    render(<ClientList clients={mockClients} />);
    expect(screen.getByText("active")).toBeInTheDocument();
    expect(screen.getByText("lead")).toBeInTheDocument();
  });

  it("should show empty state when no clients", () => {
    render(<ClientList clients={[]} />);
    expect(screen.getByText(/no clients/i)).toBeInTheDocument();
  });

  it("should render add client button", () => {
    render(<ClientList clients={[]} />);
    expect(
      screen.getByRole("link", { name: /add client/i })
    ).toBeInTheDocument();
  });

  it("should render edit links for each client", () => {
    render(<ClientList clients={mockClients} />);
    const editLinks = screen.getAllByRole("link", { name: /edit/i });
    expect(editLinks).toHaveLength(3);
  });

  describe("delete confirmation", () => {
    it("should show confirmation dialog when delete button is clicked", () => {
      const onDelete = vi.fn();
      render(<ClientList clients={mockClients} onDelete={onDelete} />);
      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      fireEvent.click(deleteButtons[0]!);
      expect(
        screen.getByText(/are you sure you want to delete Acme Corp/i)
      ).toBeInTheDocument();
      expect(onDelete).not.toHaveBeenCalled();
    });

    it("should call onDelete when confirming the dialog", () => {
      const onDelete = vi.fn();
      render(<ClientList clients={mockClients} onDelete={onDelete} />);
      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      fireEvent.click(deleteButtons[0]!);
      // The confirm button is inside the dialog overlay
      const dialog = screen.getByTestId("confirm-dialog-overlay");
      const confirmButton = dialog.querySelector("button:last-child") as HTMLElement;
      fireEvent.click(confirmButton);
      expect(onDelete).toHaveBeenCalledWith("1");
    });

    it("should not call onDelete when canceling the dialog", () => {
      const onDelete = vi.fn();
      render(<ClientList clients={mockClients} onDelete={onDelete} />);
      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      fireEvent.click(deleteButtons[0]!);
      fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
      expect(onDelete).not.toHaveBeenCalled();
    });
  });
});
