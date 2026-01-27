import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, ThumbsUp, DollarSign, TrendingUp, Users, PlayCircle } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your content performance and audience insights</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-card/50 border border-primary/20">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-primary/20 bg-card/50 p-6 backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-muted-foreground">Total Views</h3>
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <p className="mb-2 text-3xl font-bold">2.4M</p>
                <p className="flex items-center text-sm text-green-500">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  12.5% from last month
                </p>
              </Card>

              <Card className="border-primary/20 bg-card/50 p-6 backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-muted-foreground">Watch Time</h3>
                  <PlayCircle className="h-5 w-5 text-primary" />
                </div>
                <p className="mb-2 text-3xl font-bold">45.2K hrs</p>
                <p className="flex items-center text-sm text-green-500">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  8.3% from last month
                </p>
              </Card>

              <Card className="border-primary/20 bg-card/50 p-6 backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-muted-foreground">Subscribers</h3>
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <p className="mb-2 text-3xl font-bold">152K</p>
                <p className="flex items-center text-sm text-green-500">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  15.2% from last month
                </p>
              </Card>
            </div>

            <Card className="border-primary/20 bg-card/50 p-6 backdrop-blur">
              <h3 className="mb-4 font-semibold">Views Over Time</h3>
              <div className="flex h-64 items-end justify-between gap-2">
                {[40, 65, 55, 80, 75, 90, 85, 95, 88, 92, 100, 98].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary/80 hover:bg-primary transition-colors"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="border-primary/20 bg-card/50 p-6 backdrop-blur">
              <h3 className="mb-4 text-lg font-semibold">Top Performing Content</h3>
              <div className="space-y-4">
                {[
                  { title: "Epic Space Battle Episode 1", views: "850K", engagement: "92%" },
                  { title: "Cyberpunk Noir Detective", views: "720K", engagement: "89%" },
                  { title: "Ancient Kingdoms Rise", views: "680K", engagement: "87%" },
                ].map((video, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-border pb-4 last:border-0">
                    <div>
                      <p className="font-medium">{video.title}</p>
                      <p className="text-sm text-muted-foreground">{video.views} views</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{video.engagement}</p>
                      <p className="text-sm text-muted-foreground">Engagement</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-primary/20 bg-card/50 p-6 backdrop-blur">
                <h3 className="mb-4 font-semibold">Top Locations</h3>
                <div className="space-y-3">
                  {[
                    { country: "United States", percentage: 35 },
                    { country: "United Kingdom", percentage: 18 },
                    { country: "Canada", percentage: 12 },
                    { country: "Australia", percentage: 10 },
                    { country: "Germany", percentage: 8 },
                  ].map((location, i) => (
                    <div key={i}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>{location.country}</span>
                        <span className="font-medium">{location.percentage}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${location.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="border-primary/20 bg-card/50 p-6 backdrop-blur">
                <h3 className="mb-4 font-semibold">Age Demographics</h3>
                <div className="space-y-3">
                  {[
                    { range: "18-24", percentage: 28 },
                    { range: "25-34", percentage: 42 },
                    { range: "35-44", percentage: 18 },
                    { range: "45-54", percentage: 8 },
                    { range: "55+", percentage: 4 },
                  ].map((age, i) => (
                    <div key={i}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>{age.range}</span>
                        <span className="font-medium">{age.percentage}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${age.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-primary/20 bg-card/50 p-6 backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-muted-foreground">Total Earnings</h3>
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <p className="mb-2 text-3xl font-bold">$48,250</p>
                <p className="text-sm text-muted-foreground">This month</p>
              </Card>

              <Card className="border-primary/20 bg-card/50 p-6 backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-muted-foreground">Rentals</h3>
                  <PlayCircle className="h-5 w-5 text-primary" />
                </div>
                <p className="mb-2 text-3xl font-bold">$28,400</p>
                <p className="text-sm text-muted-foreground">This month</p>
              </Card>

              <Card className="border-primary/20 bg-card/50 p-6 backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-muted-foreground">Purchases</h3>
                  <ThumbsUp className="h-5 w-5 text-primary" />
                </div>
                <p className="mb-2 text-3xl font-bold">$19,850</p>
                <p className="text-sm text-muted-foreground">This month</p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
