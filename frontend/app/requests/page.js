"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllRequests } from "@/lib/api"
import BackgroundAnimation from "@/components/background-animation"
import { Calendar, Clock, DollarSign, Search, Filter } from "lucide-react"
import Image from "next/image"

export default function RequestsPage() {
    const router = useRouter()
    const [requests, setRequests] = useState([])
    const [filteredRequests, setFilteredRequests] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("")
    const [statusFilter, setStatusFilter] = useState("")

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setIsLoading(true)

                const data = await getAllRequests()
                
                setRequests(data.data)
                setFilteredRequests(data.data)
            } catch (err) {
                setError("Failed to load requests. Please try again later.")
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchRequests()
    }, [])

    useEffect(() => {
        let result = [...requests]

        if (searchTerm) {
            result = result.filter(
                (request) =>
                    request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    request.description.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }

        if (categoryFilter) {
            result = result.filter((request) => request.category === categoryFilter)
        }

        if (statusFilter) {
            result = result.filter((request) => request.status === statusFilter)
        }

        setFilteredRequests(result)
    }, [searchTerm, categoryFilter, statusFilter, requests])

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const handleCategoryChange = (value) => {
        setCategoryFilter(value)
    }

    const handleStatusChange = (value) => {
        setStatusFilter(value)
    }

    const clearFilters = () => {
        setSearchTerm("")
        setCategoryFilter("")
        setStatusFilter("")
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

    return (
        <div className="min-h-screen flex flex-col">
            <BackgroundAnimation />
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Donation Requests</h1>
                        <p className="text-gray-600 mt-1">Browse and support individual donation requests</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Link href="/requests/create">
                            <Button>Create Request</Button>
                        </Link>
                    </div>
                </div>

                {/* Search and filters */}
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search requests..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div>
                            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="medical">Medical</SelectItem>
                                    <SelectItem value="education">Education</SelectItem>
                                    <SelectItem value="housing">Housing</SelectItem>
                                    <SelectItem value="disaster">Disaster</SelectItem>
                                    <SelectItem value="emergency">Emergency</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Select value={statusFilter} onValueChange={handleStatusChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {(searchTerm || categoryFilter || statusFilter) && (
                        <div className="mt-4 flex items-center">
                            <Filter className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm text-gray-500 mr-2">Active filters:</span>
                            {searchTerm && (
                                <Badge variant="outline" className="mr-2">
                                    Search: {searchTerm}
                                </Badge>
                            )}
                            {categoryFilter && (
                                <Badge variant="outline" className="mr-2">
                                    Category: {categoryFilter}
                                </Badge>
                            )}
                            {statusFilter && (
                                <Badge variant="outline" className="mr-2">
                                    Status: {statusFilter}
                                </Badge>
                            )}
                            <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-2 h-7 text-xs">
                                Clear all
                            </Button>
                        </div>
                    )}
                </div>

                {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>}

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <Card key={index} className="animate-pulse">
                                <CardContent className="p-0">
                                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                                    <div className="p-4">
                                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                        <div className="flex justify-between items-center mt-4">
                                            <div className="h-8 bg-gray-200 rounded w-24"></div>
                                            <div className="h-8 bg-gray-200 rounded w-16"></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Search className="h-12 w-12 mx-auto" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">No requests found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                        <Button onClick={clearFilters}>Clear all filters</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRequests.map((request) => (
                            <Link href={`/requests/${request._id}`} key={request._id}>
                                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                                    <div className="h-48 bg-gray-200 relative">
                                        <Image
                                            src={request.image || "/placeholder.svg?height=200&width=400"}
                                            alt={request.title}
                                            className="w-full h-full object-cover"
                                            width={400}
                                            height={200}
                                        />
                                    </div>

                                    <CardContent className="p-4">
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{request.title}</h3>
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{request.description}</p>
                                            </div>
                                            <div>
                                                {getStatusBadge(request.status)}
                                            </div>
                                        </div>

                                        <div className="flex items-center text-sm text-gray-500 mb-3">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            <span>Created: {formatDate(request.createdAt)}</span>
                                        </div>

                                        {request.status === "active" && (
                                            <div className="flex items-center text-sm text-gray-500 mb-3">
                                                <Clock className="h-4 w-4 mr-2" />
                                                <span>{calculateDaysLeft(request.endDate)} days left</span>
                                            </div>
                                        )}

                                        <div className="mt-4">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Progress</span>
                                                <span className="font-medium">{Math.round((request.currentAmount / request.amountNeeded) * 100)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{ width: `${Math.min(100, Math.round((request.currentAmount / request.amountNeeded) * 100))}%` }}
                                                ></div>
                                            </div>
                                            {request.currentAmount !== undefined && request.amountNeeded !== undefined ? (
                                                <div className="flex justify-between mt-2">
                                                    <div className="flex items-center">
                                                        <span className="text-gray-700 font-medium">${request.currentAmount.toLocaleString()}</span>
                                                    </div>
                                                    <span className="text-gray-500">of ${request.amountNeeded.toLocaleString()}</span>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">Funding data not available</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    )
}

