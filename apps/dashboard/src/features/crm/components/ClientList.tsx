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
  return (
    <div>
      <a href="/crm/clients/new">Add Client</a>

      {clients.length === 0 ? (
        <p>No clients yet</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.status}</td>
                <td>
                  <a href={`/crm/clients/${client.id}/edit`}>Edit</a>
                  <button onClick={() => onDelete?.(client.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
