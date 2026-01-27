import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Crown, Rocket } from "lucide-react"

const plans = [
  {
    name: "Free",
    icon: Zap,
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Upload up to 10 videos",
      "HD video quality",
      "Basic analytics",
      "Community support",
      "Standard upload speed",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Creator",
    icon: Crown,
    price: "$19",
    period: "per month",
    description: "For serious content creators",
    features: [
      "Unlimited video uploads",
      "4K video quality",
      "Advanced analytics",
      "Priority support",
      "Fast upload speed",
      "Custom channel branding",
      "Monetization tools",
      "No platform fees on first $1,000",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Studio",
    icon: Rocket,
    price: "$99",
    period: "per month",
    description: "For production studios",
    features: [
      "Everything in Creator",
      "8K video quality",
      "White-label options",
      "Dedicated account manager",
      "API access",
      "Team collaboration tools",
      "Advanced monetization",
      "No platform fees on first $10,000",
      "Priority content review",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Choose Your Plan</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Start for free and upgrade as you grow. All plans include our core features.
          </p>
        </div>

        <div className="mb-16 grid gap-8 md:grid-cols-3">
          {plans.map((plan, i) => (
            <Card
              key={i}
              className={`relative border-primary/20 bg-card/50 p-8 backdrop-blur transition-all hover:border-primary/40 ${
                plan.popular ? "border-primary/60 shadow-lg shadow-primary/20" : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              <div className="mb-6 flex justify-center">
                <plan.icon className="h-12 w-12 text-primary" />
              </div>
              <h3 className="mb-2 text-center text-2xl font-bold">{plan.name}</h3>
              <p className="mb-6 text-center text-sm text-muted-foreground">{plan.description}</p>
              <div className="mb-6 text-center">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground"> / {plan.period}</span>
              </div>
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border-primary/40 text-primary hover:bg-primary/10"
                }`}
                variant={plan.popular ? "default" : "outline"}
                size="lg"
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="mb-8 text-center text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="mx-auto max-w-3xl space-y-4">
            {[
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and cryptocurrency payments.",
              },
              {
                q: "Can I change my plan later?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "What are platform fees?",
                a: "We charge a small percentage on earnings above your plan's threshold. Free plan: 20%, Creator: 10%, Studio: 5%.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes! Creator and Studio plans include a 14-day free trial. No credit card required.",
              },
            ].map((faq, i) => (
              <Card key={i} className="border-primary/20 bg-card/50 p-6 backdrop-blur">
                <h3 className="mb-2 font-semibold">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-primary/40 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Need a Custom Plan?</h2>
          <p className="mb-8 text-lg text-foreground/80">
            Large studios and enterprises can contact us for custom pricing and features.
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Contact Sales
          </Button>
        </div>
      </main>
    </div>
  )
}
