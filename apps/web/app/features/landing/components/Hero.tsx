import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Software Consultancy
        </p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          We Build Software
          <br />
          That Matters
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          SaaS products and AI-powered solutions crafted with precision. From
          concept to production.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" render={<a href="#contact" />}>
            Start a Project
          </Button>
          <Button variant="outline" size="lg" render={<a href="#portfolio" />}>
            See Our Work
          </Button>
        </div>
      </div>
    </section>
  );
}
