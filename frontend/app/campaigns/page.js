"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import BackgroundAnimation from "@/components/background-animation"
import { getAllCampaigns } from "@/lib/api"
import { useEffect, useState } from "react"

export default function CampaignsPage() {

  const [campaigns, setCampaigns] = useState([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userType = localStorage.getItem("userType")

    if (!token || userType !== "ngo") {
      router.push("/auth/login")
      return
    }

    const fetchData = async () => {
      try {
        const response = await getAllCampaigns();
        setCampaigns(Array.isArray(response.campaigns) ? response.campaigns : []);
      } catch (err) {
        setError("Failed to load dashboard data")
        console.error(err)
      }
    }
    fetchData()
  }, []);


  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundAnimation />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Active Campaigns</h1>
          <p className="text-gray-600 mb-6">
            Browse through our active campaigns and support causes that matter to you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <Input type="search" placeholder="Search campaigns..." className="w-full" />
            </div>
            <div>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2">
                <option value="">All Categories</option>
                <option value="education">Education</option>
                <option value="health">Healthcare</option>
                <option value="environment">Environment</option>
                <option value="disaster">Disaster Relief</option>
                <option value="water">Water & Sanitation</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-lg shadow-sm overflow-hidden border">
                <Image
                  src={campaign.image || "/placeholder.svg"}
                  alt={campaign.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>

                  {/* Progress bar */}
                  <div className="mb-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${Math.min(100, (campaign.raised / campaign.goal) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm mb-4">
                    <span className="font-medium">${campaign.raised.toLocaleString()} raised</span>
                    <span className="text-gray-500">${campaign.goal.toLocaleString()} goal</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {Math.max(0, Math.ceil(campaign.duration - (new Date() - new Date(campaign.createdAt)) / (1000 * 60 * 60 * 24)))} days left
                    </span>

                    <Link href={`/campaigns/${campaign._id}`}>
                      <Button>Donate</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

