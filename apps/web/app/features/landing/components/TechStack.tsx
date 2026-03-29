import { Code, Server, Brain, Layers } from "lucide-react";

interface Tech {
  name: string;
  color: string;
}

interface Category {
  label: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  techs: Tech[];
}

const categories: Category[] = [
  {
    label: "Frontend",
    description: "Pixel-perfect interfaces with modern frameworks",
    icon: <Code className="size-5" />,
    gradient: "from-primary/20 to-accent/10",
    techs: [
      { name: "React", color: "text-[oklch(0.7_0.15_220)]" },
      { name: "Next.js", color: "text-foreground" },
      { name: "Angular", color: "text-[oklch(0.6_0.2_15)]" },
      { name: "TypeScript", color: "text-[oklch(0.6_0.15_240)]" },
      { name: "Tailwind CSS", color: "text-[oklch(0.7_0.15_200)]" },
    ],
  },
  {
    label: "Backend & Data",
    description: "Scalable APIs and real-time databases",
    icon: <Server className="size-5" />,
    gradient: "from-accent/20 to-primary/10",
    techs: [
      { name: "Node.js", color: "text-[oklch(0.65_0.2_145)]" },
      { name: "Go", color: "text-[oklch(0.7_0.15_200)]" },
      { name: "Supabase", color: "text-[oklch(0.7_0.18_165)]" },
      { name: "PostgreSQL", color: "text-[oklch(0.6_0.15_240)]" },
    ],
  },
  {
    label: "AI & Intelligence",
    description: "AI-first products powered by cutting-edge models",
    icon: <Brain className="size-5" />,
    gradient: "from-[oklch(0.7_0.15_280)]/20 to-primary/10",
    techs: [
      { name: "Claude AI", color: "text-[oklch(0.7_0.12_45)]" },
      { name: "OpenAI", color: "text-[oklch(0.7_0.15_165)]" },
      { name: "n8n", color: "text-[oklch(0.7_0.15_15)]" },
      { name: "LangChain", color: "text-[oklch(0.7_0.15_145)]" },
    ],
  },
  {
    label: "DevOps & Tools",
    description: "Ship fast with modern infrastructure",
    icon: <Layers className="size-5" />,
    gradient: "from-brand-amber/20 to-accent/10",
    techs: [
      { name: "Vercel", color: "text-foreground" },
      { name: "Docker", color: "text-[oklch(0.6_0.15_240)]" },
      { name: "Turborepo", color: "text-[oklch(0.6_0.18_340)]" },
      { name: "Playwright", color: "text-[oklch(0.65_0.18_145)]" },
      { name: "Vitest", color: "text-[oklch(0.7_0.2_100)]" },
    ],
  },
];

function TechPill({ name, color, index }: Tech & { index: number }) {
  return (
    <div
      className="group/pill relative"
      style={{ animation: `fade-in-up 0.4s ease-out ${index * 0.06}s both` }}
    >
      <div className="relative flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-2 text-sm font-medium transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5">
        {/* Colored dot */}
        <span className={`size-2.5 rounded-full bg-current ${color}`} />
        <span className="text-foreground/90">{name}</span>
      </div>
    </div>
  );
}

export function TechStack() {
  let globalIdx = 0;

  return (
    <section id="tech-stack" className="relative px-4 py-24 sm:px-6">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(var(--primary) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Technology
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built With the <span className="gradient-text">Best Tools</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            We pick the right technology for each project — no one-size-fits-all.
            Here is what we work with daily.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {categories.map((category, catIdx) => (
            <div
              key={category.label}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              style={{
                animation: `fade-in-up 0.6s ease-out ${catIdx * 0.12}s both`,
              }}
            >
              {/* Gradient header accent */}
              <div
                className={`h-1 w-full bg-gradient-to-r ${category.gradient}`}
              />

              <div className="p-6">
                {/* Category header */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/15">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">{category.label}</h3>
                    <p className="text-xs text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Tech pills */}
                <div className="flex flex-wrap gap-2">
                  {category.techs.map((tech) => {
                    const idx = globalIdx++;
                    return (
                      <TechPill
                        key={tech.name}
                        name={tech.name}
                        color={tech.color}
                        index={idx}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <p className="mt-12 text-center text-sm text-muted-foreground">
          ... and always learning what comes next.
        </p>
      </div>
    </section>
  );
}
