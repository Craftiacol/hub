import {
  Hero,
  Metrics,
  Services,
  Process,
  Portfolio,
  TechStack,
  About,
  Testimonials,
  ClosingCTA,
  Contact,
  Footer,
} from "@/app/features/landing";

export default function Home() {
  return (
    <main className="scroll-smooth">
      <Hero />
      <Metrics />
      <Services />
      <Process />
      <Portfolio />
      <TechStack />
      <About />
      <Testimonials />
      <ClosingCTA />
      <Contact />
      <Footer />
    </main>
  );
}
