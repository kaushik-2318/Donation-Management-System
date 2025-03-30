"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackgroundAnimation from "@/components/background-animation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    MapPin,
    Phone,
    Mail,
    Globe,
    Calendar,
    Award,
    Building,
    Clock,
    CheckCircle,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Github,
    Heart,
    HandHeart,
} from "lucide-react"
import Link from "next/link"

export default function PublicProfilePage({ params }) {
    const router = useRouter()
    const { type, id } = params

    const [isLoading, setIsLoading] = useState(true)
    const [profileData, setProfileData] = useState(null)
    const [error, setError] = useState("")
    const [activeTab, setActiveTab] = useState("about")

    useEffect(() => {
        if (!["ngo", "donor", "receiver"].includes(type)) {
            router.push("/404")
            return
        }

        const fetchProfileData = async () => {
            try {
                // In a real app, this would be an API call
                // Simulating API response for demo
                await new Promise((resolve) => setTimeout(resolve, 800))

                // Sample profile data based on type
                let data
                if (type === "ngo") {
                    data = {
                        id,
                        full_name: "Care For All Foundation",
                        avatar: null,
                        bio: "We are dedicated to providing education and healthcare services to underprivileged communities across India.",
                        address: "Mumbai, Maharashtra",
                        phone_number: "+91 98765 43210",
                        website: "https://careforall.org",
                        email: "contact@careforall.org",
                        organization_name: "Care For All Foundation",
                        registration_number: "NGO123456",
                        established: "2010-05-15",
                        verified: true,
                        impact: {
                            projects: 35,
                            beneficiaries: 12000,
                            donations_received: 7500000,
                            total_campaigns: 45,
                            active_campaigns: 8,
                        },
                        campaigns: [
                            {
                                id: 1,
                                title: "Education for Rural Children",
                                amount_raised: 250000,
                                target_amount: 500000,
                                end_date: "2024-12-31",
                            },
                            {
                                id: 2,
                                title: "Clean Water Initiative",
                                amount_raised: 180000,
                                target_amount: 300000,
                                end_date: "2024-10-15",
                            },
                        ],
                    }
                } else if (type === "donor") {
                    data = {
                        id,
                        full_name: "Rajesh Sharma",
                        avatar: null,
                        bio: "Passionate about supporting education initiatives and empowering the youth of our country.",
                        address: "Bangalore, Karnataka",
                        joined: "2021-08-10",
                        impact: {
                            total_donations: 85000,
                            campaigns_supported: 12,
                            ngos_supported: 5,
                        },
                        social_media: {
                            facebook: "https://facebook.com/rajesh",
                            twitter: "https://twitter.com/rajesh",
                            linkedin: "https://linkedin.com/in/rajesh",
                        },
                        recent_donations: [
                            {
                                id: 1,
                                campaign: "Education for Rural Children",
                                ngo: "Care For All Foundation",
                                amount: 15000,
                                date: "2023-12-15",
                            },
                            {
                                id: 2,
                                campaign: "Clean Water Initiative",
                                ngo: "Care For All Foundation",
                                amount: 10000,
                                date: "2023-10-20",
                            },
                        ],
                        badges: [
                            { id: 1, name: "Education Champion", description: "Supported 5+ education campaigns" },
                            { id: 2, name: "Regular Donor", description: "Donated consistently for 2+ years" },
                        ],
                    }
                } else if (type === "receiver") {
                    data = {
                        id,
                        full_name: "Anita Patel",
                        avatar: null,
                        bio: "Single mother of two children seeking support for medical treatment and education.",
                        address: "Pune, Maharashtra",
                        phone_number: "+91 87654 32109",
                        joined: "2022-03-05",
                        verified: true,
                        requests: [
                            {
                                id: 1,
                                title: "Medical Treatment for Son",
                                amount_raised: 80000,
                                target_amount: 150000,
                                end_date: "2024-08-20",
                                status: "Active",
                            },
                        ],
                        social_media: {
                            facebook: "https://facebook.com/anita",
                            instagram: "https://instagram.com/anita",
                        },
                    }
                }

                setProfileData(data)
            } catch (err) {
                setError("Failed to load profile data")
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfileData()
    }, [type, id, router])

    const getUserTypeIcon = () => {
        switch (type) {
            case "ngo":
                return <Building className="h-4 w-4 text-blue-600 mr-1" />
            case "donor":
                return <Heart className="h-4 w-4 text-red-600 mr-1" />
            case "receiver":
                return <HandHeart className="h-4 w-4 text-green-600 mr-1" />
            default:
                return null
        }
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
                                        <span className="text-gray-500">Profile</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : profileData ? (
                        <>
                            {/* Profile Header */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                                <div className="relative">
                                    <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                                    <div className="absolute -bottom-16 left-6">
                                        <Avatar className="h-32 w-32 border-4 border-white bg-white">
                                            <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt={profileData.full_name} />
                                            <AvatarFallback className="bg-blue-100 text-blue-800 text-4xl">
                                                {profileData.full_name ? profileData.full_name.charAt(0).toUpperCase() : "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>

                                <div className="pt-20 pb-6 px-6">
                                    <div className="flex items-center mb-1">
                                        <h1 className="text-2xl font-bold">{profileData.full_name}</h1>
                                        {profileData.verified && (
                                            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-600 border-blue-200">
                                                <CheckCircle className="h-3 w-3 mr-1" /> Verified
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center text-gray-600 mb-4">
                                        {getUserTypeIcon()}
                                        <span className="capitalize">{type}</span>
                                        {profileData.address && (
                                            <>
                                                <span className="mx-2">•</span>
                                                <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                                                <span>{profileData.address}</span>
                                            </>
                                        )}
                                        {profileData.joined && (
                                            <>
                                                <span className="mx-2">•</span>
                                                <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                                                <span>Joined {new Date(profileData.joined).toLocaleDateString()}</span>
                                            </>
                                        )}
                                        {type === "ngo" && profileData.established && (
                                            <>
                                                <span className="mx-2">•</span>
                                                <Clock className="h-4 w-4 text-gray-500 mr-1" />
                                                <span>Est. {new Date(profileData.established).getFullYear()}</span>
                                            </>
                                        )}
                                    </div>

                                    <p className="text-gray-700 mb-6">{profileData.bio}</p>

                                    <div className="flex flex-wrap gap-4">
                                        {profileData.phone_number && (
                                            <Button variant="outline" size="sm" className="text-gray-700">
                                                <Phone className="h-4 w-4 mr-2" />
                                                {profileData.phone_number}
                                            </Button>
                                        )}
                                        {profileData.email && (
                                            <Button variant="outline" size="sm" className="text-gray-700">
                                                <Mail className="h-4 w-4 mr-2" />
                                                {profileData.email}
                                            </Button>
                                        )}
                                        {profileData.website && (
                                            <Button variant="outline" size="sm" className="text-gray-700" asChild>
                                                <Link href={profileData.website} target="_blank" rel="noopener noreferrer">
                                                    <Globe className="h-4 w-4 mr-2" />
                                                    Website
                                                </Link>
                                            </Button>
                                        )}
                                    </div>

                                    {profileData.social_media && (
                                        <div className="flex mt-4 space-x-3">
                                            {profileData.social_media.facebook && (
                                                <a
                                                    href={profileData.social_media.facebook}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <Facebook size={20} />
                                                </a>
                                            )}
                                            {profileData.social_media.twitter && (
                                                <a
                                                    href={profileData.social_media.twitter}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    <Twitter size={20} />
                                                </a>
                                            )}
                                            {profileData.social_media.instagram && (
                                                <a
                                                    href={profileData.social_media.instagram}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-pink-600 hover:text-pink-800"
                                                >
                                                    <Instagram size={20} />
                                                </a>
                                            )}
                                            {profileData.social_media.linkedin && (
                                                <a
                                                    href={profileData.social_media.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-700 hover:text-blue-900"
                                                >
                                                    <Linkedin size={20} />
                                                </a>
                                            )}
                                            {profileData.social_media.github && (
                                                <a
                                                    href={profileData.social_media.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-800 hover:text-gray-900"
                                                >
                                                    <Github size={20} />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Profile Tabs */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    <div className="border-b">
                                        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                                            <TabsTrigger
                                                value="about"
                                                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                                            >
                                                About
                                            </TabsTrigger>

                                            {type === "ngo" && (
                                                <TabsTrigger
                                                    value="campaigns"
                                                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                                                >
                                                    Campaigns
                                                </TabsTrigger>
                                            )}

                                            {type === "donor" && (
                                                <TabsTrigger
                                                    value="donations"
                                                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                                                >
                                                    Donations
                                                </TabsTrigger>
                                            )}

                                            {type === "receiver" && (
                                                <TabsTrigger
                                                    value="requests"
                                                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                                                >
                                                    Requests
                                                </TabsTrigger>
                                            )}

                                            {type === "donor" && profileData.badges && profileData.badges.length > 0 && (
                                                <TabsTrigger
                                                    value="badges"
                                                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                                                >
                                                    Badges
                                                </TabsTrigger>
                                            )}
                                        </TabsList>
                                    </div>

                                    {/* About Tab */}
                                    <TabsContent value="about" className="p-6">
                                        {type === "ngo" && profileData.impact && (
                                            <div className="mb-8">
                                                <h3 className="text-lg font-semibold mb-4">Impact</h3>
                                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                    <Card className="bg-blue-50">
                                                        <CardHeader className="pb-2 pt-4">
                                                            <CardTitle className="text-sm text-gray-600">Projects</CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <p className="text-2xl font-bold text-blue-700">{profileData.impact.projects}</p>
                                                        </CardContent>
                                                    </Card>

                                                    <Card className="bg-purple-50">
                                                        <CardHeader className="pb-2 pt-4">
                                                            <CardTitle className="text-sm text-gray-600">Beneficiaries</CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <p className="text-2xl font-bold text-purple-700">
                                                                {profileData.impact.beneficiaries.toLocaleString()}
                                                            </p>
                                                        </CardContent>
                                                    </Card>

                                                    <Card className="bg-green-50">
                                                        <CardHeader className="pb-2 pt-4">
                                                            <CardTitle className="text-sm text-gray-600">Funds Raised</CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <p className="text-2xl font-bold text-green-700">
                                                                ₹{profileData.impact.donations_received.toLocaleString()}
                                                            </p>
                                                        </CardContent>
                                                    </Card>

                                                    <Card className="bg-orange-50">
                                                        <CardHeader className="pb-2 pt-4">
                                                            <CardTitle className="text-sm text-gray-600">Campaigns</CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <p className="text-2xl font-bold text-orange-700">{profileData.impact.total_campaigns}</p>
                                                        </CardContent>
                                                    </Card>

                                                    <Card className="bg-teal-50">
                                                        <CardHeader className="pb-2 pt-4">
                                                            <CardTitle className="text-sm text-gray-600">Active Campaigns</CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <p className="text-2xl font-bold text-teal-700">{profileData.impact.active_campaigns}</p>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </div>
                                        )}

                                        {type === "donor" && profileData.impact && (
                                            <div className="mb-8">
                                                <h3 className="text-lg font-semibold mb-4">Donor Impact</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <Card className="bg-blue-50">
                                                        <CardHeader className="pb-2 pt-4">
                                                            <CardTitle className="text-sm text-gray-600">Total Donations</CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <p className="text-2xl font-bold text-blue-700">
                                                                ₹{profileData.impact.total_donations.toLocaleString()}
                                                            </p>
                                                        </CardContent>
                                                    </Card>

                                                    <Card className="bg-purple-50">
                                                        <CardHeader className="pb-2 pt-4">
                                                            <CardTitle className="text-sm text-gray-600">Campaigns Supported</CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <p className="text-2xl font-bold text-purple-700">
                                                                {profileData.impact.campaigns_supported}
                                                            </p>
                                                        </CardContent>
                                                    </Card>

                                                    <Card className="bg-green-50">
                                                        <CardHeader className="pb-2 pt-4">
                                                            <CardTitle className="text-sm text-gray-600">NGOs Supported</CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <p className="text-2xl font-bold text-green-700">{profileData.impact.ngos_supported}</p>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </div>
                                        )}

                                        {type === "ngo" && (
                                            <div>
                                                <h3 className="text-lg font-semibold mb-4">Organization Information</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <p className="text-gray-600 mb-1">Organization Name</p>
                                                        <p className="font-medium">{profileData.organization_name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600 mb-1">Registration Number</p>
                                                        <p className="font-medium">{profileData.registration_number}</p>
                                                    </div>
                                                    {profileData.established && (
                                                        <div>
                                                            <p className="text-gray-600 mb-1">Established</p>
                                                            <p className="font-medium">{new Date(profileData.established).toLocaleDateString()}</p>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-gray-600 mb-1">Verification Status</p>
                                                        <p className="font-medium flex items-center">
                                                            {profileData.verified ? (
                                                                <>
                                                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                                                    Verified
                                                                </>
                                                            ) : (
                                                                "Pending Verification"
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Campaigns Tab (for NGOs) */}
                                    {type === "ngo" && (
                                        <TabsContent value="campaigns" className="p-6">
                                            <h3 className="text-lg font-semibold mb-4">Active Campaigns</h3>
                                            {profileData.campaigns && profileData.campaigns.length > 0 ? (
                                                <div className="space-y-4">
                                                    {profileData.campaigns.map((campaign) => (
                                                        <Card key={campaign.id} className="overflow-hidden">
                                                            <div className="p-6">
                                                                <h4 className="text-lg font-medium mb-2">
                                                                    <Link href={`/campaigns/${campaign.id}`} className="text-blue-600 hover:underline">
                                                                        {campaign.title}
                                                                    </Link>
                                                                </h4>
                                                                <div className="mb-4">
                                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                                        <div
                                                                            className="bg-blue-600 h-2.5 rounded-full"
                                                                            style={{
                                                                                width: `${Math.min(100, (campaign.amount_raised / campaign.target_amount) * 100)}%`,
                                                                            }}
                                                                        ></div>
                                                                    </div>
                                                                    <div className="flex justify-between mt-2 text-sm">
                                                                        <span className="text-gray-600">
                                                                            Raised:{" "}
                                                                            <span className="font-medium">₹{campaign.amount_raised.toLocaleString()}</span>
                                                                        </span>
                                                                        <span className="text-gray-600">
                                                                            Goal:{" "}
                                                                            <span className="font-medium">₹{campaign.target_amount.toLocaleString()}</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm text-gray-500">
                                                                        <Calendar className="inline h-4 w-4 mr-1" />
                                                                        Ends on {new Date(campaign.end_date).toLocaleDateString()}
                                                                    </span>
                                                                    <Button asChild size="sm">
                                                                        <Link href={`/campaigns/${campaign.id}`}>View Campaign</Link>
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">No active campaigns at the moment.</p>
                                            )}
                                        </TabsContent>
                                    )}

                                    {/* Donations Tab (for Donors) */}
                                    {type === "donor" && (
                                        <TabsContent value="donations" className="p-6">
                                            <h3 className="text-lg font-semibold mb-4">Recent Donations</h3>
                                            {profileData.recent_donations && profileData.recent_donations.length > 0 ? (
                                                <div className="space-y-4">
                                                    {profileData.recent_donations.map((donation) => (
                                                        <Card key={donation.id} className="overflow-hidden">
                                                            <div className="p-6">
                                                                <h4 className="text-lg font-medium mb-2">
                                                                    <Link href={`/campaigns/${donation.id}`} className="text-blue-600 hover:underline">
                                                                        {donation.campaign}
                                                                    </Link>
                                                                </h4>
                                                                <p className="text-gray-600 mb-4">
                                                                    Donated to <span className="font-medium">{donation.ngo}</span>
                                                                </p>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-green-600 font-medium">
                                                                        ₹{donation.amount.toLocaleString()}
                                                                    </span>
                                                                    <span className="text-sm text-gray-500">
                                                                        <Calendar className="inline h-4 w-4 mr-1" />
                                                                        {new Date(donation.date).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">No donations yet.</p>
                                            )}
                                        </TabsContent>
                                    )}

                                    {/* Requests Tab (for Receivers) */}
                                    {type === "receiver" && (
                                        <TabsContent value="requests" className="p-6">
                                            <h3 className="text-lg font-semibold mb-4">Active Requests</h3>
                                            {profileData.requests && profileData.requests.length > 0 ? (
                                                <div className="space-y-4">
                                                    {profileData.requests.map((request) => (
                                                        <Card key={request.id} className="overflow-hidden">
                                                            <div className="p-6">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <h4 className="text-lg font-medium">
                                                                        <Link href={`/requests/${request.id}`} className="text-blue-600 hover:underline">
                                                                            {request.title}
                                                                        </Link>
                                                                    </h4>
                                                                    <Badge
                                                                        className={
                                                                            request.status === "Active"
                                                                                ? "bg-green-100 text-green-800"
                                                                                : "bg-yellow-100 text-yellow-800"
                                                                        }
                                                                    >
                                                                        {request.status}
                                                                    </Badge>
                                                                </div>
                                                                <div className="mb-4">
                                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                                        <div
                                                                            className="bg-blue-600 h-2.5 rounded-full"
                                                                            style={{
                                                                                width: `${Math.min(100, (request.amount_raised / request.target_amount) * 100)}%`,
                                                                            }}
                                                                        ></div>
                                                                    </div>
                                                                    <div className="flex justify-between mt-2 text-sm">
                                                                        <span className="text-gray-600">
                                                                            Raised:{" "}
                                                                            <span className="font-medium">₹{request.amount_raised.toLocaleString()}</span>
                                                                        </span>
                                                                        <span className="text-gray-600">
                                                                            Goal:{" "}
                                                                            <span className="font-medium">₹{request.target_amount.toLocaleString()}</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm text-gray-500">
                                                                        <Calendar className="inline h-4 w-4 mr-1" />
                                                                        Ends on {new Date(request.end_date).toLocaleDateString()}
                                                                    </span>
                                                                    <Button asChild size="sm">
                                                                        <Link href={`/requests/${request.id}`}>View Request</Link>
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">No active requests at the moment.</p>
                                            )}
                                        </TabsContent>
                                    )}

                                    {/* Badges Tab (for Donors) */}
                                    {type === "donor" && profileData.badges && (
                                        <TabsContent value="badges" className="p-6">
                                            <h3 className="text-lg font-semibold mb-4">Achievement Badges</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {profileData.badges.map((badge) => (
                                                    <Card key={badge.id} className="text-center p-6">
                                                        <div className="flex flex-col items-center">
                                                            <div className="bg-yellow-100 p-4 rounded-full mb-4">
                                                                <Award className="h-8 w-8 text-yellow-600" />
                                                            </div>
                                                            <h4 className="font-medium mb-2">{badge.name}</h4>
                                                            <p className="text-sm text-gray-600">{badge.description}</p>
                                                        </div>
                                                    </Card>
                                                ))}
                                            </div>
                                        </TabsContent>
                                    )}
                                </Tabs>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <p className="text-gray-600 mb-4">Profile not found or access denied.</p>
                            <Button asChild>
                                <Link href="/">Return to Home</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}