import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock } from "lucide-react"

const jobOpenings = [
  {
    id: 1,
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "Help build the future of AI cinema by creating scalable infrastructure for millions of creators and viewers.",
  },
  {
    id: 2,
    title: "AI/ML Engineer",
    department: "AI Research",
    location: "San Francisco, CA",
    type: "Full-time",
    description:
      "Develop cutting-edge AI models to enhance video generation, recommendation systems, and content analysis.",
  },
  {
    id: 3,
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    description: "Design beautiful, intuitive experiences that empower creators to share their AI-generated content.",
  },
  {
    id: 4,
    title: "Creator Relations Manager",
    department: "Community",
    location: "Remote",
    type: "Full-time",
    description: "Build relationships with top creators and help them succeed on our platform.",
  },
  {
    id: 5,
    title: "Content Marketing Lead",
    department: "Marketing",
    location: "New York, NY",
    type: "Full-time",
    description: "Tell the story of AI cinema and attract the next generation of creators and viewers to our platform.",
  },
  {
    id: 6,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Ensure our platform runs smoothly at scale, managing infrastructure and deployment pipelines.",
  },
]

export default function CareersPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Join Our Team</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Help us build the future of AI-generated entertainment. We're looking for talented, passionate people to
            join our mission.
          </p>
        </div>

        <div className="mb-16 grid gap-8 md:grid-cols-3">
          <Card className="border-primary/20 bg-card/50 p-6 text-center backdrop-blur">
            <h3 className="mb-2 text-xl font-semibold">Remote-First</h3>
            <p className="text-muted-foreground">Work from anywhere in the world with flexible hours.</p>
          </Card>

          <Card className="border-primary/20 bg-card/50 p-6 text-center backdrop-blur">
            <h3 className="mb-2 text-xl font-semibold">Competitive Benefits</h3>
            <p className="text-muted-foreground">Health insurance, equity, and unlimited PTO.</p>
          </Card>

          <Card className="border-primary/20 bg-card/50 p-6 text-center backdrop-blur">
            <h3 className="mb-2 text-xl font-semibold">Growth Opportunities</h3>
            <p className="text-muted-foreground">Learn and advance your career with our team.</p>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Open Positions</h2>
          <div className="space-y-4">
            {jobOpenings.map((job) => (
              <Card key={job.id} className="border-primary/20 bg-card/50 p-6 backdrop-blur">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <Badge variant="outline" className="border-primary/40 text-primary">
                        {job.department}
                      </Badge>
                    </div>
                    <p className="mb-3 text-muted-foreground">{job.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{job.type}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Apply Now</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-primary/40 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Don't See the Right Role?</h2>
          <p className="mb-8 text-lg text-foreground/80">
            We're always looking for talented people. Send us your resume and let us know how you can contribute.
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Send Your Resume
          </Button>
        </div>
      </main>
    </div>
  )
}
