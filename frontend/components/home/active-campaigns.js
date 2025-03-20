import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function ActiveCampaigns() {
  const campaigns = [
    {
      id: 1,
      title: "Build a School in Rural Rajasthan",
      ngo: "Education for All",
      description: "Help us build a school for 500 children in a remote village in Rajasthan.",
      image: "/placeholder.svg?height=200&width=300",
      raised: 450000,
      goal: 750000,
      daysLeft: 23,
    },
    {
      id: 2,
      title: "Emergency Relief for Flood Victims",
      ngo: "Disaster Response Network",
      description: "Providing food, shelter, and medical aid to families affected by recent floods in Bihar.",
      image: "/placeholder.svg?height=200&width=300",
      raised: 285000,
      goal: 500000,
      daysLeft: 15,
    },
    {
      id: 3,
      title: "Save the Bengal Tigers",
      ngo: "Wildlife Conservation Alliance",
      description: "Supporting tiger conservation projects in the Sundarbans National Park.",
      image: "/placeholder.svg?height=200&width=300",
      raised: 128000,
      goal: 300000,
      daysLeft: 45,
    },
    {
      id: 4,
      title: "Medical Supplies for Rural Clinics",
      ngo: "Healthcare Access Initiative",
      description: "Providing essential medical supplies to understaffed rural clinics in Uttar Pradesh.",
      image: "/placeholder.svg?height=200&width=300",
      raised: 189000,
      goal: 250000,
      daysLeft: 10,
    },
  ]

  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Active Campaigns</h2>
        <Link href="/campaigns" className="text-orange-600 hover:underline group flex items-center">
          View All
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden border transform transition-all hover:shadow-md hover:-translate-y-1 duration-300"
          >
            <div className="relative">
              <Image
                src={campaign.image || "/placeholder.svg"}
                alt={campaign.title}
                width={300}
                height={200}
                className="w-full h-40 object-cover"
              />
              <div className="absolute top-0 right-0 bg-orange-600 text-white text-xs font-bold px-2 py-1 m-2 rounded">
                {campaign.daysLeft} days left
              </div>
            </div>
            <div className="p-4">
              <div className="text-sm text-orange-600 mb-1">{campaign.ngo}</div>
              <h3 className="text-lg font-semibold mb-2 line-clamp-1">{campaign.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{campaign.description}</p>

              {/* Progress bar */}
              <div className="mb-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-600 rounded-full"
                    style={{ width: `${Math.min(100, (campaign.raised / campaign.goal) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between text-sm mb-4">
                <span className="font-medium">₹{campaign.raised.toLocaleString()}</span>
                <span className="text-gray-500">₹{campaign.goal.toLocaleString()}</span>
              </div>

              <Link href={`/campaigns/${campaign.id}`}>
                <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700">
                  Donate
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

