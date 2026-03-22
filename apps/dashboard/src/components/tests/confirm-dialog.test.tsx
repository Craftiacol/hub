import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmDialog } from "../ConfirmDialog";

describe("ConfirmDialog", () => {
  const defaultProps = {
    isOpen: true,
    title: "Confirm Delete",
    message: "Are you sure you want to delete this item?",
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  it("should render nothing when isOpen is false", () => {
    const { container } = render(
      <ConfirmDialog {...defaultProps} isOpen={false} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("should render title and message when open", () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText("Confirm Delete")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this item?")
    ).toBeInTheDocument();
  });

  it("should call onConfirm when confirm button is clicked", () => {
    const onConfirm = vi.fn();
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("should call onCancel when cancel button is clicked", () => {
    const onCancel = vi.fn();
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("should call onCancel on Escape key", () => {
    const onCancel = vi.fn();
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("should use custom confirmLabel when provided", () => {
    render(<ConfirmDialog {...defaultProps} confirmLabel="Remove" />);
    expect(
      screen.getByRole("button", { name: "Remove" })
    ).toBeInTheDocument();
  });

  it("should call onCancel when clicking the overlay backdrop", () => {
    const onCancel = vi.fn();
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);
    const overlay = screen.getByTestId("confirm-dialog-overlay");
    fireEvent.click(overlay);
    expect(onCancel).toHaveBeenCalledOnce();
  });
});
