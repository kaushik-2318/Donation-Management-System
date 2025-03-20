import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import BackgroundAnimation from "@/components/background-animation"

export default function CampaignsPage() {
  // Sample data for demonstration
  const campaigns = [
    {
      id: 1,
      title: "Build a School in Rural Tanzania",
      ngo: "Education for All",
      description: "Help us build a school for 500 children in a remote village in Tanzania.",
      image: "/placeholder.svg?height=200&width=300",
      raised: 45000,
      goal: 75000,
      daysLeft: 23,
      category: "education",
    },
    {
      id: 2,
      title: "Emergency Relief for Flood Victims",
      ngo: "Disaster Response Network",
      description: "Providing food, shelter, and medical aid to families affected by recent floods.",
      image: "/placeholder.svg?height=200&width=300",
      raised: 28500,
      goal: 50000,
      daysLeft: 15,
      category: "disaster",
    },
    {
      id: 3,
      title: "Save the Coral Reefs",
      ngo: "Ocean Conservation Alliance",
      description: "Supporting coral reef restoration projects in the Great Barrier Reef.",
      image: "/placeholder.svg?height=200&width=300",
      raised: 12800,
      goal: 30000,
      daysLeft: 45,
      category: "environment",
    },
    {
      id: 4,
      title: "Medical Supplies for Rural Clinics",
      ngo: "Healthcare Access Initiative",
      description: "Providing essential medical supplies to understaffed rural clinics.",
      image: "/placeholder.svg?height=200&width=300",
      raised: 18900,
      goal: 25000,
      daysLeft: 10,
      category: "health",
    },
    {
      id: 5,
      title: "Clean Water Wells for Villages",
      ngo: "Clean Water Initiative",
      description: "Building wells to provide clean drinking water to villages without access.",
      image: "/placeholder.svg?height=200&width=300",
      raised: 32000,
      goal: 40000,
      daysLeft: 30,
      category: "water",
    },
    {
      id: 6,
      title: "Reforestation Project in Amazon",
      ngo: "Earth Restoration Fund",
      description: "Planting trees to restore deforested areas in the Amazon rainforest.",
      image: "/placeholder.svg?height=200&width=300",
      raised: 15000,
      goal: 50000,
      daysLeft: 60,
      category: "environment",
    },
  ]

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
                  <div className="text-sm text-blue-600 mb-1">{campaign.ngo}</div>
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
                    <span className="text-sm text-gray-500">{campaign.daysLeft} days left</span>
                    <Link href={`/campaigns/${campaign.id}`}>
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

