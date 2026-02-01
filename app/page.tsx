import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Do the work.{" "}
              <span className="text-primary">Watch it bloom.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Bloom turns your productivity into a living garden. Complete meaningful work 
              and watch your garden thrive. Skip or fake it, and watch it wither.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/auth/sign-up">Start Growing</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How Bloom Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2">Enter Your Task</h3>
                <p className="text-muted-foreground">
                  Tell Bloom what you want to work on, even if it&apos;s vague. 
                  &quot;Work on my startup&quot; is perfectly fine.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2">Get Clarity</h3>
                <p className="text-muted-foreground">
                  AI breaks your task into concrete, actionable steps. 
                  You commit to what will exist when you&apos;re done.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2">Grow Your Garden</h3>
                <p className="text-muted-foreground">
                  Complete work honestly and your garden flourishes. 
                  Your garden becomes a visual story of real progress.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Built on a Simple Belief</h2>
            <p className="text-xl text-muted-foreground mb-8">
              People don&apos;t need more motivation. They need clearer action and visible consequences.
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="p-6 rounded-lg bg-muted/30">
                <h3 className="font-semibold mb-2">Clarity Before Motivation</h3>
                <p className="text-sm text-muted-foreground">
                  Motivation fails when tasks are vague. Bloom prioritizes clarity first.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-muted/30">
                <h3 className="font-semibold mb-2">Plausibility Over Proof</h3>
                <p className="text-sm text-muted-foreground">
                  We don&apos;t verify your work. We evaluate whether your progress makes sense.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-muted/30">
                <h3 className="font-semibold mb-2">Visual Consequence</h3>
                <p className="text-sm text-muted-foreground">
                  No streaks or reminders. The garden reflects your behavior naturally.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-muted/30">
                <h3 className="font-semibold mb-2">Never Shame</h3>
                <p className="text-sm text-muted-foreground">
                  Consequences exist, but the language and tone remain supportive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Growing?</h2>
          <p className="text-muted-foreground mb-8">
            Join Bloom and turn your discipline into something you can see.
          </p>
          <Button asChild size="lg">
            <Link href="/auth/sign-up">Create Your Garden</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Bloom &mdash; Do the work. Watch it bloom.</p>
        </div>
      </footer>
    </main>
  );
}
