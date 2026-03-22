"use client";

import { useState } from "react";

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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="company">Company</label>
        <input
          id="company"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="lead">lead</option>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
          <option value="churned">churned</option>
        </select>
      </div>

      {error && <p>{error}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Client"}
      </button>
    </form>
  );
}
