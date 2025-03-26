"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getDashboardData } from "@/lib/api"
import DashboardLayout from "@/components/dashboard/layout"
import DonationsChart from "@/components/dashboard/donations-chart"
import CampaignsList from "@/components/dashboard/campaigns-list"
import DashboardStats from "@/components/dashboard/dashboard-stats"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function NGODashboard() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user is logged in and is an NGO
    const token = localStorage.getItem("token")
    const userType = localStorage.getItem("userType")

    if (!token || userType !== "ngo") {
      router.push("/auth/login")
      return
    }

    const fetchData = async () => {
      try {
        const data = await getDashboardData("ngo")
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
      totalDonations: 1250000,
      totalCampaigns: 8,
      activeCampaigns: 5,
      donorsCount: 450,
    },
    donationsData: [
      { month: "Jan", amount: 50000 },
      { month: "Feb", amount: 75000 },
      { month: "Mar", amount: 100000 },
      { month: "Apr", amount: 80000 },
      { month: "May", amount: 120000 },
      { month: "Jun", amount: 150000 },
      { month: "Jul", amount: 180000 },
      { month: "Aug", amount: 220000 },
      { month: "Sep", amount: 190000 },
      { month: "Oct", amount: 140000 },
      { month: "Nov", amount: 95000 },
      { month: "Dec", amount: 110000 },
    ],
    campaigns: [
      {
        id: 1,
        title: "Clean Water for Rural Communities",
        raised: 450000,
        goal: 750000,
        status: "active",
        daysLeft: 23,
      },
      {
        id: 2,
        title: "Education Supplies for Schools",
        raised: 285000,
        goal: 300000,
        status: "active",
        daysLeft: 15,
      },
      {
        id: 3,
        title: "Healthcare for Underserved Areas",
        raised: 500000,
        goal: 500000,
        status: "completed",
        daysLeft: 0,
      },
      {
        id: 4,
        title: "Community Center Renovation",
        raised: 128000,
        goal: 400000,
        status: "active",
        daysLeft: 45,
      },
      {
        id: 5,
        title: "Food Distribution Program",
        raised: 189000,
        goal: 250000,
        status: "active",
        daysLeft: 10,
      },
    ],
  }

  // Use sample data for demonstration
  const data = dashboardData || sampleData

  return (
    <DashboardLayout userType="ngo">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">NGO Dashboard</h1>
        <Link href="/campaigns/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
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
              { label: "Total Donations", value: `₹${data.stats.totalDonations.toLocaleString()}` },
              { label: "Total Campaigns", value: data.stats.totalCampaigns },
              { label: "Active Campaigns", value: data.stats.activeCampaigns },
              { label: "Total Donors", value: data.stats.donorsCount },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">Donations Over Time</h2>
              <DonationsChart data={data.donationsData} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">Campaign Performance</h2>
              <div className="space-y-4">
                {data.campaigns.slice(0, 3).map((campaign) => (
                  <div key={campaign.id} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{campaign.title}</span>
                      <span className={campaign.status === "active" ? "text-green-600" : "text-blue-600"}>
                        {campaign.status === "active" ? "Active" : "Completed"}
                      </span>
                    </div>
                    <div className="mb-2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${Math.min(100, (campaign.raised / campaign.goal) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>₹{campaign.raised.toLocaleString()} raised</span>
                      <span className="text-gray-500">₹{campaign.goal.toLocaleString()} goal</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/campaigns/manage">
                <Button variant="outline" className="w-full mt-4 border-blue-600 text-blue-600 hover:bg-blue-50">
                  View All Campaigns
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Your Campaigns</h2>
              <Link href="/campaigns/manage">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                  Manage All
                </Button>
              </Link>
            </div>
            <CampaignsList campaigns={data.campaigns} />
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

