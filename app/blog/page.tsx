import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight } from "lucide-react"

const blogPosts = [
  {
    id: 1,
    title: "The Future of AI-Generated Cinema: Trends for 2026",
    excerpt: "Explore the latest advancements in AI filmmaking and what they mean for creators and audiences alike.",
    author: "Sarah Chen",
    date: "January 10, 2026",
    image: "/blog-ai-cinema-future.jpg",
    category: "Industry",
  },
  {
    id: 2,
    title: "How to Monetize Your AI Movies: A Complete Guide",
    excerpt: "Learn the strategies successful creators use to earn from their AI-generated content on our platform.",
    author: "Michael Rodriguez",
    date: "January 8, 2026",
    image: "/blog-monetization-guide.jpg",
    category: "Creator Tips",
  },
  {
    id: 3,
    title: "Top 10 AI Movies of December 2025",
    excerpt: "Discover the most innovative and engaging AI-generated films from last month's releases.",
    author: "Emma Thompson",
    date: "January 5, 2026",
    image: "/blog-top-movies.jpg",
    category: "Showcase",
  },
  {
    id: 4,
    title: "Building Your Channel: Best Practices for New Creators",
    excerpt: "Essential tips for growing your audience and establishing your brand as an AI content creator.",
    author: "David Kim",
    date: "January 3, 2026",
    image: "/blog-channel-growth.jpg",
    category: "Creator Tips",
  },
  {
    id: 5,
    title: "AI Storytelling: Crafting Compelling Narratives",
    excerpt: "Master the art of creating emotionally resonant stories with AI generation tools.",
    author: "Lisa Martinez",
    date: "December 28, 2025",
    image: "/blog-storytelling.jpg",
    category: "Techniques",
  },
  {
    id: 6,
    title: "Platform Update: New Features Coming in Q1 2026",
    excerpt: "Get a sneak peek at the exciting new tools and features we're launching for creators.",
    author: "AIMovies Team",
    date: "December 25, 2025",
    image: "/blog-platform-updates.jpg",
    category: "Updates",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">AI Cinema Blog</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Insights, tutorials, and stories from the world of AI-generated entertainment.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden border-primary/20 bg-card/50 backdrop-blur">
              <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                <img
                  src={`/.jpg?height=200&width=400&query=${encodeURIComponent(post.image)}`}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="mb-3 inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
                  {post.category}
                </div>
                <h2 className="mb-3 text-xl font-bold hover:text-primary transition-colors">
                  <a href={`/blog/${post.id}`}>{post.title}</a>
                </h2>
                <p className="mb-4 text-muted-foreground">{post.excerpt}</p>
                <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                </div>
                <Button variant="ghost" className="group text-primary hover:bg-primary/10">
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            size="lg"
            variant="outline"
            className="border-primary/40 text-primary hover:bg-primary/10 bg-transparent"
          >
            Load More Articles
          </Button>
        </div>
      </main>
    </div>
  )
}
