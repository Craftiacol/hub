import { Separator } from "@/components/ui/separator";

const quickLinks = [
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="px-4 pb-8 pt-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Separator className="mb-8" />
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <p className="text-sm font-semibold">Craftia</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Software &amp; AI Solutions
            </p>
          </div>

          <ul className="flex gap-6">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Craftia. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
