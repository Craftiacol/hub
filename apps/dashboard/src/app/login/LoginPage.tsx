"use client";

import { useState } from "react";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { loginAction } from "@/features/auth/actions/login";

export function LoginPage() {
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: { email: string; password: string }) {
    setIsLoading(true);
    setError(undefined);
    const result = await loginAction(data);
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Craftia</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to your dashboard
          </p>
        </div>
        <LoginForm onSubmit={handleSubmit} error={error} isLoading={isLoading} />
      </div>
    </div>
  );
}
