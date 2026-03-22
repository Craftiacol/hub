import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const projects = [
  {
    title: "Rcomienda",
    description:
      "AI-powered recommendation engine for personalized content discovery.",
    badges: ["SaaS", "AI"],
  },
  {
    title: "Client Project",
    description:
      "Custom AI agent platform for business automation.",
    badges: ["AI", "Enterprise"],
  },
  {
    title: "Coming Soon",
    description: "New exciting project in development.",
    badges: ["2026"],
  },
];

export function Portfolio() {
  return (
    <section id="portfolio" className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Our Work
          </h2>
          <p className="mt-4 text-muted-foreground">
            A selection of projects we have built and shipped.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.title} className="border-0">
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.badges.map((badge) => (
                    <Badge key={badge} variant="secondary">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
