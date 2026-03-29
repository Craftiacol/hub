import { Search, Palette, Code, Rocket } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discovery",
    description:
      "We dive deep into your business goals, users, and constraints to define the right solution.",
  },
  {
    icon: Palette,
    title: "Design",
    description:
      "Wireframes, prototypes, and UI design that balance aesthetics with usability.",
  },
  {
    icon: Code,
    title: "Build",
    description:
      "Clean, tested, production-grade code built on solid architecture foundations.",
  },
  {
    icon: Rocket,
    title: "Launch",
    description:
      "Deployment, monitoring, and iterative improvements to ensure long-term success.",
  },
];

export function Process() {
  return (
    <section id="process" className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How We Work
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full gradient-bg" />
          <p className="mt-4 text-muted-foreground">
            A proven process from idea to production.
          </p>
        </div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden md:block">
          <div className="relative grid grid-cols-4 gap-8">
            {/* Connecting line */}
            <div className="absolute left-[12.5%] right-[12.5%] top-7 h-0.5 gradient-bg" />

            {steps.map((step, i) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center text-center"
                style={{
                  animation: `fade-in-up 0.6s ease-out ${i * 0.15}s both`,
                }}
              >
                <div className="relative z-10 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <step.icon className="size-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden">
          <div className="relative space-y-10 pl-10">
            {/* Vertical line */}
            <div className="absolute bottom-0 left-[1.0625rem] top-0 w-0.5 gradient-bg" />

            {steps.map((step, i) => (
              <div
                key={step.title}
                className="relative"
                style={{
                  animation: `fade-in-up 0.6s ease-out ${i * 0.15}s both`,
                }}
              >
                <div className="absolute -left-10 flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <step.icon className="size-4" />
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
