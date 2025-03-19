"use client"

import { useEffect, useState } from "react"
import { useAppSelector } from "@/lib/redux/hooks"
import { selectDonations } from "@/lib/redux/slices/donationSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Award, Trophy } from "lucide-react"

export default function LeaderboardPage() {
  const donations = useAppSelector(selectDonations)
  const [donors, setDonors] = useState([])
  const [topNGOs, setTopNGOs] = useState([])

  useEffect(() => {
    // Calculate donor statistics
    const donorMap = new Map()

    // In a real app, this would come from an API
    // For demo purposes, we'll use the donations in the store and add some mock data
    const allDonations = [
      ...donations,
      // Mock data to fill out the leaderboard
      {
        id: "mock1",
        amount: 5000,
        donorId: "donor1",
        donorName: "Rajesh Kumar",
        campaignId: "1",
        campaignName: "Clean Water Initiative",
        date: "2023-02-15",
        status: "completed",
      },
      {
        id: "mock2",
        amount: 7500,
        donorId: "donor2",
        donorName: "Priya Sharma",
        campaignId: "2",
        campaignName: "Education for All",
        date: "2023-03-10",
        status: "completed",
      },
      {
        id: "mock3",
        amount: 10000,
        donorId: "donor3",
        donorName: "Amit Patel",
        campaignId: "3",
        campaignName: "Food for the Homeless",
        date: "2023-01-20",
        status: "completed",
      },
      {
        id: "mock4",
        amount: 15000,
        donorId: "donor4",
        donorName: "Sneha Gupta",
        campaignId: "4",
        campaignName: "Medical Treatment Support",
        date: "2023-02-28",
        status: "completed",
      },
      {
        id: "mock5",
        amount: 20000,
        donorId: "donor5",
        donorName: "Vikram Singh",
        campaignId: "5",
        campaignName: "Disaster Relief Fund",
        date: "2023-02-10",
        status: "completed",
      },
    ]

    allDonations.forEach((donation) => {
      if (!donorMap.has(donation.donorId)) {
        donorMap.set(donation.donorId, {
          id: donation.donorId,
          name: donation.donorName,
          totalAmount: 0,
          donationsCount: 0,
          badges: [],
        })
      }

      const donor = donorMap.get(donation.donorId);
      if (donor) {
        donor.totalAmount += donation.amount;
        donor.donationsCount += 1;
      }


    })

    // Assign badges based on donation amounts
    donorMap.forEach((donor) => {
      if (donor.totalAmount >= 500) donor.badges.push("Bronze Donor")
      if (donor.totalAmount >= 1000) donor.badges.push("Silver Donor")
      if (donor.totalAmount >= 2000) donor.badges.push("Gold Donor")
      if (donor.totalAmount >= 5000) donor.badges.push("Platinum Donor")
      if (donor.totalAmount >= 10000) donor.badges.push("Diamond Donor")
    })

    // Sort donors by total amount
    const sortedDonors = Array.from(donorMap.values()).sort((a, b) => b.totalAmount - a.totalAmount)

    setDonors(sortedDonors)

    // Mock data for top NGOs
    setTopNGOs([
      {
        id: "ngo1",
        name: "Water for All NGO",
        avatar: "",
        campaignsCount: 5,
        totalRaised: 125000,
        donorsCount: 78,
        verificationStatus: "verified",
      },
      {
        id: "ngo2",
        name: "Education First Foundation",
        avatar: "",
        campaignsCount: 3,
        totalRaised: 95000,
        donorsCount: 62,
        verificationStatus: "verified",
      },
      {
        id: "ngo3",
        name: "Food Relief Organization",
        avatar: "",
        campaignsCount: 4,
        totalRaised: 85000,
        donorsCount: 53,
        verificationStatus: "verified",
      },
      {
        id: "ngo4",
        name: "Disaster Response Team",
        avatar: "",
        campaignsCount: 2,
        totalRaised: 175000,
        donorsCount: 112,
        verificationStatus: "verified",
      },
      {
        id: "ngo5",
        name: "Medical Relief NGO",
        avatar: "",
        campaignsCount: 6,
        totalRaised: 145000,
        donorsCount: 91,
        verificationStatus: "verified",
      },
    ])
  }, [donations])

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center text-center mb-8">
        <Trophy className="h-12 w-12 text-primary mb-2" />
        <h1 className="text-3xl font-bold">Donation Leaderboard</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Recognizing our generous donors and impactful NGOs who are making a difference in the world.
        </p>
      </div>

      <Tabs defaultValue="donors" className="space-y-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="donors">Top Donors</TabsTrigger>
          <TabsTrigger value="ngos">Top NGOs</TabsTrigger>
        </TabsList>

        <TabsContent value="donors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Donors</CardTitle>
              <CardDescription>Recognizing our most generous contributors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {donors.slice(0, 10).map((donor, index) => (
                  <div key={donor.id} className="flex items-center">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted mr-4">
                      {index < 3 ? (
                        <Award
                          className={`h-4 w-4 ${index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-600"}`}
                        />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={donor.avatar} alt={donor.name} />
                      <AvatarFallback>{donor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div>
                          <p className="font-medium">{donor.name}</p>
                          <p className="text-sm text-muted-foreground">{donor.donationsCount} donations</p>
                        </div>
                        <div className="mt-2 sm:mt-0 text-right">
                          <p className="font-bold">₹{donor.totalAmount.toLocaleString()}</p>
                          <div className="flex flex-wrap gap-1 mt-1 justify-end">
                            {donor.badges.slice(-2).map((badge) => (
                              <Badge key={badge} variant="secondary" className="text-xs">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ngos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top NGOs</CardTitle>
              <CardDescription>Organizations making the biggest impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {topNGOs.map((ngo, index) => (
                  <div key={ngo.id} className="flex items-center">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted mr-4">
                      {index < 3 ? (
                        <Award
                          className={`h-4 w-4 ${index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-600"}`}
                        />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={ngo.avatar} alt={ngo.name} />
                      <AvatarFallback>{ngo.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div className="flex items-center">
                          <p className="font-medium">{ngo.name}</p>
                          {ngo.verificationStatus === "verified" && <Badge className="ml-2 text-xs">Verified</Badge>}
                        </div>
                        <div className="mt-2 sm:mt-0 text-right">
                          <p className="font-bold">₹{ngo.totalRaised.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {ngo.donorsCount} donors · {ngo.campaignsCount} campaigns
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

