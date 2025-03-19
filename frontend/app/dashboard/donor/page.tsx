"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { selectAuth } from "@/lib/redux/slices/authSlice"
import { setDonations, selectDonations } from "@/lib/redux/slices/donationSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, Award, DollarSign, Heart } from "lucide-react"
import Link from "next/link"
import DonationChart from "@/components/dashboard/donation-chart"

export default function DonorDashboard() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector(selectAuth)
  const donations = useAppSelector(selectDonations)
  const [totalDonated, setTotalDonated] = useState(0)
  const [badges, setBadges] = useState<string[]>([])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    if (user?.role !== "DONOR") {
      router.push(`/dashboard/${user?.role.toLowerCase()}`)
      return
    }

    // Fetch donations (mock data for demo)
    const mockDonations = [
      {
        id: "1",
        amount: 500,
        donorId: user?.id || "",
        donorName: user?.name || "",
        campaignId: "1",
        campaignName: "Clean Water Initiative",
        date: "2023-03-15",
        status: "completed",
      },
      {
        id: "2",
        amount: 1000,
        donorId: user?.id || "",
        donorName: user?.name || "",
        campaignId: "2",
        campaignName: "Education for All",
        date: "2023-04-20",
        status: "completed",
      },
      {
        id: "3",
        amount: 750,
        donorId: user?.id || "",
        donorName: user?.name || "",
        campaignId: "3",
        campaignName: "Food for the Homeless",
        date: "2023-05-10",
        status: "completed",
      },
    ]

    dispatch(setDonations(mockDonations as any))

    // Calculate total donated
    const total = mockDonations.reduce((sum, donation) => sum + donation.amount, 0)
    setTotalDonated(total)

    // Determine badges based on total donation amount
    const badgesList = []
    if (total >= 500) badgesList.push("Bronze Donor")
    if (total >= 1000) badgesList.push("Silver Donor")
    if (total >= 2000) badgesList.push("Gold Donor")
    setBadges(badgesList)
  }, [dispatch, isAuthenticated, router, user])

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Donor Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalDonated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaigns Supported</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donations.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donor Rank</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Top 10% of donors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{badges.length}</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {badges.map((badge) => (
                <Badge key={badge} variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
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
                <CardTitle>Recent Donations</CardTitle>
                <CardDescription>Your most recent contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {donations.slice(0, 3).map((donation: any) => (
                    <div key={donation.id} className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{donation.campaignName}</p>
                        <p className="text-sm text-muted-foreground">
                          ₹{donation.amount.toLocaleString()} on {new Date(donation.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        <Badge variant="outline" className="ml-2">
                          {donation.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/donations">
                    View all
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Campaigns</CardTitle>
                <CardDescription>Campaigns you might be interested in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Healthcare for Rural Areas</p>
                      <p className="text-sm text-muted-foreground">By Medical Relief NGO</p>
                    </div>
                    <div className="ml-auto">
                      <Button size="sm">Donate</Button>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Disaster Relief Fund</p>
                      <p className="text-sm text-muted-foreground">By Emergency Response Team</p>
                    </div>
                    <div className="ml-auto">
                      <Button size="sm">Donate</Button>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Women Empowerment Initiative</p>
                      <p className="text-sm text-muted-foreground">By Women's Rights Foundation</p>
                    </div>
                    <div className="ml-auto">
                      <Button size="sm">Donate</Button>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/posts">
                    Browse all campaigns
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="donations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Donations</CardTitle>
              <CardDescription>A complete history of your donations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {donations.map((donation: any) => (
                  <div key={donation.id} className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{donation.campaignName}</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{donation.amount.toLocaleString()} on {new Date(donation.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      <Badge variant="outline" className="ml-2">
                        {donation.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Badges</CardTitle>
              <CardDescription>Achievements you've earned through your donations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {badges.map((badge) => (
                  <Card key={badge}>
                    <CardContent className="pt-6 text-center">
                      <Award className="h-12 w-12 mx-auto mb-2 text-primary" />
                      <h3 className="text-lg font-medium">{badge}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {badge === "Bronze Donor" && "Donated ₹500+"}
                        {badge === "Silver Donor" && "Donated ₹1,000+"}
                        {badge === "Gold Donor" && "Donated ₹2,000+"}
                      </p>
                    </CardContent>
                  </Card>
                ))}

                {/* Locked badges */}
                {!badges.includes("Gold Donor") && (
                  <Card className="opacity-50">
                    <CardContent className="pt-6 text-center">
                      <Award className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <h3 className="text-lg font-medium">Gold Donor</h3>
                      <p className="text-sm text-muted-foreground mt-1">Donate ₹2,000+ to unlock</p>
                    </CardContent>
                  </Card>
                )}

                <Card className="opacity-50">
                  <CardContent className="pt-6 text-center">
                    <Award className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Platinum Donor</h3>
                    <p className="text-sm text-muted-foreground mt-1">Donate ₹5,000+ to unlock</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

