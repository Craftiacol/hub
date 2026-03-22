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
          {services.map((service) => (
            <Card key={service.title} className="border-0">
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <service.icon className="size-5 text-primary" />
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
