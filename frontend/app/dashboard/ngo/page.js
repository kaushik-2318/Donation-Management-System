"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { selectAuth } from "@/lib/redux/slices/authSlice"
import { setPosts, selectPosts } from "@/lib/redux/slices/postSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, CheckCircle, DollarSign, Plus, Users } from "lucide-react"
import DonationChart from "@/components/dashboard/donation-chart"
import Image from "next/image"

export default function NGODashboard() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector(selectAuth)
  const posts = useAppSelector(selectPosts)
  const [ngoPosts, setNgoPosts] = useState([])
  const [totalRaised, setTotalRaised] = useState(0)
  const [totalDonors, setTotalDonors] = useState(0)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    if (user?.role !== "NGO") {
      router.push(`/dashboard/${user?.role.toLowerCase()}`)
      return
    }

    // Fetch posts (mock data for demo)
    const mockPosts = [
      {
        id: "1",
        title: "Clean Water Initiative",
        description: "Help us provide clean drinking water to rural communities in need.",
        goal: 50000,
        raised: 32500,
        creatorId: user?.id || "",
        creatorName: user?.name || "",
        creatorType: "NGO",
        proofLink: "https://drive.google.com/file/example1",
        createdAt: "2023-03-01",
        updatedAt: "2023-03-15",
        status: "active",
        donorsCount: 28,
      },
      {
        id: "2",
        title: "Education for All",
        description: "Support our mission to provide quality education to underprivileged children.",
        goal: 75000,
        raised: 45000,
        creatorId: user?.id || "",
        creatorName: user?.name || "",
        creatorType: "NGO",
        proofLink: "https://drive.google.com/file/example2",
        createdAt: "2023-02-15",
        updatedAt: "2023-03-10",
        status: "active",
        donorsCount: 35,
      },
      {
        id: "3",
        title: "Food for the Homeless",
        description: "Help us feed homeless individuals in urban areas.",
        goal: 30000,
        raised: 28500,
        creatorId: user?.id || "",
        creatorName: user?.name || "",
        creatorType: "NGO",
        proofLink: "https://drive.google.com/file/example3",
        createdAt: "2023-01-20",
        updatedAt: "2023-03-05",
        status: "active",
        donorsCount: 22,
      },
    ]

    dispatch(setPosts(mockPosts))
    setNgoPosts(mockPosts)

    // Calculate total raised and donors
    const raised = mockPosts.reduce((sum, post) => sum + post.raised, 0)
    setTotalRaised(raised)

    const donors = mockPosts.reduce((sum, post) => sum + post.donorsCount, 0)
    setTotalDonors(donors)
  }, [dispatch, isAuthenticated, router, user])

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center">
            <h1 className="text-3xl font-bold">NGO Dashboard</h1>
            <Badge className="ml-2">Verified</Badge>
          </div>
          <p className="text-muted-foreground mt-1">Manage your campaigns and track donations</p>
        </div>
        <Button asChild>
          <Link href="/posts/create">
            <Plus className="mr-2 h-4 w-4" /> Create Campaign
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRaised.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ngoPosts.length}</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDonors}</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="donors">Donors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
              <CardDescription>Your donation activity over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <DonationChart />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Progress of your active campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {ngoPosts.map((post) => (
                    <div key={post.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{post.title}</h3>
                        <span className="text-sm font-medium">{Math.round((post.raised / post.goal) * 100)}%</span>
                      </div>
                      <Progress value={(post.raised / post.goal) * 100} />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>₹{post.raised.toLocaleString()}</span>
                        <span>₹{post.goal.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Donors</CardTitle>
                <CardDescription>People who recently donated to your campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Rajesh Kumar</p>
                      <p className="text-sm text-muted-foreground">₹5,000 to Clean Water Initiative</p>
                    </div>
                    <div className="ml-auto font-medium">
                      <Badge variant="outline" className="ml-2">
                        2 days ago
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Priya Sharma</p>
                      <p className="text-sm text-muted-foreground">₹2,500 to Education for All</p>
                    </div>
                    <div className="ml-auto font-medium">
                      <Badge variant="outline" className="ml-2">
                        3 days ago
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Amit Patel</p>
                      <p className="text-sm text-muted-foreground">₹1,000 to Food for the Homeless</p>
                    </div>
                    <div className="ml-auto font-medium">
                      <Badge variant="outline" className="ml-2">
                        5 days ago
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View all donors
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Your Campaigns</h2>
            <Button asChild>
              <Link href="/posts/create">
                <Plus className="mr-2 h-4 w-4" /> New Campaign
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ngoPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <Image
                  src={`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(post.title)}`}
                  alt={post.title}
                  width={1000}
                  height={1000}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <Badge>{post.status}</Badge>
                  </div>
                  <CardDescription>Created on {new Date(post.createdAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>₹{post.raised.toLocaleString()} raised</span>
                      <span className="font-medium">₹{post.goal.toLocaleString()}</span>
                    </div>
                    <Progress value={(post.raised / post.goal) * 100} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{post.donorsCount} donors</span>
                      <span>{Math.round((post.raised / post.goal) * 100)}% of goal</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="donors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Donors</CardTitle>
              <CardDescription>People who have contributed the most to your campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted mr-4">
                    <span className="text-sm font-medium">1</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Rajesh Kumar</p>
                    <p className="text-sm text-muted-foreground">Total: ₹12,500 · 3 donations</p>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="secondary">Platinum Donor</Badge>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted mr-4">
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Priya Sharma</p>
                    <p className="text-sm text-muted-foreground">Total: ₹10,000 · 4 donations</p>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="secondary">Gold Donor</Badge>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted mr-4">
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Amit Patel</p>
                    <p className="text-sm text-muted-foreground">Total: ₹7,500 · 5 donations</p>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="secondary">Silver Donor</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
              <CardDescription>Latest contributions to your campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Sneha Gupta</p>
                    <p className="text-sm text-muted-foreground">₹2,000 to Clean Water Initiative</p>
                  </div>
                  <div className="ml-auto font-medium">
                    <Badge variant="outline" className="ml-2">
                      Today
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Vikram Singh</p>
                    <p className="text-sm text-muted-foreground">₹1,500 to Education for All</p>
                  </div>
                  <div className="ml-auto font-medium">
                    <Badge variant="outline" className="ml-2">
                      Yesterday
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Neha Verma</p>
                    <p className="text-sm text-muted-foreground">₹500 to Food for the Homeless</p>
                  </div>
                  <div className="ml-auto font-medium">
                    <Badge variant="outline" className="ml-2">
                      2 days ago
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

