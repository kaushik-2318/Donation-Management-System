"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getDashboardData } from "@/lib/api"
import DashboardLayout from "@/components/dashboard/layout"
import DonationHistory from "@/components/dashboard/donation-history"
import DashboardStats from "@/components/dashboard/dashboard-stats"
import LeaderboardWidget from "@/components/dashboard/leaderboard-widget"
import BadgesWidget from "@/components/dashboard/badges-widget"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function DonorDashboard() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [leaderboardPeriod, setLeaderboardPeriod] = useState("daily")

  useEffect(() => {
    // Check if user is logged in and is a donor
    const token = localStorage.getItem("token")
    const userType = localStorage.getItem("userType")

    if (!token || userType !== "donor") {
      router.push("/auth/login")
      return
    }

    const fetchData = async () => {
      try {
        const data = await getDashboardData("donor")
        setDashboardData(data)
      } catch (err) {
        setError("Failed to load dashboard data")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  // Sample data for demonstration
  const sampleData = {
    stats: {
      totalDonated: 25000,
      campaignsSupported: 12,
      ngosSupported: 5,
      rank: 42,
    },
    donationHistory: [
      {
        id: 1,
        campaign: "Clean Water for Rural Communities",
        ngo: "Water Access Initiative",
        amount: 5000,
        date: "2023-03-15",
        receiptUrl: "/receipts/receipt-1.pdf",
      },
      {
        id: 2,
        campaign: "Education Supplies for Schools",
        ngo: "Education for All",
        amount: 2500,
        date: "2023-04-22",
        receiptUrl: "/receipts/receipt-2.pdf",
      },
      {
        id: 3,
        campaign: "Healthcare for Underserved Areas",
        ngo: "Healthcare Access Initiative",
        amount: 7500,
        date: "2023-05-10",
        receiptUrl: "/receipts/receipt-3.pdf",
      },
      {
        id: 4,
        campaign: "Community Center Renovation",
        ngo: "Community Development Fund",
        amount: 3000,
        date: "2023-06-05",
        receiptUrl: "/receipts/receipt-4.pdf",
      },
      {
        id: 5,
        campaign: "Food Distribution Program",
        ngo: "Food Security Alliance",
        amount: 4000,
        date: "2023-07-18",
        receiptUrl: "/receipts/receipt-5.pdf",
      },
    ],
    leaderboard: {
      daily: [
        { rank: 1, name: "Rahul Sharma", amount: 15000, badge: "gold" },
        { rank: 2, name: "Priya Patel", amount: 12500, badge: "gold" },
        { rank: 3, name: "Amit Kumar", amount: 10000, badge: "gold" },
        { rank: 4, name: "Neha Singh", amount: 7500, badge: "silver" },
        { rank: 5, name: "Vikram Mehta", amount: 5000, badge: "silver" },
      ],
      monthly: [
        { rank: 1, name: "Suresh Reddy", amount: 75000, badge: "gold" },
        { rank: 2, name: "Ananya Desai", amount: 62500, badge: "gold" },
        { rank: 3, name: "Rajesh Gupta", amount: 50000, badge: "gold" },
        { rank: 4, name: "Meera Joshi", amount: 37500, badge: "silver" },
        { rank: 5, name: "Kiran Shah", amount: 25000, badge: "silver" },
      ],
      yearly: [
        { rank: 1, name: "Tata Group", amount: 1500000, badge: "gold" },
        { rank: 2, name: "Reliance Foundation", amount: 1250000, badge: "gold" },
        { rank: 3, name: "Infosys Foundation", amount: 1000000, badge: "gold" },
        { rank: 4, name: "Wipro Foundation", amount: 750000, badge: "silver" },
        { rank: 5, name: "Adani Foundation", amount: 500000, badge: "silver" },
      ],
    },
    badges: [
      { id: 1, name: "First Donation", description: "Made your first donation", earned: true },
      { id: 2, name: "Regular Donor", description: "Donated for 3 consecutive months", earned: true },
      { id: 3, name: "Silver Supporter", description: "Donated over ₹10,000 in total", earned: true },
      { id: 4, name: "Gold Supporter", description: "Donated over ₹50,000 in total", earned: false },
      { id: 5, name: "Platinum Supporter", description: "Donated over ₹100,000 in total", earned: false },
    ],
  }

  // Use sample data for demonstration
  const data = dashboardData || sampleData

  return (
    <DashboardLayout userType="donor">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Donor Dashboard</h1>
        <Link href="/campaigns">
          <Button className="bg-blue-600 hover:bg-blue-700">Donate Now</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
      ) : (
        <>
          <DashboardStats
            stats={[
              { label: "Total Donated", value: `₹${data.stats.totalDonationsAmount.toLocaleString()}` },
              { label: "Campaign Donations", value: `${data.stats.totalCampaignDonations}` },
              { label: "Individual Donations", value: `${data.stats.totalIndividualDonations}` },
              { label: "Total Donations", value: `${data.stats.totalDonations}` },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">Your Donation History</h2>
              <DonationHistory donations={data.donationHistory} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">Your Badges</h2>
              <BadgesWidget badges={data.badges} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Leaderboard</h2>
              <Tabs
                defaultValue="daily"
                value={leaderboardPeriod}
                onValueChange={setLeaderboardPeriod}
                className="w-auto"
              >
                <TabsList>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {data.leaderboard && data.leaderboard[leaderboardPeriod] ? (
              <LeaderboardWidget leaderboard={data.leaderboard[leaderboardPeriod]} />
            ) : (
              <div className="text-gray-500 text-sm">Leaderboard data not available.</div>
            )}

            <Link href="/leaderboard">
              <Button variant="outline" className="w-full mt-4 border-blue-600 text-blue-600 hover:bg-blue-50">
                View Full Leaderboard
              </Button>
            </Link>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

