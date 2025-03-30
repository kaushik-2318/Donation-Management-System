"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackgroundAnimation from "@/components/background-animation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Upload, AlertCircle, CheckCircle, Loader2, ImageIcon, FileText, Trash2 } from "lucide-react"
import Link from "next/link"

export default function EditCampaignPage({ params }) {
    const router = useRouter()
    const { id } = params

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [activeTab, setActiveTab] = useState("basic")
    const [campaignData, setCampaignData] = useState({
        title: "",
        description: "",
        target_amount: "",
        end_date: "",
        category: "",
        location: "",
        featured_image: null,
        updates: [],
        proof_documents: [],
    })
    const [newUpdate, setNewUpdate] = useState({ title: "", content: "" })
    const [newProofDocument, setNewProofDocument] = useState({ title: "", file: null })

    // Categories for campaigns
    const categories = [
        "Education",
        "Healthcare",
        "Environment",
        "Disaster Relief",
        "Poverty Alleviation",
        "Animal Welfare",
        "Arts & Culture",
        "Children & Youth",
        "Community Development",
        "Women Empowerment",
        "Others",
    ]

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem("token")
        const userType = localStorage.getItem("userType")

        if (!token) {
            router.push("/auth/login")
            return
        }

        if (userType !== "ngo") {
            router.push("/dashboard")
            return
        }

        // Fetch campaign data
        const fetchCampaignData = async () => {
            try {
                // In a real app, this would be an API call
                // Simulating API response for demo
                await new Promise((resolve) => setTimeout(resolve, 800))
                setCampaignData({
                    title: "Education for Rural Children",
                    description:
                        "Support education for underprivileged children in rural areas by providing books, stationery, and school uniforms.",
                    target_amount: "500000",
                    end_date: "2024-12-31",
                    category: "Education",
                    location: "Rural districts of Maharashtra",
                    featured_image: null,
                    updates: [
                        {
                            id: 1,
                            title: "First batch of supplies delivered",
                            content:
                                "We have successfully delivered the first batch of books and stationery to 5 schools in the region.",
                            date: new Date().toISOString(),
                        },
                    ],
                    proof_documents: [
                        {
                            id: 1,
                            title: "Budget Breakdown",
                            file_url: "https://example.com/budget.pdf",
                        },
                    ],
                })
            } catch (err) {
                setError("Failed to load campaign data")
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCampaignData()
    }, [id, router])

    const handleChange = (e) => {
        const { name, value, type, files } = e.target
        if (type === "file") {
            setCampaignData({
                ...campaignData,
                [name]: files[0],
            })
        } else {
            setCampaignData({
                ...campaignData,
                [name]: value,
            })
        }
    }

    const handleSelectChange = (name, value) => {
        setCampaignData({
            ...campaignData,
            [name]: value,
        })
    }

    const handleUpdateChange = (e) => {
        const { name, value } = e.target
        setNewUpdate({
            ...newUpdate,
            [name]: value,
        })
    }

    const handleAddUpdate = () => {
        if (newUpdate.title.trim() === "" || newUpdate.content.trim() === "") {
            return
        }

        setCampaignData({
            ...campaignData,
            updates: [
                ...campaignData.updates,
                {
                    id: Date.now(),
                    title: newUpdate.title,
                    content: newUpdate.content,
                    date: new Date().toISOString(),
                },
            ],
        })

        setNewUpdate({ title: "", content: "" })
    }

    const handleRemoveUpdate = (id) => {
        setCampaignData({
            ...campaignData,
            updates: campaignData.updates.filter((update) => update.id !== id),
        })
    }

    const handleProofDocumentChange = (e) => {
        const { name, value, type, files } = e.target
        if (type === "file") {
            setNewProofDocument({
                ...newProofDocument,
                file: files[0],
            })
        } else {
            setNewProofDocument({
                ...newProofDocument,
                [name]: value,
            })
        }
    }

    const handleAddProofDocument = () => {
        if (newProofDocument.title.trim() === "" || !newProofDocument.file) {
            return
        }

        setCampaignData({
            ...campaignData,
            proof_documents: [
                ...campaignData.proof_documents,
                {
                    id: Date.now(),
                    title: newProofDocument.title,
                    file_url: URL.createObjectURL(newProofDocument.file),
                    file: newProofDocument.file,
                },
            ],
        })

        setNewProofDocument({ title: "", file: null })
    }

    const handleRemoveProofDocument = (id) => {
        setCampaignData({
            ...campaignData,
            proof_documents: campaignData.proof_documents.filter((doc) => doc.id !== id),
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        setError("")
        setSuccess("")

        try {
            // This would be an API call in a real app
            await new Promise((resolve) => setTimeout(resolve, 1500))
            setSuccess("Campaign updated successfully!")
            setTimeout(() => {
                router.push(`/campaigns/${id}`)
            }, 2000)
        } catch (err) {
            setError(err.message || "Failed to update campaign")
        } finally {
            setIsSaving(false)
        }
    }

    const confirmCancel = () => {
        if (window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
            router.push(`/campaigns/${id}`)
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <BackgroundAnimation />
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6">Edit Campaign</h1>

                    <div className="mb-6">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                <li className="inline-flex items-center">
                                    <Link href="/" className="text-gray-700 hover:text-blue-600 inline-flex items-center">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <span className="mx-2 text-gray-400">/</span>
                                        <Link href="/campaigns" className="text-gray-700 hover:text-blue-600 inline-flex items-center">
                                            Campaigns
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <span className="mx-2 text-gray-400">/</span>
                                        <Link
                                            href={`/campaigns/${id}`}
                                            className="text-gray-700 hover:text-blue-600 inline-flex items-center"
                                        >
                                            {isLoading ? "Campaign" : campaignData.title}
                                        </Link>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <span className="mx-2 text-gray-400">/</span>
                                        <span className="text-gray-500">Edit</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>

                    {error && (
                        <Alert className="mb-6 bg-red-50 border-red-200">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <AlertDescription className="text-red-700">{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert className="mb-6 bg-green-50 border-green-200">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <AlertDescription className="text-green-700">{success}</AlertDescription>
                        </Alert>
                    )}

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <form onSubmit={handleSubmit}>
                                <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    <div className="border-b">
                                        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                                            <TabsTrigger
                                                value="basic"
                                                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                                            >
                                                Basic Information
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="details"
                                                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                                            >
                                                Details
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="updates"
                                                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                                            >
                                                Updates
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="documents"
                                                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                                            >
                                                Proof Documents
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <TabsContent value="basic" className="p-6 space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Campaign Title</Label>
                                            <Input
                                                id="title"
                                                name="title"
                                                value={campaignData.title}
                                                onChange={handleChange}
                                                required
                                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">Campaign Description</Label>
                                            <Textarea
                                                id="description"
                                                name="description"
                                                value={campaignData.description}
                                                onChange={handleChange}
                                                rows={5}
                                                required
                                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="target_amount">Target Amount (₹)</Label>
                                                <Input
                                                    id="target_amount"
                                                    name="target_amount"
                                                    type="number"
                                                    value={campaignData.target_amount}
                                                    onChange={handleChange}
                                                    min="1"
                                                    required
                                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="end_date">End Date</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="end_date"
                                                        name="end_date"
                                                        type="date"
                                                        value={campaignData.end_date}
                                                        onChange={handleChange}
                                                        required
                                                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="details" className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="category">Category</Label>
                                                <Select
                                                    value={campaignData.category}
                                                    onValueChange={(value) => handleSelectChange("category", value)}
                                                >
                                                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map((category) => (
                                                            <SelectItem key={category} value={category}>
                                                                {category}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="location">Location</Label>
                                                <Input
                                                    id="location"
                                                    name="location"
                                                    value={campaignData.location}
                                                    onChange={handleChange}
                                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="featured_image">Featured Image</Label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                                                {campaignData.featured_image ? (
                                                    <div className="space-y-4 w-full">
                                                        <div className="w-full h-40 bg-gray-50 rounded-md overflow-hidden relative">
                                                            <img
                                                                src={URL.createObjectURL(campaignData.featured_image) || "/placeholder.svg"}
                                                                alt="Campaign preview"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm text-gray-500">{campaignData.featured_image.name}</span>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setCampaignData({ ...campaignData, featured_image: null })}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-1" />
                                                                Remove
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                                                        <div className="space-y-2 text-center">
                                                            <p className="text-sm text-gray-500">Drag and drop or click to upload</p>
                                                            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="mt-4"
                                                            onClick={() => document.getElementById("featured_image").click()}
                                                        >
                                                            <Upload className="h-4 w-4 mr-2" />
                                                            Upload image
                                                        </Button>
                                                    </>
                                                )}
                                                <input
                                                    id="featured_image"
                                                    name="featured_image"
                                                    type="file"
                                                    onChange={handleChange}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="updates" className="p-6 space-y-6">
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium">Campaign Updates</h3>
                                            <p className="text-sm text-gray-500">
                                                Keep your donors informed about the progress of your campaign.
                                            </p>

                                            {campaignData.updates.length > 0 && (
                                                <div className="space-y-4 mb-6">
                                                    {campaignData.updates.map((update) => (
                                                        <Card key={update.id} className="border border-gray-200">
                                                            <CardHeader className="pb-2">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <CardTitle className="text-lg font-medium">{update.title}</CardTitle>
                                                                        <CardDescription className="text-sm text-gray-500">
                                                                            {new Date(update.date).toLocaleDateString("en-US", {
                                                                                year: "numeric",
                                                                                month: "long",
                                                                                day: "numeric",
                                                                            })}
                                                                        </CardDescription>
                                                                    </div>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleRemoveUpdate(update.id)}
                                                                        className="text-red-500 hover:text-red-700 p-0 h-auto"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </CardHeader>
                                                            <CardContent>
                                                                <p className="text-gray-600">{update.content}</p>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="border-t pt-6">
                                                <h4 className="text-md font-medium mb-4">Add New Update</h4>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="update_title">Update Title</Label>
                                                        <Input
                                                            id="update_title"
                                                            name="title"
                                                            value={newUpdate.title}
                                                            onChange={handleUpdateChange}
                                                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="update_content">Update Content</Label>
                                                        <Textarea
                                                            id="update_content"
                                                            name="content"
                                                            value={newUpdate.content}
                                                            onChange={handleUpdateChange}
                                                            rows={3}
                                                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        onClick={handleAddUpdate}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                                        disabled={!newUpdate.title || !newUpdate.content}
                                                    >
                                                        Add Update
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="documents" className="p-6 space-y-6">
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium">Proof Documents</h3>
                                            <p className="text-sm text-gray-500">
                                                Upload documents to provide transparency and build trust with donors.
                                            </p>

                                            {campaignData.proof_documents.length > 0 && (
                                                <div className="space-y-4 mb-6">
                                                    {campaignData.proof_documents.map((doc) => (
                                                        <Card key={doc.id} className="border border-gray-200">
                                                            <CardHeader className="pb-2">
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex items-center">
                                                                        <FileText className="h-5 w-5 text-blue-500 mr-2" />
                                                                        <div>
                                                                            <CardTitle className="text-md font-medium">{doc.title}</CardTitle>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex space-x-2">
                                                                        <Button
                                                                            type="button"
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="text-blue-500 hover:text-blue-700"
                                                                            onClick={() => window.open(doc.file_url, "_blank")}
                                                                        >
                                                                            View
                                                                        </Button>
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => handleRemoveProofDocument(doc.id)}
                                                                            className="text-red-500 hover:text-red-700 p-0 h-auto"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </CardHeader>
                                                        </Card>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="border-t pt-6">
                                                <h4 className="text-md font-medium mb-4">Add New Document</h4>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="doc_title">Document Title</Label>
                                                        <Input
                                                            id="doc_title"
                                                            name="title"
                                                            value={newProofDocument.title}
                                                            onChange={handleProofDocumentChange}
                                                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="doc_file">Document File</Label>
                                                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center">
                                                            {newProofDocument.file ? (
                                                                <div className="space-y-2 w-full">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center">
                                                                            <FileText className="h-5 w-5 text-blue-500 mr-2" />
                                                                            <span className="text-sm">{newProofDocument.file.name}</span>
                                                                        </div>
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => setNewProofDocument({ ...newProofDocument, file: null })}
                                                                            className="text-red-500 hover:text-red-700"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <FileText className="h-10 w-10 text-gray-400 mb-2" />
                                                                    <p className="text-sm text-gray-500">Click to upload a document</p>
                                                                    <input
                                                                        id="doc_file"
                                                                        name="file"
                                                                        type="file"
                                                                        onChange={handleProofDocumentChange}
                                                                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                                                                        className="hidden"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="mt-2"
                                                                        onClick={() => document.getElementById("doc_file").click()}
                                                                    >
                                                                        <Upload className="h-4 w-4 mr-2" />
                                                                        Upload file
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        onClick={handleAddProofDocument}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                                        disabled={!newProofDocument.title || !newProofDocument.file}
                                                    >
                                                        Add Document
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <div className="p-6 border-t flex justify-end space-x-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={confirmCancel}
                                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isSaving}>
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}

