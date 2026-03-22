"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DealForm } from "@/features/pipeline/components/DealForm";
import { updateDealAction } from "@/features/pipeline/actions/deal-actions";

interface EditDealPageProps {
  deal: {
    id: string;
    title: string;
    value: number | null;
    stage: string;
    expected_close_date: string | null;
    notes: string | null;
    client_id: string | null;
  };
  clients: { id: string; name: string }[];
}

export function EditDealPage({ deal, clients }: EditDealPageProps) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: Record<string, string>) {
    setIsLoading(true);
    setError(undefined);
    const result = await updateDealAction(deal.id, data);
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
      <DealForm
        deal={deal}
        clients={clients}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </>
  );
}
