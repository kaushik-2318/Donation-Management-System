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
import { Plus, Trash2, Link as LinkIcon, AlertCircle } from "lucide-react"

export default function CreateCampaignPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    goal: "",
    duration: "",
    donorsCount: 0,
    category: "",
    location: "",
    proofDocuments: [],
  })
  const [image, setImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [docError, setDocError] = useState("")
  const [newDocument, setNewDocument] = useState({ title: "", link: "" })

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
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleDocumentChange = (e) => {
    const { name, value } = e.target;
    setNewDocument((prev) => ({
      ...prev,
      [name]: value,
    }));
    setDocError(""); // Clear document error when user starts typing
  };

  const addDocument = () => {
    if (!newDocument.title.trim() || !newDocument.link.trim()) {
      setDocError("Please enter both title and link for the document.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      proofDocuments: [...(prev.proofDocuments || []), { ...newDocument }],
    }));

    setNewDocument({ title: "", link: "" });
    setDocError(""); // Clear error after successful addition
  };

  const removeDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      proofDocuments: prev.proofDocuments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setDocError("")

    try {
      if (!formData.title.trim()) throw new Error("Campaign title is required")
      if (!formData.description.trim()) throw new Error("Campaign description is required")
      if (!formData.longDescription.trim()) throw new Error("Detailed description is required")
      if (!formData.goal || isNaN(formData.goal) || Number(formData.goal) <= 0) throw new Error("Invalid fundraising goal")
      if (!formData.duration || isNaN(formData.duration) || Number(formData.duration) <= 0) throw new Error("Invalid duration")
      if (!formData.category) throw new Error("Category is required")
      if (!formData.location.trim()) throw new Error("Location is required")
      if (!formData.proofDocuments.length) {
        setDocError("At least one proof document is required");
        throw new Error("At least one proof document is required");
      }

      // Create a new object with the form data and image
      const campaignData = {
        ...formData,
        // Convert numeric fields to numbers
        goal: Number(formData.goal),
        duration: Number(formData.duration),
        // Only include image if it exists
        ...(image && { image: image })
      };

      console.log("Campaign data before sending:", campaignData);

      // Call your API function with the campaign data
      await createCampaign(campaignData);
      router.push(`/campaigns`);
    } catch (err) {
      setError(err.message || "Failed to create campaign. Please try again.")
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
                  <Label htmlFor="goal">Fundraising Goal (₹)</Label>
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
                  <Label htmlFor="duration">Campaign Duration (Days)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="Enter duration in days"
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
                <Label htmlFor="image">Campaign Image (Optional)</Label>
                <Input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} />
                <p className="text-sm text-gray-500">
                  Upload a high-quality image that represents your campaign. Recommended size: 1200x630 pixels.
                </p>
              </div>

              {/* Proof Documents Section */}
              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Proof Documents</h3>
                  <div className="bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs font-medium">Required</div>
                </div>
                <p className="text-sm text-gray-500">
                  Add links to documents that verify your campaign's legitimacy (Google Drive, Dropbox, etc.)
                </p>

                <div className="space-y-3 bg-gray-50 p-4 rounded-md">
                  {docError && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{docError}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="documentTitle">Document Title</Label>
                    <Input
                      id="documentTitle"
                      name="title"
                      value={newDocument.title}
                      onChange={handleDocumentChange}
                      placeholder="Enter document title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documentLink">Document Link</Label>
                    <div className="flex">
                      <div className="rounded-l-md bg-gray-100 px-3 flex items-center border border-r-0">
                        <LinkIcon className="h-4 w-4 text-gray-500" />
                      </div>
                      <Input
                        id="documentLink"
                        name="link"
                        type="url"
                        value={newDocument.link}
                        onChange={handleDocumentChange}
                        placeholder="https://example.com/document"
                        className="rounded-l-none"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Provide a link to your document (Google Drive, Dropbox, OneDrive, etc.)
                    </p>
                  </div>
                  <Button type="button" variant="outline" onClick={addDocument} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Document
                  </Button>
                </div>

                {formData.proofDocuments.length > 0 ? (
                  <div className="space-y-3 mt-4">
                    <h4 className="font-medium">Added Documents:</h4>
                    <ul className="space-y-2">
                      {formData.proofDocuments.map((doc, index) => (
                        <li key={index} className="flex justify-between items-center bg-blue-50 p-3 rounded-md">
                          <div className="w-full overflow-hidden">
                            <p className="font-medium">{doc.title}</p>
                            <a
                              href={doc.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline truncate block"
                            >
                              {doc.link}
                            </a>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2 flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded text-sm mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>At least one document is required to create a campaign</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || formData.proofDocuments.length === 0}
                >
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