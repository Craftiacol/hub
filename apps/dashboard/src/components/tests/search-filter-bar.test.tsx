import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SearchFilterBar } from "../SearchFilterBar";

describe("SearchFilterBar", () => {
  const defaultFilters = [
    {
      name: "status",
      label: "Status",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ];

  it("renders search input with placeholder", () => {
    render(
      <SearchFilterBar
        searchPlaceholder="Search clients..."
        filters={defaultFilters}
        onSearchChange={vi.fn()}
        onFilterChange={vi.fn()}
        currentSearch=""
        currentFilters={{}}
      />
    );

    expect(
      screen.getByPlaceholderText("Search clients...")
    ).toBeInTheDocument();
  });

  it("renders filter dropdowns", () => {
    render(
      <SearchFilterBar
        searchPlaceholder="Search..."
        filters={defaultFilters}
        onSearchChange={vi.fn()}
        onFilterChange={vi.fn()}
        currentSearch=""
        currentFilters={{}}
      />
    );

    expect(screen.getByLabelText("Status")).toBeInTheDocument();
  });

  it("calls onSearchChange when user types in search input", () => {
    const onSearchChange = vi.fn();

    render(
      <SearchFilterBar
        searchPlaceholder="Search..."
        filters={defaultFilters}
        onSearchChange={onSearchChange}
        onFilterChange={vi.fn()}
        currentSearch=""
        currentFilters={{}}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "test" },
    });

    // Debounced — should NOT fire immediately
    expect(onSearchChange).not.toHaveBeenCalled();
  });

  it("calls onSearchChange after debounce delay", async () => {
    vi.useFakeTimers();
    const onSearchChange = vi.fn();

    render(
      <SearchFilterBar
        searchPlaceholder="Search..."
        filters={defaultFilters}
        onSearchChange={onSearchChange}
        onFilterChange={vi.fn()}
        currentSearch=""
        currentFilters={{}}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "test" },
    });

    vi.advanceTimersByTime(300);

    expect(onSearchChange).toHaveBeenCalledWith("test");

    vi.useRealTimers();
  });

  it("calls onFilterChange when dropdown changes", () => {
    const onFilterChange = vi.fn();

    render(
      <SearchFilterBar
        searchPlaceholder="Search..."
        filters={defaultFilters}
        onSearchChange={vi.fn()}
        onFilterChange={onFilterChange}
        currentSearch=""
        currentFilters={{}}
      />
    );

    fireEvent.change(screen.getByLabelText("Status"), {
      target: { value: "active" },
    });

    expect(onFilterChange).toHaveBeenCalledWith("status", "active");
  });

  it("shows clear all button when filters are active", () => {
    render(
      <SearchFilterBar
        searchPlaceholder="Search..."
        filters={defaultFilters}
        onSearchChange={vi.fn()}
        onFilterChange={vi.fn()}
        currentSearch="test"
        currentFilters={{ status: "active" }}
      />
    );

    expect(screen.getByText("Clear all")).toBeInTheDocument();
  });

  it("does not show clear all button when no filters are active", () => {
    render(
      <SearchFilterBar
        searchPlaceholder="Search..."
        filters={defaultFilters}
        onSearchChange={vi.fn()}
        onFilterChange={vi.fn()}
        currentSearch=""
        currentFilters={{}}
      />
    );

    expect(screen.queryByText("Clear all")).not.toBeInTheDocument();
  });

  it("calls onSearchChange and onFilterChange to reset when clear all is clicked", () => {
    const onSearchChange = vi.fn();
    const onFilterChange = vi.fn();

    render(
      <SearchFilterBar
        searchPlaceholder="Search..."
        filters={defaultFilters}
        onSearchChange={onSearchChange}
        onFilterChange={onFilterChange}
        currentSearch="test"
        currentFilters={{ status: "active" }}
      />
    );

    fireEvent.click(screen.getByText("Clear all"));

    expect(onSearchChange).toHaveBeenCalledWith("");
    expect(onFilterChange).toHaveBeenCalledWith("status", "");
  });
});
