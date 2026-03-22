import { Mail, Github } from "lucide-react";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section id="contact" className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Let&apos;s Build Something Great
        </h2>
        <p className="mt-4 text-muted-foreground">
          Have a project in mind? We would love to hear about it.
        </p>

        <ContactForm />

        <div className="mt-12 flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <a
            href="mailto:hello@craftia.com.mx"
            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Mail className="size-4" />
            hello@craftia.com.mx
          </a>
          <a
            href="https://github.com/craftiacol"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Github className="size-4" />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
