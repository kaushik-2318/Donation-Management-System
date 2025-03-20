"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createCampaign } from "@/lib/api"
import BackgroundAnimation from "@/components/background-animation"

export default function CreateCampaignPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    goal: "",
    endDate: "",
    category: "",
    location: "",
    image: null,
    proofDocuments: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user is logged in and is an NGO
    const token = localStorage.getItem("token")
    const userType = localStorage.getItem("userType")

    if (!token || userType !== "ngo") {
      router.push("/auth/login")
    }
  }, [router])

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
    } else if (name === "proofDocuments") {
      setFormData({
        ...formData,
        proofDocuments: Array.from(files),
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
        throw new Error("Campaign title is required")
      }
      if (!formData.description.trim()) {
        throw new Error("Campaign description is required")
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

      // Create campaign API call
      const response = await createCampaign(formData)

      // Redirect to campaign page
      router.push(`/campaigns/${response.id}`)
    } catch (err) {
      setError(err.message || "Failed to create campaign. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundAnimation />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create a Campaign</h1>

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>}

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title</Label>
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
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Briefly describe your campaign (100-150 words)"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longDescription">Detailed Description</Label>
                <Textarea
                  id="longDescription"
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleChange}
                  placeholder="Provide detailed information about your campaign, its goals, and impact"
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="goal">Fundraising Goal ($)</Label>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <option value="education">Education</option>
                    <option value="health">Healthcare</option>
                    <option value="environment">Environment</option>
                    <option value="disaster">Disaster Relief</option>
                    <option value="water">Water & Sanitation</option>
                    <option value="animals">Animal Welfare</option>
                    <option value="community">Community Development</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Where will this campaign have impact?"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Campaign Image</Label>
                <Input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} required />
                <p className="text-sm text-gray-500">
                  Upload a high-quality image that represents your campaign. Recommended size: 1200x630 pixels.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="proofDocuments">Proof Documents</Label>
                <Input id="proofDocuments" name="proofDocuments" type="file" multiple onChange={handleFileChange} />
                <p className="text-sm text-gray-500">
                  Upload documents that verify your campaign's legitimacy (permits, licenses, budget plans, etc.)
                </p>
              </div>

              <div className="pt-4 border-t flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
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

