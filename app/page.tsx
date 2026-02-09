import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/server";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AnimatedBackground } from "@/components/landing/animated-background";
import { LandingNav } from "@/components/landing/landing-nav";
import { HeroSection } from "@/components/landing/hero-section";
import { GardenShowcase } from "@/components/landing/garden-showcase";
import { StepsSection } from "@/components/landing/steps-section";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { PhilosophySection } from "@/components/landing/philosophy-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  // Check if user is already authenticated
  const session = await auth.getSession();
  if (session?.data?.user) {
    // Authenticated users should go to the app
    redirect("/tasks");
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="bloom-theme">
      <div className="relative min-h-screen">
        <AnimatedBackground />
        <LandingNav />
        
        <main className="relative">
          <HeroSection />
          
          <div id="showcase">
            <GardenShowcase />
          </div>
          
          <div id="how-it-works">
            <StepsSection />
          </div>
          
          <div id="features">
            <FeatureGrid />
          </div>
          
          <div id="philosophy">
            <PhilosophySection />
          </div>
          
          <CTASection />
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
}
