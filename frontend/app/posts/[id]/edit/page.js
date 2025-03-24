"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackgroundAnimation from "@/components/background-animation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getPostById, updatePost } from "@/lib/api"
import { AlertCircle, ImageIcon, ArrowLeft } from "lucide-react"

export default function EditPostPage() {
    const router = useRouter()
    const params = useParams()
    const postId = params.id

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState("")
    const [post, setPost] = useState(null)
    const [postData, setPostData] = useState({
        title: "",
        content: "",
        category: "",
        image: null,
        imagePreview: null,
    })

    useEffect(() => {
        // Check if user is logged in and has appropriate role
        const token = localStorage.getItem("token")
        const userType = localStorage.getItem("userType")
        const userId = localStorage.getItem("userId")

        if (!token) {
            router.push("/auth/login")
            return
        }

        const fetchPost = async () => {
            try {
                const data = await getPostById(postId)

                // Check if user has permission to edit
                if (userType !== "admin" && userId !== data.author.id) {
                    router.push(`/posts/${postId}`)
                    return
                }

                setPost(data)
                setPostData({
                    title: data.title,
                    content: data.content,
                    category: data.category,
                    image: null,
                    imagePreview: data.imageUrl,
                })
            } catch (err) {
                setError("Failed to load post. It may have been removed or you don't have permission to edit it.")
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPost()
    }, [postId, router])

    const handleChange = (e) => {
        const { name, value, files } = e.target

        if (name === "image" && files && files[0]) {
            const file = files[0]
            const reader = new FileReader()

            reader.onloadend = () => {
                setPostData({
                    ...postData,
                    image: file,
                    imagePreview: reader.result,
                })
            }

            reader.readAsDataURL(file)
        } else {
            setPostData({
                ...postData,
                [name]: value,
            })
        }
    }

    const handleCategoryChange = (value) => {
        setPostData({
            ...postData,
            category: value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        setError("")

        try {
            // Create FormData for file upload
            const formData = new FormData()
            formData.append("title", postData.title)
            formData.append("content", postData.content)
            formData.append("category", postData.category)

            if (postData.image) {
                formData.append("image", postData.image)
            }

            await updatePost(postId, formData)
            router.push(`/posts/${postId}`)
        } catch (err) {
            setError(err.message || "Failed to update post. Please try again.")
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <BackgroundAnimation />
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-lg shadow-md border p-8 text-center">
                            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <Button onClick={() => router.push("/posts")} className="bg-blue-600 hover:bg-blue-700 text-white">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Posts
                            </Button>
                        </div>
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
                    <div className="mb-6 flex items-center">
                        <Link href={`/posts/${postId}`} className="inline-flex items-center text-blue-600 hover:text-blue-800">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Post
                        </Link>
                    </div>

                    <h1 className="text-3xl font-bold mb-6">Edit Post</h1>

                    {error && (
                        <Alert className="mb-6 bg-red-50 border-red-200">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <AlertDescription className="text-red-700">{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="bg-white rounded-lg shadow-md border p-6">
                        {/* Add breadcrumb navigation */}
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
                                            <Link href="/posts" className="text-gray-700 hover:text-blue-600 inline-flex items-center">
                                                Posts
                                            </Link>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <span className="mx-2 text-gray-400">/</span>
                                            <Link
                                                href={`/posts/${postId}`}
                                                className="text-gray-700 hover:text-blue-600 inline-flex items-center"
                                            >
                                                Post Details
                                            </Link>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <span className="mx-2 text-gray-400">/</span>
                                            <span className="text-gray-500">Edit Post</span>
                                        </div>
                                    </li>
                                </ol>
                            </nav>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Post Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={postData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter a descriptive title"
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={postData.category} onValueChange={handleCategoryChange} required>
                                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="news">News</SelectItem>
                                        <SelectItem value="event">Event</SelectItem>
                                        <SelectItem value="success-story">Success Story</SelectItem>
                                        <SelectItem value="announcement">Announcement</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea
                                    id="content"
                                    name="content"
                                    value={postData.content}
                                    onChange={handleChange}
                                    required
                                    rows={10}
                                    placeholder="Write your post content here..."
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Featured Image (Optional)</Label>
                                <div className="flex items-center gap-4">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 2MB)</p>
                                        </div>
                                        <input
                                            id="image"
                                            name="image"
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg"
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                    </label>

                                    {postData.imagePreview && (
                                        <div className="relative h-32 w-32 border rounded-lg overflow-hidden">
                                            <img
                                                src={postData.imagePreview || "/placeholder.svg"}
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setPostData({ ...postData, image: null, imagePreview: null })}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push(`/posts/${postId}`)}
                                    className="border-gray-300"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isSaving}>
                                    {isSaving ? "Saving..." : "Save Changes"}
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

