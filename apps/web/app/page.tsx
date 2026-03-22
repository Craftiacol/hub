import {
  Hero,
  Services,
  Portfolio,
  About,
  Contact,
  Footer,
} from "@/app/features/landing";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="scroll-smooth">
      <Hero />
      <Separator />
      <Services />
      <Separator />
      <Portfolio />
      <Separator />
      <About />
      <Separator />
      <Contact />
      <Footer />
    </main>
  );
}
