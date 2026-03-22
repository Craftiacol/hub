"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DealForm } from "@/features/pipeline/components/DealForm";
import { createDealAction } from "@/features/pipeline/actions/deal-actions";

interface NewDealPageProps {
  clients: { id: string; name: string }[];
}

export function NewDealPage({ clients }: NewDealPageProps) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: Record<string, string>) {
    setIsLoading(true);
    setError(undefined);
    const result = await createDealAction(data);
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push("/deals");
    }
  }

  return (
    <>
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      <DealForm clients={clients} onSubmit={handleSubmit} isLoading={isLoading} />
    </>
  );
}
