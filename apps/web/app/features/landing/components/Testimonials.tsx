const testimonials = [
  {
    quote:
      "Craftia delivered beyond expectations. Their attention to architecture and code quality is rare to find.",
    name: "Alex M.",
    role: "CTO, TechStart Inc.",
  },
  {
    quote:
      "From idea to production in weeks, not months. The AI integration they built transformed our workflow.",
    name: "Sarah K.",
    role: "Product Manager, DataFlow",
  },
  {
    quote:
      "Professional, responsive, and genuinely passionate about building the right solution. Highly recommended.",
    name: "Carlos R.",
    role: "Founder, NovaSoft",
  },
];

export function Testimonials() {
  return (
    <section className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-muted-foreground">
            Placeholder testimonials — real feedback coming soon.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="rounded-xl border-l-4 border-l-primary bg-secondary p-6"
              style={{
                animation: `fade-in-up 0.6s ease-out ${i * 0.15}s both`,
              }}
            >
              <p className="text-sm italic leading-relaxed text-foreground/80">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {t.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
