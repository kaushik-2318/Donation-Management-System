"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { selectAuth } from "@/lib/redux/slices/authSlice"
import { selectPosts } from "@/lib/redux/slices/postSlice"
import { addDonation } from "@/lib/redux/slices/donationSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, CreditCard, CheckCircle } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"
import { generateDonationReceipt } from "@/lib/pdf-generator"

export default function DonatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const campaignId = searchParams.get("campaign")
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector(selectAuth)
  const posts = useAppSelector(selectPosts)
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [campaign, setCampaign] = useState < any > (null)
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [receiptUrl, setReceiptUrl] = useState < string | null > (null)

  // Card payment details
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  })

  // UPI payment details
  const [upiId, setUpiId] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    if (campaignId) {
      const fetchCampaign = async () => {
        try {
          // In a real app, this would be an API call
          const foundCampaign = await api.posts.getPostById(campaignId)
          if (foundCampaign) {
            setCampaign(foundCampaign)
          } else {
            toast({
              variant: "destructive",
              title: "Campaign not found",
              description: "The campaign you're looking for doesn't exist.",
            })
            router.push("/posts")
          }
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error loading campaign",
            description: "Could not load campaign details. Please try again later.",
          })
          router.push("/posts")
        }
      }

      fetchCampaign()
    } else {
      router.push("/posts")
    }
  }, [campaignId, isAuthenticated, posts, router, toast])

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target
    setCardDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate amount
      const donationAmount = Number.parseFloat(amount)
      if (isNaN(donationAmount) || donationAmount <= 0) {
        throw new Error("Please enter a valid donation amount")
      }

      // Validate payment details
      if (paymentMethod === "card") {
        if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
          throw new Error("Please fill in all card details")
        }
      } else if (paymentMethod === "upi") {
        if (!upiId) {
          throw new Error("Please enter your UPI ID")
        }
      }

      // In a real app, this would integrate with Stripe/Razorpay
      // For demo purposes, we'll simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create donation record
      const newDonation = await api.donations.createDonation({
        amount: donationAmount,
        donorId: user?.id || "",
        donorName: user?.name || "",
        campaignId: campaign.id,
        campaignName: campaign.title,
        paymentMethod,
      })

      // Generate receipt PDF
      const receiptData = {
        donationId: newDonation.id,
        donorName: user?.name || "",
        donorEmail: user?.email || "",
        campaignName: campaign.title,
        amount: donationAmount,
        date: new Date().toISOString(),
        transactionId: newDonation.transactionId || "",
        paymentMethod,
      }

      const receiptUrl = await generateDonationReceipt(receiptData)
      setReceiptUrl(receiptUrl)

      // Update donation with receipt URL
      const updatedDonation = {
        ...newDonation,
        receiptUrl,
      }

      dispatch(addDonation(updatedDonation))

      setIsSuccess(true)

      toast({
        title: "Donation successful",
        description: `Thank you for your donation of ₹${donationAmount.toLocaleString()} to ${campaign.title}!`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Donation failed",
        description: error.message || "Something went wrong. Please try again.",
      })
      setIsLoading(false)
    }
  }

  const handleViewDashboard = () => {
    router.push("/dashboard/donor")
  }

  if (!campaign && !isSuccess) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center h-64">
          <p>Loading campaign details...</p>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="container py-10">
        <div className="max-w-md mx-auto text-center">
          <div className="rounded-full bg-green-100 p-6 mx-auto w-24 h-24 flex items-center justify-center mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Thank You for Your Donation!</h1>
          <p className="text-muted-foreground mb-6">
            Your donation of ₹{Number.parseFloat(amount).toLocaleString()} to {campaign.title} has been successfully
            processed.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Donation Receipt</CardTitle>
              <CardDescription>Your donation details and receipt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Amount:</div>
                <div className="text-right">₹{Number.parseFloat(amount).toLocaleString()}</div>

                <div className="font-medium">Campaign:</div>
                <div className="text-right">{campaign.title}</div>

                <div className="font-medium">Date:</div>
                <div className="text-right">{new Date().toLocaleDateString()}</div>

                <div className="font-medium">Payment Method:</div>
                <div className="text-right capitalize">{paymentMethod}</div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full" onClick={() => window.open(receiptUrl || "", "_blank")}>
                  {/* <Download className="mr-2 h-4 w-4" /> */}
                  Download Receipt
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full shadow-md hover:shadow-lg transition-shadow" onClick={handleViewDashboard}>
                View Your Donations
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/posts">Browse More Campaigns</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link href="/posts">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Make a Donation</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>You are donating to the following campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">{campaign.title}</h3>
              <p className="text-sm text-muted-foreground">by {campaign.creatorName}</p>
            </div>
            <p className="text-sm">{campaign.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>₹{campaign.raised.toLocaleString()} raised</span>
                <span className="font-medium">₹{campaign.goal.toLocaleString()}</span>
              </div>
              <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {Math.round((campaign.raised / campaign.goal) * 100)}% of goal
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Donation Details</CardTitle>
              <CardDescription>Enter your donation amount and payment method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">
                  Donation Amount (₹) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount in INR"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Payment Method <span className="text-red-500">*</span>
                </Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center cursor-pointer flex-1">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="cursor-pointer flex-1">
                      UPI
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                    <RadioGroupItem value="netbanking" id="netbanking" />
                    <Label htmlFor="netbanking" className="cursor-pointer flex-1">
                      Net Banking
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-4 pt-2 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">
                      Card Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={handleCardDetailsChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">
                        Expiry Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="expiry"
                        name="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={handleCardDetailsChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">
                        CVV <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={handleCardDetailsChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Name on Card <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      defaultValue={user?.name || ""}
                      value={cardDetails.name}
                      onChange={handleCardDetailsChange}
                      required
                    />
                  </div>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div className="space-y-2 pt-2 border-t">
                  <Label htmlFor="upiId">
                    UPI ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="upiId"
                    placeholder="name@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                </div>
              )}

              {paymentMethod === "netbanking" && (
                <div className="space-y-4 pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    You will be redirected to your bank&#39;s website to complete the payment.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank"].map((bank) => (
                      <div key={bank} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                        <RadioGroupItem
                          value={bank.toLowerCase().replace(" ", "")}
                          id={bank.toLowerCase().replace(" ", "")}
                          name="bank"
                        />
                        <Label htmlFor={bank.toLowerCase().replace(" ", "")} className="cursor-pointer">
                          {bank}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" asChild>
                <Link href="/posts">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isLoading} className="shadow-md hover:shadow-lg transition-shadow">
                {isLoading ? "Processing..." : `Donate ₹${amount || "0"}`}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

