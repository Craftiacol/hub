"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@craftia/ui/button";
import { logoutAction } from "@/features/auth/actions/logout";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/clients", label: "Clients" },
  { href: "/deals", label: "Pipeline" },
  { href: "/invoices", label: "Invoices" },
];

export function DashboardLayout({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 border-r border-border bg-card p-6">
        <h1 className="text-xl font-bold text-primary">Craftia</h1>
        <p className="mt-1 text-sm text-muted-foreground">{userName}</p>
        <nav className="mt-8 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction} className="mt-auto pt-8">
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
          >
            Sign out
          </Button>
        </form>
      </aside>
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 px-8 py-4 backdrop-blur-md" />
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
