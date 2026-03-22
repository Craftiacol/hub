"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClientForm } from "@/features/crm/components/ClientForm";
import { updateClientAction } from "@/features/crm/actions/client-actions";

interface EditClientPageProps {
  client: {
    id: string;
    name: string;
    email: string | null;
    company: string | null;
    phone: string | null;
    status: "lead" | "active" | "inactive" | "churned";
  };
}

export function EditClientPage({ client }: EditClientPageProps) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: Record<string, string>) {
    setIsLoading(true);
    setError(undefined);
    const result = await updateClientAction(client.id, data);
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
      <ClientForm
        client={client}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </>
  );
}
