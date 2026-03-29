import { Mail, Github, ArrowRight } from "lucide-react";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section id="contact" className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Start Your <span className="gradient-text">Project</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Tell us about your idea and we&apos;ll help you bring it to life.
          <br className="hidden sm:block" />
          From concept to launch, we&apos;ve got you covered.
        </p>

        <ContactForm />

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
          <a
            href="mailto:hello@craftia.com.mx"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <Mail className="size-4" />
            hello@craftia.com.mx
            <ArrowRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
          <a
            href="https://github.com/craftiacol"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <Github className="size-4" />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
