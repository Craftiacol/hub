import { Rocket, Brain, Globe } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const services = [
  {
    icon: Rocket,
    title: "Custom SaaS",
    description:
      "End-to-end SaaS development. From MVP to scale. We handle architecture, development, and deployment.",
  },
  {
    icon: Brain,
    title: "AI Solutions",
    description:
      "Intelligent software powered by cutting-edge AI. Chatbots, automation, content generation, and custom AI agents.",
  },
  {
    icon: Globe,
    title: "Web Applications",
    description:
      "Modern web applications built with the latest tech stack. Fast, accessible, and built to last.",
  },
];

export function Services() {
  return (
    <section id="services" className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What We Build
          </h2>
          <p className="mt-4 text-muted-foreground">
            From idea to production — we cover the full spectrum.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service, i) => (
            <Card
              key={service.title}
              className="border border-border/50 transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              style={{
                animation: `fade-in-up 0.6s ease-out ${i * 0.15}s both`,
              }}
            >
              <CardHeader>
                <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 ring-1 ring-primary/10">
                  <service.icon className="size-6 text-primary" />
                </div>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
