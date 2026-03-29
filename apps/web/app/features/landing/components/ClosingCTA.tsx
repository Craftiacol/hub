export function ClosingCTA() {
  return (
    <section className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 px-6 py-20 text-center sm:px-12">
        <h2
          className="text-3xl font-bold tracking-tight sm:text-4xl"
          style={{ animation: "fade-in-up 0.6s ease-out both" }}
        >
          Ready to Build Something{" "}
          <span className="gradient-text">Great</span>?
        </h2>
        <p
          className="mx-auto mt-4 max-w-lg text-muted-foreground"
          style={{ animation: "fade-in-up 0.6s ease-out 0.1s both" }}
        >
          Let&apos;s talk about your next project. Whether it&apos;s a SaaS
          product, an AI integration, or a custom web application — we&apos;re
          ready.
        </p>
        <div style={{ animation: "fade-in-up 0.6s ease-out 0.2s both" }}>
          <a
            href="#contact"
            className="mt-8 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-accent px-8 text-sm font-medium text-accent-foreground shadow-lg transition-shadow duration-300 hover:bg-accent/90 hover:shadow-accent/25 hover:shadow-xl"
          >
            Let&apos;s Talk
          </a>
        </div>
      </div>
    </section>
  );
}
