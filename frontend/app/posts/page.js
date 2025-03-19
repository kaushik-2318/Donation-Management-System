"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { setPosts, selectPosts, selectPostLoading } from "@/lib/redux/slices/postSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Plus, Filter } from "lucide-react"
import { selectAuth } from "@/lib/redux/slices/authSlice"
import Image from "next/image"

export default function PostsPage() {
  const dispatch = useAppDispatch()
  const posts = useAppSelector(selectPosts)
  const loading = useAppSelector(selectPostLoading)
  const { isAuthenticated, user } = useAppSelector(selectAuth)

  useEffect(() => {
    // Fetch posts (mock data for demo)
    const mockPosts = [
      {
        id: "1",
        title: "Clean Water Initiative",
        description: "Help us provide clean drinking water to rural communities in need.",
        goal: 50000,
        raised: 32500,
        creatorId: "ngo1",
        creatorName: "Water for All NGO",
        creatorType: "NGO",
        proofLink: "https://drive.google.com/file/example1",
        createdAt: "2023-03-01",
        updatedAt: "2023-03-15",
        status: "active",
      },
      {
        id: "2",
        title: "Education for All",
        description: "Support our mission to provide quality education to underprivileged children.",
        goal: 75000,
        raised: 45000,
        creatorId: "ngo2",
        creatorName: "Education First Foundation",
        creatorType: "NGO",
        proofLink: "https://drive.google.com/file/example2",
        createdAt: "2023-02-15",
        updatedAt: "2023-03-10",
        status: "active",
      },
      {
        id: "3",
        title: "Food for the Homeless",
        description: "Help us feed homeless individuals in urban areas.",
        goal: 30000,
        raised: 28500,
        creatorId: "ngo3",
        creatorName: "Food Relief Organization",
        creatorType: "NGO",
        proofLink: "https://drive.google.com/file/example3",
        createdAt: "2023-01-20",
        updatedAt: "2023-03-05",
        status: "active",
      },
      {
        id: "4",
        title: "Medical Treatment Support",
        description: "I need financial assistance for my critical medical treatment.",
        goal: 100000,
        raised: 65000,
        creatorId: "receiver1",
        creatorName: "John Smith",
        creatorType: "RECEIVER",
        proofLink: "https://drive.google.com/file/example4",
        createdAt: "2023-02-28",
        updatedAt: "2023-03-12",
        status: "active",
      },
      {
        id: "5",
        title: "Disaster Relief Fund",
        description: "Support victims of the recent natural disaster in coastal regions.",
        goal: 200000,
        raised: 175000,
        creatorId: "ngo4",
        creatorName: "Disaster Response Team",
        creatorType: "NGO",
        proofLink: "https://drive.google.com/file/example5",
        createdAt: "2023-02-10",
        updatedAt: "2023-03-08",
        status: "active",
      },
    ]

    dispatch(setPosts(mockPosts))
  }, [dispatch])

  const canCreatePost = isAuthenticated && (user?.role === "NGO" || user?.role === "RECEIVER")

  return (
    <div className="container py-10 fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Donation Campaigns</h1>
          <p className="text-muted-foreground mt-1">Browse and support campaigns that need your help</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search campaigns..." className="w-full pl-8" />
          </div>
          {canCreatePost && (
            <Button asChild className="shadow-md hover:shadow-lg transition-shadow">
              <Link href="/posts/create">
                <Plus className="mr-2 h-4 w-4" /> Create Campaign
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Campaigns</TabsTrigger>
            <TabsTrigger value="ngo">NGO Campaigns</TabsTrigger>
            <TabsTrigger value="individual">Individual Requests</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p>Loading campaigns...</p>
            ) : (
              posts.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden card-hover-effect border-2 border-primary/5 hover:border-primary/20"
                >
                  <Image
                    src={`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(post.title)}`}
                    alt={post.title}
                    width={1000}
                    height={1000}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                      <Badge variant={post.creatorType === "NGO" ? "default" : "secondary"}>
                        {post.creatorType === "NGO" ? "NGO" : "Individual"}
                      </Badge>
                    </div>
                    <CardDescription>{post.creatorName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{post.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>₹{post.raised.toLocaleString()} raised</span>
                        <span className="font-medium">₹{post.goal.toLocaleString()}</span>
                      </div>
                      <Progress value={(post.raised / post.goal) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground text-right">
                        {Math.round((post.raised / post.goal) * 100)}% of goal
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full shadow-md hover:shadow-lg transition-shadow" asChild>
                      <Link href={`/donation/donate?campaign=${post.id}`}>Donate Now</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="ngo" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p>Loading campaigns...</p>
            ) : (
              posts
                .filter((post) => post.creatorType === "NGO")
                .map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden card-hover-effect border-2 border-primary/5 hover:border-primary/20"
                  >
                    <Image
                      src={`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(post.title)}`}
                      alt={post.title}
                      width={1000}
                      height={1000}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{post.title}</CardTitle>
                        <Badge>NGO</Badge>
                      </div>
                      <CardDescription>{post.creatorName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{post.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>₹{post.raised.toLocaleString()} raised</span>
                          <span className="font-medium">₹{post.goal.toLocaleString()}</span>
                        </div>
                        <Progress value={(post.raised / post.goal) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground text-right">
                          {Math.round((post.raised / post.goal) * 100)}% of goal
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full shadow-md hover:shadow-lg transition-shadow" asChild>
                        <Link href={`/donation/donate?campaign=${post.id}`}>Donate Now</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="individual" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p>Loading campaigns...</p>
            ) : (
              posts
                .filter((post) => post.creatorType === "RECEIVER")
                .map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden card-hover-effect border-2 border-primary/5 hover:border-primary/20"
                  >
                    <Image
                      src={`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(post.title)}`}
                      alt={post.title}
                      width={1000}
                      height={1000}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{post.title}</CardTitle>
                        <Badge variant="secondary">Individual</Badge>
                      </div>
                      <CardDescription>{post.creatorName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{post.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>₹{post.raised.toLocaleString()} raised</span>
                          <span className="font-medium">₹{post.goal.toLocaleString()}</span>
                        </div>
                        <Progress value={(post.raised / post.goal) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground text-right">
                          {Math.round((post.raised / post.goal) * 100)}% of goal
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full shadow-md hover:shadow-lg transition-shadow" asChild>
                        <Link href={`/donation/donate?campaign=${post.id}`}>Donate Now</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

