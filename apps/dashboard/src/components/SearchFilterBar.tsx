"use client";

import { useRef, useCallback, useState } from "react";
import { Input } from "@craftia/ui/input";
import { Label } from "@craftia/ui/label";
import { Select } from "@craftia/ui/select";
import { Button } from "@craftia/ui/button";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  name: string;
  label: string;
  options: FilterOption[];
}

interface SearchFilterBarProps {
  searchPlaceholder: string;
  filters: FilterConfig[];
  onSearchChange: (value: string) => void;
  onFilterChange: (name: string, value: string) => void;
  currentSearch: string;
  currentFilters: Record<string, string>;
}

export function SearchFilterBar({
  searchPlaceholder,
  filters,
  onSearchChange,
  onFilterChange,
  currentSearch,
  currentFilters,
}: SearchFilterBarProps) {
  const [localSearch, setLocalSearch] = useState(currentSearch);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalSearch(value);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        onSearchChange(value);
      }, 300);
    },
    [onSearchChange]
  );

  const hasActiveFilters =
    currentSearch !== "" ||
    Object.values(currentFilters).some((v) => v !== "" && v !== undefined);

  function handleClearAll() {
    setLocalSearch("");
    onSearchChange("");
    for (const filter of filters) {
      onFilterChange(filter.name, "");
    }
  }

  return (
    <div className="flex flex-wrap items-end gap-4">
      <Input
        type="text"
        placeholder={searchPlaceholder}
        value={localSearch}
        onChange={handleSearchChange}
        className="max-w-xs focus-visible:ring-primary"
      />

      {filters.map((filter) => (
        <div key={filter.name} className="space-y-1">
          <Label htmlFor={`filter-${filter.name}`}>{filter.label}</Label>
          <Select
            id={`filter-${filter.name}`}
            value={currentFilters[filter.name] ?? ""}
            onChange={(e) => onFilterChange(filter.name, e.target.value)}
          >
            <option value="">All</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      ))}

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" type="button" onClick={handleClearAll} className="text-primary hover:text-primary hover:bg-primary/5">
          Clear all
        </Button>
      )}
    </div>
  );
}
