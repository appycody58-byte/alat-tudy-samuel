import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { VoiceSection } from "@/components/VoiceSection";
import { TransferDemo } from "@/components/TransferDemo";
import { ApiSection } from "@/components/ApiSection";
import { DeveloperSection } from "@/components/DeveloperSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <VoiceSection />
      <TransferDemo />
      <ApiSection />
      <DeveloperSection />
      <Footer />
    </main>
  );
}
