"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackgroundAnimation from "@/components/background-animation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getManageCampaigns, deleteRequest } from "@/lib/api"
import { ChevronLeft, MoreVertical, Edit, Trash2, Eye, Plus } from "lucide-react"

export default function ManageRequestsPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [requests, setRequests] = useState([])
    const [activeRequests, setActiveRequests] = useState([])
    const [completedRequests, setCompletedRequests] = useState([])
    const [userType, setUserType] = useState(null)
    const [deleteRequestId, setDeleteRequestId] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setIsLoading(true)
                const storedUserType = localStorage.getItem("userType")
                setUserType(storedUserType)

                // Only receivers can manage requests
                if (storedUserType !== "ngo") {
                    router.push("/dashboard")
                    return
                }

                const dashboardData = await getManageCampaigns()
                console.log(dashboardData)

                if (dashboardData) {
                    setRequests(dashboardData)
                    setActiveRequests(dashboardData?.filter((req) => req.status === "active"))
                    setCompletedRequests(dashboardData?.filter((req) => req.status === "completed"))
                }
            } catch (err) {
                setError("Failed to load your requests. Please try again later.")
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchRequests()
    }, [router])

    const handleDeleteRequest = async () => {
        if (!deleteRequestId) return

        try {
            setIsDeleting(true)
            await deleteRequest(deleteRequestId)

            // Remove the deleted request from the state
            const updatedRequests = requests.filter((req) => req.id !== deleteRequestId)
            setRequests(updatedRequests)
            setActiveRequests(updatedRequests.filter((req) => req.status === "active"))
            setCompletedRequests(updatedRequests.filter((req) => req.status === "completed"))

            setDeleteRequestId(null)
        } catch (err) {
            setError("Failed to delete request. Please try again.")
            console.error(err)
        } finally {
            setIsDeleting(false)
        }
    }

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "short", day: "numeric" }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    const calculateProgress = (raised, goal) => {
        return Math.min(Math.round((raised / goal) * 100), 100)
    }

    const getStatusBadge = (status, daysLeft) => {
        if (status === "completed") {
            return <Badge className="bg-green-500">Completed</Badge>
        } else if (daysLeft <= 3) {
            return <Badge className="bg-red-500">Urgent</Badge>
        } else {
            return <Badge className="bg-blue-500">Active</Badge>
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <BackgroundAnimation />
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center mb-6">
                            <Button variant="ghost" onClick={() => router.back()} className="mr-4">
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                            <h1 className="text-3xl font-bold">Manage Your Requests</h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-64 bg-gray-200 rounded-lg"></div>
                                </div>
                            ))}
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
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <Button variant="ghost" onClick={() => router.back()} className="mr-4">
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                            <h1 className="text-3xl font-bold">Manage Your Requests</h1>
                        </div>
                        <Link href="/campaigns/create">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Create New Request
                            </Button>
                        </Link>
                    </div>

                    {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>}

                    {requests.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                            <h2 className="text-2xl font-bold mb-2">No Requests Found</h2>
                            <p className="text-gray-600 mb-6">You haven't created any donation requests yet.</p>
                            <Link href="/campaigns/create">
                                <Button>Create Your First Request</Button>
                            </Link>
                        </div>
                    ) : (
                        <Tabs defaultValue="active" className="w-full">
                            <TabsList className="mb-6">
                                <TabsTrigger value="active">Active Requests ({activeRequests.length})</TabsTrigger>
                                <TabsTrigger value="completed">Completed Requests ({completedRequests.length})</TabsTrigger>
                                <TabsTrigger value="all">All Requests ({requests.length})</TabsTrigger>
                            </TabsList>

                            <TabsContent value="active">
                                {activeRequests.length === 0 ? (
                                    <div className="text-center py-8 bg-white rounded-lg shadow-sm border">
                                        <p className="text-gray-600">You don't have any active requests.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {activeRequests.map((request) => (
                                            <RequestCard
                                                key={request.id}
                                                request={request}
                                                setDeleteRequestId={setDeleteRequestId}
                                                formatDate={formatDate}
                                                calculateProgress={calculateProgress}
                                                getStatusBadge={getStatusBadge}
                                            />
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="completed">
                                {completedRequests.length === 0 ? (
                                    <div className="text-center py-8 bg-white rounded-lg shadow-sm border">
                                        <p className="text-gray-600">You don't have any completed requests.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {completedRequests.map((request) => (
                                            <RequestCard
                                                key={request.id}
                                                request={request}
                                                setDeleteRequestId={setDeleteRequestId}
                                                formatDate={formatDate}
                                                calculateProgress={calculateProgress}
                                                getStatusBadge={getStatusBadge}
                                            />
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="all">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {requests.map((request) => (
                                        <RequestCard
                                            key={request.id}
                                            request={request}
                                            setDeleteRequestId={setDeleteRequestId}
                                            formatDate={formatDate}
                                            calculateProgress={calculateProgress}
                                            getStatusBadge={getStatusBadge}
                                        />
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}
                </div>
            </main>
            <Footer />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteRequestId} onOpenChange={() => !isDeleting && setDeleteRequestId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your request and remove it from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteRequest}
                            disabled={isDeleting}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

function RequestCard({ request, setDeleteRequestId, formatDate, calculateProgress, getStatusBadge }) {
    const progress = calculateProgress(request.raised, request.goal)

    return (
        <Card className="overflow-hidden">
            <div className="h-40 bg-gray-200 relative">
                <img
                    src={request.image || "/placeholder.svg?height=160&width=384"}
                    alt={request.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">{getStatusBadge(request.status, request.daysLeft)}</div>
            </div>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-1">{request.title}</CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={`/campaigns/${request._id}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                </Link>
                            </DropdownMenuItem>
                            {request.status === "active" && (
                                <DropdownMenuItem asChild>
                                    <Link href={`/campaigns/${request._id}/edit`}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => setDeleteRequestId(request.id)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <CardDescription className="line-clamp-2">{request.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>
                            ${request.raised.toLocaleString()} raised of ${request.goal.toLocaleString()}
                        </span>
                        <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
            </CardContent>
            <CardFooter className="pt-0 flex justify-between text-sm text-gray-500">
                <span>
                    {request.status === "active"
                        ? `${Math.max(0, Math.ceil(request.duration - (new Date() - new Date(request.createdAt)) / (1000 * 60 * 60 * 24)))} days left`
                        : `Completed on ${formatDate(request.endDate || new Date())}`}
                </span>
                <span>{request.donorsCount || 0} donors</span>
            </CardFooter>
        </Card>
    )
}