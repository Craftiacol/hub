import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DealForm } from "../components/DealForm";

const mockClients = [
  { id: "c1", name: "Acme Corp" },
  { id: "c2", name: "Beta Inc" },
];

describe("DealForm", () => {
  it("should render title field", () => {
    render(<DealForm clients={mockClients} onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  });

  it("should render value field", () => {
    render(<DealForm clients={mockClients} onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/value/i)).toBeInTheDocument();
  });

  it("should render stage select", () => {
    render(<DealForm clients={mockClients} onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/stage/i)).toBeInTheDocument();
  });

  it("should render expected close date field", () => {
    render(<DealForm clients={mockClients} onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/expected close date/i)).toBeInTheDocument();
  });

  it("should render notes field", () => {
    render(<DealForm clients={mockClients} onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it("should render client select with options", () => {
    render(<DealForm clients={mockClients} onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/client/i)).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("Beta Inc")).toBeInTheDocument();
  });

  it("should render submit button", () => {
    render(<DealForm clients={mockClients} onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("should validate title is required", async () => {
    render(<DealForm clients={mockClients} onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it("should call onSubmit with form data when valid", async () => {
    const onSubmit = vi.fn();
    render(<DealForm clients={mockClients} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "New Website" },
    });
    fireEvent.change(screen.getByLabelText(/value/i), {
      target: { value: "5000" },
    });
    fireEvent.change(screen.getByLabelText(/stage/i), {
      target: { value: "proposal" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "New Website",
          value: "5000",
          stage: "proposal",
        })
      );
    });
  });

  it("should pre-fill form when editing existing deal", () => {
    const deal = {
      id: "1",
      title: "Existing Deal",
      value: 10000,
      stage: "negotiation" as const,
      expected_close_date: "2026-07-01",
      notes: "Some notes",
      client_id: "c1",
    };
    render(
      <DealForm deal={deal} clients={mockClients} onSubmit={vi.fn()} />
    );
    expect(screen.getByLabelText(/title/i)).toHaveValue("Existing Deal");
    expect(screen.getByLabelText(/value/i)).toHaveValue(10000);
    expect(screen.getByLabelText(/stage/i)).toHaveValue("negotiation");
    expect(screen.getByLabelText(/expected close date/i)).toHaveValue(
      "2026-07-01"
    );
    expect(screen.getByLabelText(/notes/i)).toHaveValue("Some notes");
  });

  it("should show saving state", () => {
    render(
      <DealForm clients={mockClients} onSubmit={vi.fn()} isLoading />
    );
    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
  });
});
