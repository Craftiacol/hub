import { Github, Linkedin, Twitter, ArrowUpRight, Terminal } from "lucide-react";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Tech Stack", href: "#tech-stack" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/craftiacol",
    icon: <Github className="size-4" />,
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: <Linkedin className="size-4" />,
  },
  {
    label: "Twitter",
    href: "#",
    icon: <Twitter className="size-4" />,
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden px-4 pb-6 pt-20 sm:px-6">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Gradient fade from top */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
      {/* Glow accent */}
      <div className="pointer-events-none absolute -bottom-32 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Top section */}
        <div className="mb-12 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          {/* Brand block */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                <Terminal className="size-4 text-primary" />
              </div>
              <span className="gradient-text text-xl font-bold tracking-tight">
                Craftia
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              We build digital products that solve real problems. No templates,
              no shortcuts — just solid architecture and clean code shipped with
              intention.
            </p>
          </div>

          {/* CTA mini */}
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-lg border border-primary/30 px-4 py-2 text-sm font-medium text-primary transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:shadow-md hover:shadow-primary/10"
          >
            Start a project
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Bottom section */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Nav links — horizontal */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors duration-200 hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="flex size-8 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:text-primary hover:shadow-sm"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-[11px] text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Craftia. All rights reserved.
          </p>
          <p className="text-[11px] text-muted-foreground/40">
            Built with precision in{" "}
            <span className="text-muted-foreground/60">Mexico</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
