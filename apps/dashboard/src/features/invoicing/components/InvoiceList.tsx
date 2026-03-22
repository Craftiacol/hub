interface Invoice {
  id: string;
  invoice_number: string;
  status: "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled";
  total: number;
  currency: string | null;
  due_date: string;
  client_id: string | null;
  project_id: string | null;
  user_id: string;
  issue_date: string;
  subtotal: number;
  tax_rate: number | null;
  tax_amount: number | null;
  notes: string | null;
  payment_link: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

interface InvoiceListProps {
  invoices: Invoice[];
  onDelete?: (id: string) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function InvoiceList({ invoices, onDelete }: InvoiceListProps) {
  return (
    <div>
      <a href="/invoicing/new">Create Invoice</a>

      {invoices.length === 0 ? (
        <p>No invoices yet</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Status</th>
              <th>Total</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.invoice_number}</td>
                <td>{invoice.status}</td>
                <td>{formatCurrency(invoice.total)}</td>
                <td>{invoice.due_date}</td>
                <td>
                  <a href={`/invoicing/${invoice.id}/edit`}>Edit</a>
                  <button onClick={() => onDelete?.(invoice.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
