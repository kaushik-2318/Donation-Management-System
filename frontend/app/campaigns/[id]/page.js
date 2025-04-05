"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { makeDonation } from "@/lib/api"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Users, Clock, Share2, Download, FileText, ExternalLink } from "lucide-react"
import { jsPDF } from "jspdf"
import { getCampaignById } from "@/lib/api"

export default function CampaignPage() {
  const router = useRouter()
  const params = useParams();

  const [donationAmount, setDonationAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [receiptUrl, setReceiptUrl] = useState("")

  const campaignId = params?.id;
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchCampaign = async () => {
      if (!campaignId) return;
      setIsLoading(true);
      try {
        const response = await getCampaignById(campaignId);
        setCampaign(response.campaign);
      } catch (err) {
        console.error("Error fetching campaign:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId]);


  const generateReceipt = async (donationData) => {
    const doc = new jsPDF()

    doc.setFontSize(12)
    doc.text("Samarthan Kriya", 105, 30, { align: "center" })
    doc.text("KIIT University", 105, 35, { align: "center" })

    doc.setFontSize(20)
    doc.text("Receipt", 105, 20, { align: "center" })


    doc.line(20, 40, 190, 40)

    doc.text(`Receipt No: ${Math.floor(Math.random() * 10000)}`, 20, 50)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60)

    doc.text("Donor Information:", 20, 75)
    doc.text(`Name: ${localStorage.getItem("userName") || "Demo User"}`, 30, 85)
    doc.text(`Email: ${localStorage.getItem("userEmail") || "demo@example.com"}`, 30, 95)

    doc.text("Donation Details:", 20, 110)
    doc.text(`Campaign: ${donationData.campaignTitle}`, 30, 120)
    doc.text(`Amount: ₹${Number(donationData.amount).toLocaleString()}`, 30, 130)
    doc.text(`Payment Method: Credit Card`, 30, 140)

    doc.line(20, 150, 190, 150)

    doc.text("Thank you for your generous donation!", 105, 165, { align: "center" })
    doc.text("This receipt is generated for tax purposes.", 105, 175, { align: "center" })

    const pdfBlob = doc.output("blob")

    // In a real app, this would upload the PDF to UploadThing
    // For demo purposes, we'll just create a URL
    const receiptUrl = URL.createObjectURL(pdfBlob)
    setReceiptUrl(receiptUrl)

    return receiptUrl
  }

  const handleDonation = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    if (!donationAmount || isNaN(donationAmount) || Number.parseFloat(donationAmount) <= 0) {
      setError("Please enter a valid donation amount")
      setIsSubmitting(false)
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push(`/auth/login?returnUrl=/campaigns/${params.id}`)
        return
      }

      const donationData = {
        campaignId: params.id,
        amount: Number.parseFloat(donationAmount),
        campaignTitle: campaign.title,
      }

      await makeDonation(donationData)

      const receiptUrl = await generateReceipt(donationData)

      setSuccess(`Thank you for your donation of ₹${donationAmount}! A receipt has been generated.`)
      setDonationAmount("")
    } catch (err) {
      setError("Failed to process donation. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownloadReceipt = () => {
    if (receiptUrl) {
      window.open(receiptUrl, "_blank")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : campaign ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
                <div className="relative">
                  <Image
                    src={campaign.image || "/placeholder.svg"}
                    alt={campaign.title}
                    width={800}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {Math.max(0, Math.ceil(campaign.duration - (new Date() - new Date(campaign.createdAt)) / (1000 * 60 * 60 * 24)))} days left

                  </div>
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {campaign.category}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {campaign.location}
                    </span>
                  </div>

                  <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
                  <p className="text-gray-600 mb-4">by {campaign.ngo}</p>

                  <p className="text-gray-700 mb-6">{campaign.description}</p>

                  <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {Math.max(0, Math.ceil(campaign.duration - (new Date() - new Date(campaign.createdAt)) / (1000 * 60 * 60 * 24)))} days left
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{campaign.donorsCount} donors</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">₹{campaign.raised} raised</span>
                      <span className="text-gray-500">of ₹{campaign.goal} goal</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${Math.min(100, (campaign.raised / campaign.goal) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 border-blue-600 text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href)
                        alert("Link copied to clipboard!")
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">About This Campaign</h2>
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: campaign.longDescription }} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Proof & Documentation</h2>
                  {Array.isArray(campaign?.proofDocuments) && campaign?.proofDocuments?.length > 0 ? (
                    <ul className="space-y-2">
                      {campaign?.proofDocuments?.map((doc) => (
                        <li key={doc._id}>
                          <Link href={doc.link} className="text-blue-600 hover:underline flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>{doc.title}</span>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No documents available.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden sticky top-8">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Make a Donation</h2>

                  {success && (
                    <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
                      {success}
                      {receiptUrl && (
                        <div className="mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full flex items-center justify-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
                            onClick={handleDownloadReceipt}
                          >
                            <Download className="h-4 w-4" />
                            Download Receipt
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>}

                  <form onSubmit={handleDonation} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                        Donation Amount (₹)
                      </label>
                      <Input
                        id="amount"
                        type="number"
                        min="1"
                        step="any"
                        placeholder="Enter amount"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {[100, 500, 1000, 5000, 10000].map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          onClick={() => setDonationAmount(amount.toString())}
                        >
                          ₹{amount}
                        </Button>
                      ))}
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : "Donate Now"}
                    </Button>
                  </form>

                  <div className="mt-6 text-center text-sm text-gray-500">
                    Your donation is secure and encrypted. By donating, you agree to our Terms of Service and Privacy
                    Policy.
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 text-red-600 p-4 rounded-md">Campaign not found.</div>
        )}
      </main>
      <Footer />
    </div>
  )
}