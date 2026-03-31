"use client";

import { useState } from "react";
import { Button } from "@craftia/ui/button";
import { Badge } from "@craftia/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@craftia/ui/table";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface Client {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  status: "lead" | "active" | "inactive" | "churned";
  phone: string | null;
  website: string | null;
  notes: string | null;
  tags: string[] | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface ClientListProps {
  clients: Client[];
  onDelete?: (id: string) => void;
}

export function ClientList({ clients, onDelete }: ClientListProps) {
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);

  function handleDeleteClick(client: Client) {
    setDeleteTarget(client);
  }

  function handleConfirm() {
    if (deleteTarget) {
      onDelete?.(deleteTarget.id);
      setDeleteTarget(null);
    }
  }

  function handleCancel() {
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-4">
      <a
        href="/clients/new"
        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
      >
        Add Client
      </a>

      {clients.length === 0 ? (
        <p className="text-sm text-muted-foreground">No clients yet</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id} className="transition-colors hover:bg-primary/5">
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      client.status === "active"
                        ? "bg-accent/15 text-accent"
                        : client.status === "lead"
                          ? "bg-primary/10 text-primary"
                          : client.status === "inactive"
                            ? "bg-muted text-muted-foreground"
                            : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {client.status}
                  </span>
                </TableCell>
                <TableCell className="flex gap-2">
                  <a
                    href={`/clients/${client.id}/edit`}
                    className="text-sm text-primary hover:underline"
                  >
                    Edit
                  </a>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(client)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete Client"
        message={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.name}? This action cannot be undone.`
            : ""
        }
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
