import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DealCard } from "../components/DealCard";

const mockDeal = {
  id: "deal-1",
  title: "Website Redesign",
  value: 5000,
  stage: "proposal" as const,
  expected_close_date: "2026-06-15",
  notes: "Important deal",
  client_id: "client-1",
  clients: { name: "Acme Corp" },
  user_id: "user-1",
  created_at: "2026-01-01",
  updated_at: "2026-01-01",
};

describe("DealCard", () => {
  it("should render deal title", () => {
    render(<DealCard deal={mockDeal} onDelete={vi.fn()} />);
    expect(screen.getByText("Website Redesign")).toBeInTheDocument();
  });

  it("should render formatted currency value", () => {
    render(<DealCard deal={mockDeal} onDelete={vi.fn()} />);
    expect(screen.getByText(/5,000/)).toBeInTheDocument();
  });

  it("should render client name", () => {
    render(<DealCard deal={mockDeal} onDelete={vi.fn()} />);
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
  });

  it("should render expected close date", () => {
    render(<DealCard deal={mockDeal} onDelete={vi.fn()} />);
    expect(screen.getByText(/2026-06-15/)).toBeInTheDocument();
  });

  it("should render edit link", () => {
    render(<DealCard deal={mockDeal} onDelete={vi.fn()} />);
    expect(screen.getByRole("link", { name: /edit/i })).toHaveAttribute(
      "href",
      "/deals/deal-1/edit"
    );
  });

  it("should call onDelete when delete button is clicked", () => {
    const onDelete = vi.fn();
    render(<DealCard deal={mockDeal} onDelete={onDelete} />);
    screen.getByRole("button", { name: /delete/i }).click();
    expect(onDelete).toHaveBeenCalledWith("deal-1");
  });

  it("should handle null value gracefully", () => {
    const dealWithoutValue = { ...mockDeal, value: null };
    render(<DealCard deal={dealWithoutValue} onDelete={vi.fn()} />);
    expect(screen.getByText("Website Redesign")).toBeInTheDocument();
  });

  it("should handle null client gracefully", () => {
    const dealWithoutClient = { ...mockDeal, clients: null };
    render(<DealCard deal={dealWithoutClient} onDelete={vi.fn()} />);
    expect(screen.getByText("Website Redesign")).toBeInTheDocument();
  });

  it("should be draggable", () => {
    render(<DealCard deal={mockDeal} onDelete={vi.fn()} />);
    const card = screen.getByText("Website Redesign").closest("[draggable]");
    expect(card).toHaveAttribute("draggable", "true");
  });
});
