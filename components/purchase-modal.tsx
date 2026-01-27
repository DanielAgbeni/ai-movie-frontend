"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Download, Clock, CheckCircle2, Shield } from "lucide-react"

interface PurchaseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  videoTitle: string
  videoThumbnail: string
  rentPrice?: number
  buyPrice?: number
}

export function PurchaseModal({
  open,
  onOpenChange,
  videoTitle,
  videoThumbnail,
  rentPrice,
  buyPrice,
}: PurchaseModalProps) {
  const [selectedOption, setSelectedOption] = useState<"rent" | "buy">(rentPrice ? "rent" : "buy")
  const [processing, setProcessing] = useState(false)
  const [complete, setComplete] = useState(false)

  const handlePurchase = () => {
    setProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false)
      setComplete(true)
      setTimeout(() => {
        onOpenChange(false)
        setComplete(false)
      }, 2000)
    }, 2000)
  }

  const currentPrice = selectedOption === "rent" ? rentPrice : buyPrice

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {!complete ? (
          <>
            <DialogHeader>
              <DialogTitle>Purchase AI Movie</DialogTitle>
              <DialogDescription>Choose your viewing option and complete your purchase</DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Video Preview */}
              <div className="space-y-4">
                <div className="aspect-video overflow-hidden rounded-lg">
                  <img
                    src={videoThumbnail || "/placeholder.svg"}
                    alt={videoTitle}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="font-semibold leading-snug">{videoTitle}</h3>

                {/* Purchase Options */}
                <div className="space-y-3">
                  {rentPrice && (
                    <div
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                        selectedOption === "rent"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedOption("rent")}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-semibold">Rent</p>
                            <p className="text-xs text-muted-foreground">48 hours viewing</p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-primary">${rentPrice}</span>
                      </div>
                    </div>
                  )}

                  {buyPrice && (
                    <div
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                        selectedOption === "buy"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedOption("buy")}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Download className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-semibold">Buy</p>
                            <p className="text-xs text-muted-foreground">Unlimited viewing & download</p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-primary">${buyPrice}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Benefits */}
                <div className="rounded-lg border border-border bg-secondary/50 p-4">
                  <p className="mb-3 text-sm font-semibold">What's included:</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{selectedOption === "rent" ? "48 hours" : "Unlimited"} HD streaming</span>
                    </li>
                    {selectedOption === "buy" && (
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>Download and own forever</span>
                      </li>
                    )}
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>Support the creator directly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>Watch on any device</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Payment Form */}
              <div className="space-y-6">
                <Tabs defaultValue="card" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="card">Card</TabsTrigger>
                    <TabsTrigger value="paypal">PayPal</TabsTrigger>
                  </TabsList>

                  <TabsContent value="card" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <div className="relative">
                        <Input
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          className="bg-secondary border-border pr-10"
                        />
                        <CreditCard className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" className="bg-secondary border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" className="bg-secondary border-border" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Cardholder Name</Label>
                      <Input id="name" placeholder="John Doe" className="bg-secondary border-border" />
                    </div>
                  </TabsContent>

                  <TabsContent value="paypal" className="py-8 text-center">
                    <Button variant="outline" className="w-full bg-transparent">
                      Continue with PayPal
                    </Button>
                  </TabsContent>
                </Tabs>

                <Separator />

                {/* Order Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {selectedOption === "rent" ? "Rental" : "Purchase"} Price
                    </span>
                    <span className="font-medium">${currentPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Processing Fee</span>
                    <span className="font-medium">${((currentPrice || 0) * 0.05).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="text-lg font-bold text-primary">${((currentPrice || 0) * 1.05).toFixed(2)}</span>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2">
                  <Checkbox id="terms" />
                  <label htmlFor="terms" className="cursor-pointer text-xs text-muted-foreground leading-relaxed">
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Purchase Button */}
                <Button
                  size="lg"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handlePurchase}
                  disabled={processing}
                >
                  {processing ? "Processing..." : `Complete ${selectedOption === "rent" ? "Rental" : "Purchase"}`}
                </Button>

                {/* Security Notice */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Secure payment powered by Stripe</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="mb-2 text-2xl font-bold">Purchase Complete!</h3>
            <p className="text-muted-foreground">You can now start watching your AI movie</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
