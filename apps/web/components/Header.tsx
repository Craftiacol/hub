const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/60 backdrop-blur-xl backdrop-saturate-150">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="/" className="text-lg font-bold tracking-tight">
          <span className="gradient-text">Craftia</span>
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="inline-flex h-7 items-center gap-1 rounded-[min(var(--radius-md),12px)] bg-accent px-2.5 text-[0.8rem] font-medium text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Get in Touch
        </a>
      </nav>
    </header>
  );
}
