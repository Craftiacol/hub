"use client";

import { useState } from "react";
import { Input } from "@craftia/ui/input";
import { Label } from "@craftia/ui/label";
import { Select } from "@craftia/ui/select";
import { Button } from "@craftia/ui/button";

interface ClientFormProps {
  client?: {
    id: string;
    name: string;
    email: string | null;
    company: string | null;
    phone: string | null;
    status: "lead" | "active" | "inactive" | "churned";
  };
  onSubmit: (data: {
    name: string;
    email: string;
    company: string;
    phone: string;
    status: string;
  }) => void;
  isLoading?: boolean;
}

export function ClientForm({ client, onSubmit, isLoading }: ClientFormProps) {
  const [name, setName] = useState(client?.name ?? "");
  const [email, setEmail] = useState(client?.email ?? "");
  const [company, setCompany] = useState(client?.company ?? "");
  const [phone, setPhone] = useState(client?.phone ?? "");
  const [status, setStatus] = useState(client?.status ?? "lead");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    onSubmit({ name, email, company, phone, status });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as "lead" | "active" | "inactive" | "churned")}
        >
          <option value="lead">lead</option>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
          <option value="churned">churned</option>
        </Select>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Client"}
      </Button>
    </form>
  );
}
