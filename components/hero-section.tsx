import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-secondary/50 to-background py-32 md:py-48">
      {/* Background decoration with teal accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(14,116,144,0.2),rgba(255,255,255,0))]" />

      {/* Background image overlay */}
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat mix-blend-overlay"
        style={{ backgroundImage: "url(/hero-background.jpg)" }}
      />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-primary bg-background/95 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-white shadow-lg">
            <TrendingUp className="h-4 w-4 text-primary" />
            Join 100k+ AI Creators
          </div>

          {/* Updated heading */}
          <h1 className="mb-6 text-5xl font-bold leading-tight text-balance md:text-6xl lg:text-7xl">
            The Future of AI Cinema
          </h1>

          {/* Updated description */}
          <p className="mb-10 text-xl text-foreground/90 text-balance md:text-2xl leading-relaxed">
            Upload, share, and monetize your AI-generated movies. Rent or own exclusive content. Join the revolution
            where creators own their content and their future.
          </p>

          {/* Updated CTA buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
              <Link href="/browse">Start Watching</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-primary/40 hover:bg-primary/10 bg-transparent text-foreground px-8"
            >
              <Link href="/upload">Upload Your Movie</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-8">
            <div>
              <div className="text-3xl font-bold text-primary">10M+</div>
              <div className="mt-1 text-sm text-muted-foreground">AI Movies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">500K+</div>
              <div className="mt-1 text-sm text-muted-foreground">Creators</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">$50M+</div>
              <div className="mt-1 text-sm text-muted-foreground">Paid to Creators</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
