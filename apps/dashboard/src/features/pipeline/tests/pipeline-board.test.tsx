import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PipelineBoard } from "../components/PipelineBoard";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}));

// Mock the deal actions module
vi.mock("../actions/deal-actions", () => ({
  updateDealStageAction: vi.fn(),
  deleteDealAction: vi.fn(),
}));

const mockDeals = [
  {
    id: "1",
    title: "Deal Alpha",
    value: 5000,
    stage: "lead" as const,
    expected_close_date: "2026-06-01",
    notes: null,
    client_id: "c1",
    clients: { name: "Acme Corp" },
    user_id: "u1",
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
  {
    id: "2",
    title: "Deal Beta",
    value: 10000,
    stage: "proposal" as const,
    expected_close_date: "2026-07-01",
    notes: null,
    client_id: "c2",
    clients: { name: "Beta Inc" },
    user_id: "u1",
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
  {
    id: "3",
    title: "Deal Gamma",
    value: 20000,
    stage: "won" as const,
    expected_close_date: null,
    notes: null,
    client_id: "c3",
    clients: { name: "Gamma LLC" },
    user_id: "u1",
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
  {
    id: "4",
    title: "Deal Delta",
    value: 3000,
    stage: "lead" as const,
    expected_close_date: null,
    notes: null,
    client_id: null,
    clients: null,
    user_id: "u1",
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
];

describe("PipelineBoard", () => {
  it("should render all six stage columns", () => {
    render(<PipelineBoard deals={mockDeals} />);
    expect(screen.getByText(/lead/i)).toBeInTheDocument();
    expect(screen.getByText(/contacted/i)).toBeInTheDocument();
    expect(screen.getByText(/proposal/i)).toBeInTheDocument();
    expect(screen.getByText(/negotiation/i)).toBeInTheDocument();
    expect(screen.getByText(/won/i)).toBeInTheDocument();
    expect(screen.getByText(/lost/i)).toBeInTheDocument();
  });

  it("should render deals in correct columns", () => {
    render(<PipelineBoard deals={mockDeals} />);
    expect(screen.getByText("Deal Alpha")).toBeInTheDocument();
    expect(screen.getByText("Deal Beta")).toBeInTheDocument();
    expect(screen.getByText("Deal Gamma")).toBeInTheDocument();
    expect(screen.getByText("Deal Delta")).toBeInTheDocument();
  });

  it("should show deal count per column", () => {
    render(<PipelineBoard deals={mockDeals} />);
    // Lead has 2 deals (Alpha + Delta)
    expect(screen.getByTestId("column-count-lead")).toHaveTextContent("2");
    // Proposal has 1 deal (Beta)
    expect(screen.getByTestId("column-count-proposal")).toHaveTextContent("1");
    // Won has 1 deal (Gamma)
    expect(screen.getByTestId("column-count-won")).toHaveTextContent("1");
    // Contacted, Negotiation, Lost have 0
    expect(screen.getByTestId("column-count-contacted")).toHaveTextContent("0");
    expect(screen.getByTestId("column-count-negotiation")).toHaveTextContent("0");
    expect(screen.getByTestId("column-count-lost")).toHaveTextContent("0");
  });

  it("should render empty board with no deals", () => {
    render(<PipelineBoard deals={[]} />);
    expect(screen.getByText(/lead/i)).toBeInTheDocument();
    expect(screen.getByTestId("column-count-lead")).toHaveTextContent("0");
  });

  it("should render add deal link", () => {
    render(<PipelineBoard deals={[]} />);
    expect(
      screen.getByRole("link", { name: /add deal/i })
    ).toBeInTheDocument();
  });
});
