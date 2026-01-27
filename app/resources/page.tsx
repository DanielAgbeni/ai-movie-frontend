import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Video, FileText, Lightbulb, Download, ExternalLink } from "lucide-react"

const resources = [
  {
    category: "Getting Started",
    icon: Lightbulb,
    items: [
      { title: "Platform Overview", type: "Guide", link: "#" },
      { title: "Creating Your First AI Movie", type: "Tutorial", link: "#" },
      { title: "Upload Best Practices", type: "Guide", link: "#" },
      { title: "Channel Setup Guide", type: "Tutorial", link: "#" },
    ],
  },
  {
    category: "Content Creation",
    icon: Video,
    items: [
      { title: "AI Video Generation Tools", type: "Resource", link: "#" },
      { title: "Storytelling with AI", type: "Guide", link: "#" },
      { title: "Video Editing Tips", type: "Tutorial", link: "#" },
      { title: "Sound Design for AI Movies", type: "Guide", link: "#" },
    ],
  },
  {
    category: "Monetization",
    icon: FileText,
    items: [
      { title: "Pricing Your Content", type: "Guide", link: "#" },
      { title: "Understanding Revenue Shares", type: "Guide", link: "#" },
      { title: "Building Your Audience", type: "Tutorial", link: "#" },
      { title: "Marketing Your Channel", type: "Guide", link: "#" },
    ],
  },
  {
    category: "Documentation",
    icon: BookOpen,
    items: [
      { title: "API Documentation", type: "Docs", link: "#" },
      { title: "Terms of Service", type: "Legal", link: "#" },
      { title: "Content Guidelines", type: "Policy", link: "#" },
      { title: "Copyright & Licensing", type: "Legal", link: "#" },
    ],
  },
]

const downloadables = [
  { title: "Creator Handbook (PDF)", size: "2.4 MB", icon: FileText },
  { title: "Brand Assets Package", size: "15.8 MB", icon: Download },
  { title: "Video Templates", size: "45.2 MB", icon: Video },
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Creator Resources</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Everything you need to succeed as an AI content creator. Guides, tutorials, and tools to help you grow.
          </p>
        </div>

        <div className="mb-16 space-y-8">
          {resources.map((section, i) => (
            <div key={i}>
              <div className="mb-4 flex items-center gap-3">
                <section.icon className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">{section.category}</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {section.items.map((item, j) => (
                  <Card
                    key={j}
                    className="border-primary/20 bg-card/50 p-6 backdrop-blur transition-all hover:border-primary/40"
                  >
                    <div className="mb-3 inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
                      {item.type}
                    </div>
                    <h3 className="mb-2 font-semibold">{item.title}</h3>
                    <Button variant="ghost" size="sm" className="group text-primary hover:bg-primary/10">
                      View
                      <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold">Downloadable Resources</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {downloadables.map((item, i) => (
              <Card key={i} className="border-primary/20 bg-card/50 p-6 backdrop-blur">
                <div className="mb-4 flex justify-center">
                  <item.icon className="h-12 w-12 text-primary" />
                </div>
                <h3 className="mb-2 text-center font-semibold">{item.title}</h3>
                <p className="mb-4 text-center text-sm text-muted-foreground">{item.size}</p>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-lg border border-primary/40 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Need More Help?</h2>
          <p className="mb-8 text-lg text-foreground/80">
            Our support team is available 24/7 to answer your questions and help you succeed.
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Contact Support
          </Button>
        </div>
      </main>
    </div>
  )
}
