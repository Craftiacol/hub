const metrics = [
  { value: "10+", label: "Projects Delivered" },
  { value: "5+", label: "Technologies" },
  { value: "100%", label: "Client Satisfaction" },
  { value: "24h", label: "Response Time" },
];

export function Metrics() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {metrics.map((metric, i) => (
            <div
              key={metric.label}
              className="rounded-xl border border-primary/20 bg-card p-6 text-center transition-colors duration-300 hover:border-primary/40"
              style={{
                animation: `fade-in-up 0.6s ease-out ${i * 0.1}s both`,
              }}
            >
              <p className="gradient-text text-4xl font-bold sm:text-5xl">
                {metric.value}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
