import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Pagination } from "../Pagination";

describe("Pagination", () => {
  it("renders current page info", () => {
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={vi.fn()} />
    );

    expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
  });

  it("renders page number buttons", () => {
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />
    );

    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
  });

  it("disables Previous button on page 1", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />
    );

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
  });

  it("disables Next button on last page", () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />
    );

    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("enables Previous button when not on page 1", () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />
    );

    expect(
      screen.getByRole("button", { name: "Previous" })
    ).not.toBeDisabled();
  });

  it("enables Next button when not on last page", () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />
    );

    expect(screen.getByRole("button", { name: "Next" })).not.toBeDisabled();
  });

  it("calls onPageChange with previous page when Previous is clicked", () => {
    const onPageChange = vi.fn();

    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Previous" }));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with next page when Next is clicked", () => {
    const onPageChange = vi.fn();

    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("calls onPageChange with page number when a page button is clicked", () => {
    const onPageChange = vi.fn();

    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
    );

    fireEvent.click(screen.getByRole("button", { name: "3" }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("does not render when totalPages is 0", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={vi.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("does not render when totalPages is 1", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });
});
