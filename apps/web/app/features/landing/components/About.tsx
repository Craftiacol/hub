import { Separator } from "@/components/ui/separator";

export function About() {
  return (
    <section id="about" className="relative px-4 py-24 sm:px-6">
      {/* Subtle background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(var(--primary) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          About <span className="gradient-text">Craftia</span>
        </h2>

        <div className="mt-8 space-y-6 text-muted-foreground">
          <p>
            We believe in quality over speed. Every line of code is intentional,
            every architecture decision is deliberate. We build on solid
            foundations because shortcuts today become tech debt tomorrow.
          </p>
          <p>
            AI is a powerful tool — but it is directed by humans. We use
            cutting-edge AI to amplify our work, not replace thoughtful
            engineering. The human always leads.
          </p>
        </div>

        <Separator className="mx-auto mt-12 max-w-xs" />

        <p className="mt-8 text-sm text-muted-foreground">
          Founded by{" "}
          <span className="font-medium text-foreground">
            Alvaro Sepulveda
          </span>{" "}
          — Software Architect &amp; AI Developer
        </p>
      </div>
    </section>
  );
}
