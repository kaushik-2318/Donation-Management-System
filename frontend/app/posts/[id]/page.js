"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackgroundAnimation from "@/components/background-animation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getPostById, deletePost } from "@/lib/api"
import { Calendar, Clock, User, Edit, Trash, ArrowLeft, Share2 } from "lucide-react"

export default function PostDetailPage() {
    const router = useRouter()
    const params = useParams()
    const postId = params.id

    const [isLoading, setIsLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)
    const [post, setPost] = useState(null)
    const [error, setError] = useState("")
    const [userType, setUserType] = useState("")
    const [userId, setUserId] = useState("")

    useEffect(() => {
        const storedUserType = localStorage.getItem("userType")
        const storedUserId = localStorage.getItem("userId")
        setUserType(storedUserType || "")
        setUserId(storedUserId || "")

        const fetchPost = async () => {
            try {
                const data = await getPostById(postId)
                setPost(data)
            } catch (err) {
                setError("Failed to load post. It may have been removed or you don't have permission to view it.")
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPost()
    }, [postId])

    const handleDeletePost = async () => {
        setIsDeleting(true)
        try {
            await deletePost(postId)
            router.push("/posts")
        } catch (err) {
            setError("Failed to delete post. Please try again.")
            setIsDeleting(false)
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const getCategoryColor = (category) => {
        switch (category) {
            case "news":
                return "bg-blue-100 text-blue-800"
            case "event":
                return "bg-green-100 text-green-800"
            case "success-story":
                return "bg-purple-100 text-purple-800"
            case "announcement":
                return "bg-yellow-100 text-yellow-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getCategoryLabel = (category) => {
        switch (category) {
            case "news":
                return "News"
            case "event":
                return "Event"
            case "success-story":
                return "Success Story"
            case "announcement":
                return "Announcement"
            default:
                return "Other"
        }
    }

    const canEditPost = () => {
        if (!post || !userId) return false
        return userType === "admin" || userId === post.author.id
    }

    const handleSharePost = () => {
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: `Check out this post: ${post.title}`,
                url: window.location.href,
            })
        } else {
            // Fallback for browsers that don't support the Web Share API
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
                    <div className="max-w-4xl mx-auto">
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
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-lg shadow-md border p-8 text-center">
                            <h2 className="text-2xl font-bold text-red-600 mb-4">Post Not Found</h2>
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
                <div className="max-w-4xl mx-auto">
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
                                        <span className="text-gray-500">Post Details</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>

                    <div className="flex justify-between items-center">
                        <Link href="/posts" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Posts
                        </Link>

                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleSharePost} className="border-gray-300">
                                <Share2 className="mr-2 h-4 w-4" /> Share
                            </Button>

                            {canEditPost() && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(`/posts/${postId}/edit`)}
                                        className="border-gray-300"
                                    >
                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                                                <Trash className="mr-2 h-4 w-4" /> Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the post and remove it from our
                                                    servers.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={handleDeletePost}
                                                    className="bg-red-600 hover:bg-red-700 text-white"
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting ? "Deleting..." : "Delete"}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </>
                            )}
                        </div>
                    </div>

                    <article className="bg-white rounded-lg shadow-md border overflow-hidden">
                        {post.imageUrl && (
                            <div className="h-80 overflow-hidden">
                                <img
                                    src={post.imageUrl || "/placeholder.svg"}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="p-6 md:p-8">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge className={`${getCategoryColor(post.category)}`}>{getCategoryLabel(post.category)}</Badge>
                            </div>

                            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

                            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6">
                                <div className="flex items-center mr-4">
                                    <Calendar className="mr-1 h-4 w-4" />
                                    {formatDate(post.createdAt)}
                                </div>

                                <div className="flex items-center mr-4">
                                    <Clock className="mr-1 h-4 w-4" />
                                    {new Date(post.createdAt).toLocaleTimeString()}
                                </div>

                                <div className="flex items-center">
                                    <User className="mr-1 h-4 w-4" />
                                    {post.author.name}
                                </div>
                            </div>

                            <div className="prose max-w-none">
                                {post.content.split("\n").map((paragraph, index) => (
                                    <p key={index} className="mb-4">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            {post.updatedAt && post.updatedAt !== post.createdAt && (
                                <div className="mt-8 text-sm text-gray-500 italic">Last updated on {formatDate(post.updatedAt)}</div>
                            )}
                        </div>
                    </article>
                </div>
            </main>
            <Footer />
        </div>
    )
}

