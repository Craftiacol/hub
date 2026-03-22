"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClientForm } from "@/features/crm/components/ClientForm";
import { createClientAction } from "@/features/crm/actions/client-actions";

export function NewClientPage() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: Record<string, string>) {
    setIsLoading(true);
    setError(undefined);
    const result = await createClientAction(data);
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push("/clients");
    }
  }

  return (
    <>
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      <ClientForm onSubmit={handleSubmit} isLoading={isLoading} />
    </>
  );
}
