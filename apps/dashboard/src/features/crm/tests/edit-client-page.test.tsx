import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EditClientPage } from "@/app/clients/[id]/edit/EditClientPage";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock the update action
const mockUpdateClientAction = vi.fn();
vi.mock("@/features/crm/actions/client-actions", () => ({
  updateClientAction: (...args: unknown[]) => mockUpdateClientAction(...args),
}));

const mockClient = {
  id: "client-1",
  name: "Acme Corp",
  email: "acme@test.com",
  company: "Acme",
  phone: "555-1234",
  status: "active" as const,
};

describe("EditClientPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the form pre-filled with client data", () => {
    render(<EditClientPage client={mockClient} />);
    expect(screen.getByLabelText(/name/i)).toHaveValue("Acme Corp");
    expect(screen.getByLabelText(/email/i)).toHaveValue("acme@test.com");
    expect(screen.getByLabelText(/company/i)).toHaveValue("Acme");
  });

  it("should call updateClientAction with client id and form data on submit", async () => {
    mockUpdateClientAction.mockResolvedValue({ success: true });
    render(<EditClientPage client={mockClient} />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Updated Corp" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockUpdateClientAction).toHaveBeenCalledWith(
        "client-1",
        expect.objectContaining({ name: "Updated Corp" })
      );
    });
  });

  it("should redirect to /clients on successful update", async () => {
    mockUpdateClientAction.mockResolvedValue({ success: true });
    render(<EditClientPage client={mockClient} />);

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/clients");
    });
  });

  it("should display error message on failed update", async () => {
    mockUpdateClientAction.mockResolvedValue({ error: "Update failed" });
    render(<EditClientPage client={mockClient} />);

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText("Update failed")).toBeInTheDocument();
    });
  });
});
