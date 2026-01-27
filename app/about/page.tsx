import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Users, Target, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">About AIMovies.ai</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Revolutionizing the entertainment industry by empowering AI creators to share their vision with the world.
          </p>
        </div>

        <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-primary/20 bg-card/50 p-6 text-center backdrop-blur">
            <div className="mb-4 flex justify-center">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <h3 className="mb-2 text-2xl font-bold">10M+</h3>
            <p className="text-muted-foreground">AI Movies</p>
          </Card>

          <Card className="border-primary/20 bg-card/50 p-6 text-center backdrop-blur">
            <div className="mb-4 flex justify-center">
              <Users className="h-12 w-12 text-primary" />
            </div>
            <h3 className="mb-2 text-2xl font-bold">500K+</h3>
            <p className="text-muted-foreground">Active Creators</p>
          </Card>

          <Card className="border-primary/20 bg-card/50 p-6 text-center backdrop-blur">
            <div className="mb-4 flex justify-center">
              <Target className="h-12 w-12 text-primary" />
            </div>
            <h3 className="mb-2 text-2xl font-bold">$50M+</h3>
            <p className="text-muted-foreground">Paid to Creators</p>
          </Card>

          <Card className="border-primary/20 bg-card/50 p-6 text-center backdrop-blur">
            <div className="mb-4 flex justify-center">
              <Heart className="h-12 w-12 text-primary" />
            </div>
            <h3 className="mb-2 text-2xl font-bold">100K+</h3>
            <p className="text-muted-foreground">Daily Viewers</p>
          </Card>
        </div>

        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold">Our Mission</h2>
          <Card className="border-primary/20 bg-card/50 p-8 backdrop-blur">
            <p className="mb-4 text-lg">
              AIMovies.ai is dedicated to democratizing the film industry through artificial intelligence. We believe
              that every creative mind deserves a platform to share their stories, regardless of budget or traditional
              industry barriers.
            </p>
            <p className="text-lg">
              Our platform empowers creators to upload, monetize, and distribute their AI-generated content while
              maintaining full ownership and creative control. We're building the future of entertainment, one AI movie
              at a time.
            </p>
          </Card>
        </div>

        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold">Our Values</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-primary/20 bg-card/50 p-6 backdrop-blur">
              <h3 className="mb-3 text-xl font-semibold">Creator First</h3>
              <p className="text-muted-foreground">
                We prioritize creator success and provide tools that help you earn from your AI creations.
              </p>
            </Card>

            <Card className="border-primary/20 bg-card/50 p-6 backdrop-blur">
              <h3 className="mb-3 text-xl font-semibold">Innovation</h3>
              <p className="text-muted-foreground">
                Pushing the boundaries of what's possible with AI-generated content and storytelling.
              </p>
            </Card>

            <Card className="border-primary/20 bg-card/50 p-6 backdrop-blur">
              <h3 className="mb-3 text-xl font-semibold">Community</h3>
              <p className="text-muted-foreground">
                Building a supportive ecosystem where creators inspire and learn from each other.
              </p>
            </Card>
          </div>
        </div>

        <div className="rounded-lg border border-primary/40 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Join the AI Cinema Revolution</h2>
          <p className="mb-8 text-lg text-foreground/80">
            Be part of the future of entertainment. Start creating and earning today.
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Get Started
          </Button>
        </div>
      </main>
    </div>
  )
}
