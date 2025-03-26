"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { getRequestById, updateRequest } from "@/lib/api"
import BackgroundAnimation from "@/components/background-animation"
import { ChevronLeft, AlertTriangle } from "lucide-react"

export default function EditRequestPage() {
    const router = useRouter()
    const params = useParams()
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        goal: "",
        endDate: "",
        category: "",
        image: null,
        proofDocuments: "",
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [isOwner, setIsOwner] = useState(false)

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                setIsLoading(true)
                const data = await getRequestById(params.id)

                // For demo purposes, create mock data if the API doesn't return any
                const requestData = data || {
                    id: params.id,
                    title: "Medical Treatment for Sarah",
                    description:
                        "My daughter Sarah needs urgent medical treatment for a rare condition that affects her immune system. The treatment is not covered by our insurance and is very expensive.",
                    category: "medical",
                    goal: 5000,
                    endDate: "2023-12-30",
                    proofDocuments: "https://drive.google.com/file/d/1234567890/view",
                    createdBy: {
                        id: "user123",
                    },
                }

                // Format the date for the input field (YYYY-MM-DD)
                const formattedDate = new Date(requestData.endDate).toISOString().split("T")[0]

                setFormData({
                    title: requestData.title,
                    description: requestData.description,
                    goal: requestData.goal,
                    endDate: formattedDate,
                    category: requestData.category,
                    image: null, // Can't pre-fill file inputs
                    proofDocuments: requestData.proofDocuments || "",
                })

                // Check if current user is the owner
                const userId = localStorage.getItem("userId")
                const isOwner = userId === requestData.createdBy.id
                setIsOwner(isOwner)

                // If not the owner, redirect to the request page
                if (!isOwner) {
                    router.push(`/requests/${params.id}`)
                }
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
    }, [params.id, router])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleFileChange = (e) => {
        const { name, files } = e.target
        if (name === "image") {
            setFormData({
                ...formData,
                image: files[0],
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError("")

        try {
            // Validate form data
            if (!formData.title.trim()) {
                throw new Error("Request title is required")
            }
            if (!formData.description.trim()) {
                throw new Error("Request description is required")
            }
            if (!formData.goal || isNaN(formData.goal) || Number.parseFloat(formData.goal) <= 0) {
                throw new Error("Please enter a valid fundraising goal")
            }
            if (!formData.endDate) {
                throw new Error("End date is required")
            }
            if (!formData.category) {
                throw new Error("Category is required")
            }
            if (!formData.proofDocuments.trim()) {
                throw new Error("Please provide proof document links")
            }

            // Update request API call
            await updateRequest(params.id, formData)

            // Redirect to request page
            router.push(`/requests/${params.id}`)
        } catch (err) {
            setError(err.message || "Failed to update request. Please try again.")
            console.error(err)
        } finally {
            setIsSubmitting(false)
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
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (!isOwner) {
        return (
            <div className="min-h-screen flex flex-col">
                <BackgroundAnimation />
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                        <p className="text-gray-600 mb-6">You don't have permission to edit this request.</p>
                        <Link href={`/requests/${params.id}`}>
                            <Button>View Request</Button>
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
                <div className="max-w-3xl mx-auto">
                    <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>

                    <h1 className="text-3xl font-bold mb-6">Edit Donation Request</h1>

                    {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>}

                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Request Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter a clear, descriptive title"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Explain your situation and why you need help"
                                    rows={6}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="goal">Amount Needed ($)</Label>
                                    <Input
                                        id="goal"
                                        name="goal"
                                        type="number"
                                        min="1"
                                        step="any"
                                        value={formData.goal}
                                        onChange={handleChange}
                                        placeholder="Enter amount"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input
                                        id="endDate"
                                        name="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    <option value="medical">Medical Treatment</option>
                                    <option value="education">Education</option>
                                    <option value="housing">Housing</option>
                                    <option value="disaster">Disaster Recovery</option>
                                    <option value="emergency">Emergency Assistance</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Image (Optional)</Label>
                                <Input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} />
                                <p className="text-sm text-gray-500">Upload a new image or leave empty to keep the current one.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="proofDocuments">Proof Documents (Drive Links)</Label>
                                <Input
                                    id="proofDocuments"
                                    name="proofDocuments"
                                    type="text"
                                    value={formData.proofDocuments}
                                    onChange={handleChange}
                                    placeholder="Paste your Google Drive sharing links here"
                                    required
                                />
                                <p className="text-sm text-gray-500">
                                    Provide Google Drive links to documents that verify your need (medical bills, school fees, etc.)
                                </p>
                            </div>

                            <div className="pt-4 border-t flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={() => router.back()}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Updating Request..." : "Update Request"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}