"use client";

import { useState, type FormEvent } from "react";

interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => void;
  error?: string;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, error, isLoading }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit?.({ email, password });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border px-3 py-2"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border px-3 py-2"
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>

    </form>
  );
}
