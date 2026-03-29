export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-24 text-center sm:px-6">
      {/* Animated grid background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            animation: "grid-move 8s linear infinite",
          }}
        />
        {/* Glowing dots at intersections */}
        {[
          { top: "15%", left: "20%" },
          { top: "30%", left: "70%" },
          { top: "60%", left: "15%" },
          { top: "75%", left: "80%" },
          { top: "45%", left: "50%" },
          { top: "85%", left: "35%" },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute size-2 rounded-full bg-primary"
            style={{
              top: pos.top,
              left: pos.left,
              animation: `pulse-glow 3s ease-in-out ${i * 0.5}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Floating geometric shapes */}
      <div
        className="pointer-events-none absolute left-[10%] top-[20%] size-16 rotate-45 rounded-lg border border-primary/20 sm:size-24"
        style={{ animation: "float 6s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none absolute right-[15%] top-[30%] size-12 rounded-full border border-accent/20 sm:size-20"
        style={{ animation: "float 8s ease-in-out 1s infinite" }}
      />
      <div
        className="pointer-events-none absolute bottom-[25%] left-[20%] size-10 rotate-12 border border-primary/15 sm:size-16"
        style={{
          animation: "float 7s ease-in-out 2s infinite",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-[20%] right-[10%] size-14 rotate-[30deg] rounded-lg border border-accent/15 sm:size-20"
        style={{ animation: "float 9s ease-in-out 0.5s infinite" }}
      />

      {/* Main content */}
      <div
        className="relative z-10 mx-auto max-w-4xl"
        style={{ animation: "fade-in-up 0.8s ease-out both" }}
      >
        <p className="mb-6 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Software Consultancy & AI Solutions
        </p>
        <h1 className="text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          We Build
          <br />
          <span className="gradient-text">Digital Products</span>
        </h1>
        <p
          className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl"
          style={{ animation: "fade-in-up 0.8s ease-out 0.2s both" }}
        >
          SaaS products and AI-powered solutions crafted with precision. From
          concept to production, we turn ideas into reality.
        </p>
        <div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          style={{ animation: "fade-in-up 0.8s ease-out 0.4s both" }}
        >
          <a
            href="#contact"
            className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground shadow-lg transition-shadow duration-300 hover:bg-accent/90 hover:shadow-accent/25 hover:shadow-xl sm:w-auto"
          >
            Start a Project
          </a>
          <a
            href="#portfolio"
            className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-primary/40 px-4 text-sm font-medium transition-colors duration-300 hover:border-primary hover:text-primary sm:w-auto"
          >
            See Our Work
          </a>
        </div>
      </div>

      {/* Reduced motion */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </section>
  );
}
