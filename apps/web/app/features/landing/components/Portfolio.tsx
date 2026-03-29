"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Bot,
  Layers,
  Sparkles,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface TechItem {
  name: string;
  icon: string;
}

interface Project {
  title: string;
  client?: string;
  description: string;
  longDescription?: string;
  badges: string[];
  tech: TechItem[];
  status: "live" | "development" | "coming-soon";
  icon: React.ReactNode;
  screenshots?: string[];
  url?: string;
}

const projects: Project[] = [
  {
    title: "PelviBiz AI",
    client: "Kelly",
    description:
      "AI-powered content generation platform for pelvic health practitioners. 4 AI agents for carousel and video creation.",
    longDescription:
      "PelviBiz AI Hub is a production SaaS platform that empowers pelvic health practitioners to generate professional social media content using AI agents. The platform features 4 specialized AI agents (Real Carousel, AI Carousel, Real Video, AI Video), a content library with publish/schedule capabilities, a monthly content calendar, credit-based billing, and a full admin panel. Built with Angular 21's cutting-edge features including standalone components, signals, and zoneless change detection.",
    badges: ["SaaS", "AI", "Healthcare", "PWA"],
    tech: [
      { name: "Angular 21", icon: "●" },
      { name: "Supabase", icon: "●" },
      { name: "Tailwind 4", icon: "●" },
      { name: "n8n", icon: "●" },
      { name: "Vercel", icon: "●" },
      { name: "TypeScript", icon: "●" },
      { name: "Playwright", icon: "●" },
      { name: "Vitest", icon: "●" },
    ],
    status: "live",
    icon: <Bot className="size-5" />,
    screenshots: [
      "/portfolio/pelvibiz/login.png",
      "/portfolio/pelvibiz/dashboard.png",
      "/portfolio/pelvibiz/chat.png",
      "/portfolio/pelvibiz/library.png",
      "/portfolio/pelvibiz/mobile.png",
    ],
    url: "https://healthcareai.pelvibiz.live/",
  },
  {
    title: "CavesApp",
    client: "Andres",
    description:
      "Geolocation-based event flyer discovery platform. Infinite canvas with pan/zoom navigation to explore nearby events.",
    longDescription:
      "CavesApp is a mobile-first web platform for discovering local events through an infinite canvas experience. Users explore nearby event flyers by panning and zooming — like navigating a digital poster wall. Features include IP-based geolocation for instant local content, address search with autocomplete, flyer upload with WebP optimization, user profiles, and an admin panel for content moderation. The infinite canvas dynamically generates tiles based on viewport position for seamless exploration in all directions.",
    badges: ["Mobile-First", "Geolocation", "Canvas", "PWA"],
    tech: [
      { name: "Next.js 16", icon: "●" },
      { name: "Supabase", icon: "●" },
      { name: "PostGIS", icon: "●" },
      { name: "Framer Motion", icon: "●" },
      { name: "Zustand", icon: "●" },
      { name: "TypeScript", icon: "●" },
      { name: "Tailwind 4", icon: "●" },
      { name: "Vercel", icon: "●" },
    ],
    status: "live",
    icon: <MapPin className="size-5" />,
    url: "https://getcaves.com",
  },
  {
    title: "Rcomienda",
    description:
      "AI-powered recommendation engine for personalized content discovery. Smart suggestions based on user behavior and preferences.",
    badges: ["SaaS", "AI", "Recommendations"],
    tech: [
      { name: "React", icon: "●" },
      { name: "Next.js", icon: "●" },
      { name: "TypeScript", icon: "●" },
      { name: "Supabase", icon: "●" },
    ],
    status: "development",
    icon: <Sparkles className="size-5" />,
  },
  {
    title: "Craftia Hub",
    description:
      "Internal business platform for managing clients, invoicing, pipeline, and AI workspace. The engine behind our operations.",
    badges: ["Internal", "CRM", "AI Workspace"],
    tech: [
      { name: "Next.js 16", icon: "●" },
      { name: "Supabase", icon: "●" },
      { name: "Stripe", icon: "●" },
      { name: "Turborepo", icon: "●" },
      { name: "Tailwind 4", icon: "●" },
    ],
    status: "live",
    icon: <Layers className="size-5" />,
  },
];

const statusConfig = {
  live: {
    label: "Live",
    className: "border-accent/30 bg-accent/10 text-accent",
  },
  development: {
    label: "In Development",
    className: "border-primary/30 bg-primary/10 text-primary",
  },
  "coming-soon": {
    label: "Coming Soon",
    className: "border-muted-foreground/30 bg-muted text-muted-foreground",
  },
};

function ImageSlider({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());

  function next() {
    setCurrent((i) => (i + 1) % images.length);
  }
  function prev() {
    setCurrent((i) => (i - 1 + images.length) % images.length);
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5">
      {imgErrors.has(current) ? (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Bot className="mx-auto size-12 opacity-30" />
            <p className="mt-2 text-sm">Screenshots coming soon</p>
          </div>
        </div>
      ) : (
        <img
          src={images[current]}
          alt={`Screenshot ${current + 1}`}
          className="h-full w-full object-cover object-top"
          onError={() =>
            setImgErrors((prev) => new Set(prev).add(current))
          }
        />
      )}

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-background"
            aria-label="Previous screenshot"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-background"
            aria-label="Next screenshot"
          >
            <ChevronRight className="size-4" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`size-2 rounded-full transition-all ${
                i === current
                  ? "w-6 bg-primary"
                  : "bg-foreground/30 hover:bg-foreground/50"
              }`}
              aria-label={`Go to screenshot ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectModal({
  project,
  open,
  onClose,
}: {
  project: Project;
  open: boolean;
  onClose: () => void;
}) {
  const status = statusConfig[project.status];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        {/* Screenshot slider */}
        {project.screenshots && project.screenshots.length > 0 && (
          <ImageSlider images={project.screenshots} />
        )}

        <div className="space-y-4 p-6">
          {/* Title + status */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {project.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold">{project.title}</h3>
                {project.client && (
                  <p className="text-sm text-muted-foreground">
                    Client:{" "}
                    <span className="text-primary">{project.client}</span>
                  </p>
                )}
              </div>
            </div>
            <Badge className={status.className}>{status.label}</Badge>
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-muted-foreground">
            {project.longDescription || project.description}
          </p>

          {/* Tech stack */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t.name}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  <span className="size-2 rounded-full bg-primary" />
                  {t.name}
                </span>
              ))}
            </div>
          </div>

          {/* Category badges */}
          <div className="flex flex-wrap gap-2">
            {project.badges.map((badge) => (
              <Badge
                key={badge}
                variant="secondary"
                className="border border-primary/20 bg-primary/5 text-primary"
              >
                {badge}
              </Badge>
            ))}
          </div>

          {/* CTA */}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground shadow-md transition-all hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20"
            >
              Visit Project
              <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <>
      <section id="portfolio" className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our Work
            </h2>
            <p className="mt-4 text-muted-foreground">
              Real projects we have built and shipped for real clients.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {projects.map((project, i) => {
              const status = statusConfig[project.status];
              return (
                <Card
                  key={project.title}
                  className="group flex cursor-pointer flex-col overflow-hidden border border-border/50 transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                  style={{
                    animation: `fade-in-up 0.6s ease-out ${i * 0.15}s both`,
                  }}
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Header with screenshot preview or gradient */}
                  <div className={`relative w-full overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 ${project.screenshots?.length ? "h-52" : "h-36"}`}>
                    {project.screenshots && project.screenshots[0] ? (
                      <img
                        src={project.screenshots[0]}
                        alt={`${project.title} preview`}
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="flex size-14 items-center justify-center rounded-xl bg-background/80 text-primary shadow-lg backdrop-blur-sm">
                          {project.icon}
                        </div>
                      </div>
                    )}
                    <Badge
                      className={`absolute right-3 top-3 text-[10px] ${status.className}`}
                    >
                      {status.label}
                    </Badge>
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card to-transparent" />
                    {/* Click hint */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100">
                      <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium shadow-lg">
                        View Details
                      </span>
                    </div>
                  </div>

                  <CardHeader className="pb-2 pt-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">
                        {project.title}
                      </CardTitle>
                    </div>
                    {project.client && (
                      <p className="text-xs text-muted-foreground">
                        Client:{" "}
                        <span className="text-primary">{project.client}</span>
                      </p>
                    )}
                    <CardDescription className="mt-1 line-clamp-3 text-sm">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="mt-auto space-y-3">
                    {/* Tech stack */}
                    <div>
                      <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Tech Stack
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech.slice(0, 5).map((t) => (
                          <span
                            key={t.name}
                            className="inline-flex items-center gap-1.5 rounded-md border border-border/50 bg-muted/50 px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                          >
                            <span className="size-1.5 rounded-full bg-primary" />
                            {t.name}
                          </span>
                        ))}
                        {project.tech.length > 5 && (
                          <span className="inline-flex items-center rounded-md border border-border/50 bg-muted/50 px-1.5 py-0.5 text-[11px] text-muted-foreground">
                            +{project.tech.length - 5}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Category badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.badges.map((badge) => (
                        <Badge
                          key={badge}
                          variant="secondary"
                          className="border border-primary/20 bg-primary/5 text-[11px] text-primary"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Project detail modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          open={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}
