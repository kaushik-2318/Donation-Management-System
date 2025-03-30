"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getDashboardData } from "@/lib/api"
import DashboardLayout from "@/components/dashboard/layout"
import FundsReceivedChart from "@/components/dashboard/funds-received-chart"
import RequestsList from "@/components/dashboard/requests-list"
import DashboardStats from "@/components/dashboard/dashboard-stats"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function ReceiverDashboard() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData("receiver")
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

  return (
    <DashboardLayout userType="receiver">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Receiver Dashboard</h1>
        <Link href="/requests/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Request
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
        dashboardData && (
          <>
            <DashboardStats
              stats={[
                {
                  label: "Total Received",
                  value: `₹${dashboardData.stats.totalReceived?.toLocaleString() || 0}`
                },
                {
                  label: "Active Requests",
                  value: dashboardData.stats.activeRequests
                },
                {
                  label: "Completed Requests",
                  value: dashboardData.stats.completedRequests
                },
                {
                  label: "Total Donors",
                  value: dashboardData.stats.donorsCount
                },
              ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold mb-4">Funds Received Over Time</h2>
                <FundsReceivedChart data={dashboardData.fundsData} />
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold mb-4">Request Performance</h2>
                <div className="space-y-4">
                  {dashboardData.requests.slice(0, 3).map((request) => (
                    <div key={request.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{request.title}</span>
                        <span className={request.status === "active" ? "text-green-600" : "text-blue-600"}>
                          {request.status === "active" ? "Active" : "Completed"}
                        </span>
                      </div>
                      <div className="mb-2">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${Math.min(100, (request.raised / request.goal) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>₹{request.raised?.toLocaleString() || 0} raised</span>
                        <span className="text-gray-500">₹{request.goal?.toLocaleString() || 0} goal</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/requests/manage">
                  <Button variant="outline" className="w-full mt-4 border-blue-600 text-blue-600 hover:bg-blue-50">
                    View All Requests
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Your Requests</h2>
                <Link href="/requests/manage">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                    Manage All
                  </Button>
                </Link>
              </div>
              <RequestsList requests={dashboardData.requests} />
            </div>
          </>
        )
      )}
    </DashboardLayout>
  )
}