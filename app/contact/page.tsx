import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, MessageSquare, HelpCircle, Building } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Get in Touch</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Have questions or feedback? We'd love to hear from you. Our team is here to help.
          </p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-primary/20 bg-card/50 p-6 text-center backdrop-blur">
            <div className="mb-4 flex justify-center">
              <Mail className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold">Email</h3>
            <p className="text-sm text-muted-foreground">support@aimovies.ai</p>
          </Card>

          <Card className="border-primary/20 bg-card/50 p-6 text-center backdrop-blur">
            <div className="mb-4 flex justify-center">
              <MessageSquare className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold">Live Chat</h3>
            <p className="text-sm text-muted-foreground">Available 24/7</p>
          </Card>

          <Card className="border-primary/20 bg-card/50 p-6 text-center backdrop-blur">
            <div className="mb-4 flex justify-center">
              <HelpCircle className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold">Help Center</h3>
            <p className="text-sm text-muted-foreground">Browse FAQs</p>
          </Card>

          <Card className="border-primary/20 bg-card/50 p-6 text-center backdrop-blur">
            <div className="mb-4 flex justify-center">
              <Building className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mb-2 font-semibold">Office</h3>
            <p className="text-sm text-muted-foreground">San Francisco, CA</p>
          </Card>
        </div>

        <div className="mx-auto max-w-2xl">
          <Card className="border-primary/20 bg-card/50 p-8 backdrop-blur">
            <h2 className="mb-6 text-2xl font-bold">Send Us a Message</h2>
            <form className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" className="border-primary/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" className="border-primary/20" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" className="border-primary/20" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help?" className="border-primary/20" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your inquiry..."
                  rows={6}
                  className="border-primary/20 resize-none"
                />
              </div>

              <Button type="submit" size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
