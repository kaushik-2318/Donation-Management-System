"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getRequestById, deleteRequest } from "@/lib/api"
import BackgroundAnimation from "@/components/background-animation"
import {
  Calendar,
  DollarSign,
  User,
  MapPin,
  FileText,
  AlertTriangle,
  ChevronLeft,
  Edit,
  Trash2,
  Share2,
} from "lucide-react"

export default function RequestDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [request, setRequest] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isOwner, setIsOwner] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [donationAmount, setDonationAmount] = useState("")
  const [isDonating, setIsDonating] = useState(false)
  const [donationSuccess, setDonationSuccess] = useState(false)

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setIsLoading(true)

        const data = await getRequestById(params.id)

        const requestData = {
          id: params.id,
          title: data.request.title,
          description: data.request.description,
          category: data.request.category,
          goal: data.request.amountNeeded,
          raised: data.request.currentAmount,
          endDate: data.request.endDate,
          status: data.request.status,
          createdBy: {
            name: data.request.user.full_name,
          },
          createdAt: data.request.createdAt,
          location: data.request.user.address,
          proofDocuments: data.request.proofDocuments,
        }

        console.log(requestData)

        setRequest(requestData)
        const userId = localStorage.getItem("userId")
        setIsOwner(userId === requestData.createdBy.id)

      } catch (err) {
        setError("Failed to load request details. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchRequest()
    }
  }, [params.id])

  const handleDelete = async () => {
    try {
      await deleteRequest(params.id)
      router.push("/requests")
    } catch (err) {
      setError("Failed to delete request. Please try again.")
      console.error(err)
    }
  }

  const handleDonate = async (e) => {
    e.preventDefault()

    if (!donationAmount || isNaN(donationAmount) || Number(donationAmount) <= 0) {
      return
    }

    try {
      setIsDonating(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setDonationSuccess(true)

      // Reset after showing success message
      setTimeout(() => {
        setDonationSuccess(false)
        setDonationAmount("")

        // Update the request with new donation amount
        setRequest((prev) => ({
          ...prev,
          raised: prev.raised + Number(donationAmount),
          donors: [
            {
              id: prev.donors.length + 1,
              name: "You",
              amount: Number(donationAmount),
              date: new Date().toISOString().split("T")[0],
            },
            ...prev.donors,
          ],
        }))
      }, 3000)
    } catch (err) {
      setError("Failed to process donation. Please try again.")
      console.error(err)
    } finally {
      setIsDonating(false)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const calculateDaysLeft = (endDate) => {
    const end = new Date(endDate)
    const today = new Date()
    const diffTime = end - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "completed":
        return <Badge className="bg-blue-500">Completed</Badge>
      case "expired":
        return <Badge className="bg-gray-500">Expired</Badge>
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>
    }
  }

  const shareRequest = () => {
    if (navigator.share) {
      navigator.share({
        title: request.title,
        text: `Please support this donation request: ${request.title}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <BackgroundAnimation />
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
              </div>
              <div>
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <BackgroundAnimation />
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>
          <Button onClick={() => router.back()}>Go Back</Button>
        </main>
        <Footer />
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen flex flex-col">
        <BackgroundAnimation />
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Request Not Found</h2>
            <p className="text-gray-600 mb-6">
              The donation request you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/requests">
              <Button>View All Requests</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundAnimation />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-2">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold">{request.title}</h1>
              <div className="flex items-center mt-2">
                {getStatusBadge(request.status)}
                <span className="text-gray-500 text-sm ml-3">Created {formatDate(request.createdAt)}</span>
              </div>
            </div>
            {isOwner && (
              <div className="flex space-x-2 mt-4 md:mt-0">
                <Button variant="outline" onClick={shareRequest}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Link href={`/requests/${request.id}/edit`}>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Request</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this donation request? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDelete}>
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
              <img
                src={request.image || "/placeholder.svg?height=400&width=800"}
                alt={request.title}
                className="w-full h-64 md:h-96 object-cover"
              />

              <Tabs defaultValue="details" className="p-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="updates">Updates ({request.updates?.length || 0})</TabsTrigger>
                  <TabsTrigger value="donors">Donors ({request.donors?.length || 0})</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">About this request</h3>
                      <p className="text-gray-700 whitespace-pre-line">{request.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <User className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Created by</p>
                          <p className="font-medium">{request.createdBy.name}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{request.location || "Not specified"}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">End date</p>
                          <p className="font-medium">{formatDate(request.endDate)}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <FileText className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Proof documents</p>
                          {request.proofDocuments ? (
                            <a
                              href={request.proofDocuments}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline font-medium"
                            >
                              View documents
                            </a>
                          ) : (
                            <p className="font-medium">Not provided</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="updates">
                  {request.updates && request.updates.length > 0 ? (
                    <div className="space-y-6">
                      {request.updates.map((update) => (
                        <div key={update.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Update from {request.createdBy.name}</h4>
                            <span className="text-sm text-gray-500">{formatDate(update.date)}</span>
                          </div>
                          <p className="text-gray-700">{update.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No updates have been posted yet.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="donors">
                  {request.donors && request.donors.length > 0 ? (
                    <div className="space-y-4">
                      {request.donors.map((donor) => (
                        <div
                          key={donor.id}
                          className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center">
                            <p className="font-medium">{donor.name}</p>
                            <p className="text-sm text-gray-500">{formatDate(donor.date)}</p>
                          </div>
                          <p className="font-semibold">${donor.amount.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No donations have been made yet. Be the first to donate!</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span className="font-medium">{Math.round((request.raised / request.goal) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{ width: `${Math.min(100, Math.round((request.raised / request.goal) * 100))}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div>
                      <p className="text-2xl font-bold">${request.raised.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">raised of ${request.goal.toLocaleString()}</p>
                    </div>
                    {request.status === "active" && (
                      <div className="text-right">
                        <p className="text-2xl font-bold">{calculateDaysLeft(request.endDate)}</p>
                        <p className="text-sm text-gray-500">days left</p>
                      </div>
                    )}
                  </div>
                </div>

                {request.status === "active" ? (
                  <div>
                    <form onSubmit={handleDonate}>
                      <div className="mb-4">
                        <Label htmlFor="amount">Donation Amount ($)</Label>
                        <div className="relative mt-1">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="amount"
                            type="number"
                            min="1"
                            step="any"
                            placeholder="Enter amount"
                            className="pl-10"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full" disabled={isDonating || donationSuccess}>
                        {isDonating ? "Processing..." : donationSuccess ? "Thank you for your donation!" : "Donate Now"}
                      </Button>
                    </form>

                    <div className="mt-4 text-center">
                      <Button variant="ghost" onClick={shareRequest} className="text-sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share this request
                      </Button>
                    </div>
                  </div>
                ) : request.status === "completed" ? (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">Fundraising Goal Reached</h3>
                    <p className="text-blue-600 text-sm">Thank you to everyone who contributed to this request!</p>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">This request has ended</h3>
                    <p className="text-gray-600 text-sm">The fundraising period for this request has expired.</p>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center">
                    <p className="font-medium">{request.createdBy.name}</p>
                    <p className="text-sm text-gray-500">Request Creator</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}