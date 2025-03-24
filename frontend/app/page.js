import Header from "@/components/header"
import Footer from "@/components/footer"
import TrendingNGOs from "@/components/home/trending-ngos"
import ActiveCampaigns from "@/components/home/active-campaigns"
import DonationRequests from "@/components/home/donation-requests"
import CallToAction from "@/components/home/call-to-action"
import HeroSection from "@/components/home/hero-section"
import BackgroundAnimation from "@/components/background-animation"

// Import the necessary components
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundAnimation />
      <Header />
      <main className="flex-grow">
        <HeroSection />

        <div className="container mx-auto px-4 py-8">
          <CallToAction />

          <TrendingNGOs />

          <ActiveCampaigns />

          <DonationRequests />

          <section className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Latest Posts & Updates</h2>
              <Link href="/posts" className="text-blue-600 hover:underline group flex items-center">
                View All
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* This would ideally be populated with actual data from an API call */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border transform transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <div className="p-6">
                  <div className="text-sm text-blue-600 mb-1">News</div>
                  <h3 className="text-xl font-semibold mb-2">New Water Project Launched</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    We're excited to announce our new clean water initiative in rural communities.
                  </p>
                  <Link href="/posts/1" className="text-blue-600 hover:underline">
                    Read More →
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden border transform transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <div className="p-6">
                  <div className="text-sm text-blue-600 mb-1">Success Story</div>
                  <h3 className="text-xl font-semibold mb-2">School Built in Rajasthan</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    Thanks to your generous donations, 500 children now have access to education.
                  </p>
                  <Link href="/posts/2" className="text-blue-600 hover:underline">
                    Read More →
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden border transform transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <div className="p-6">
                  <div className="text-sm text-blue-600 mb-1">Event</div>
                  <h3 className="text-xl font-semibold mb-2">Annual Charity Gala</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    Join us for our annual fundraising gala on December 15th at the Grand Hotel.
                  </p>
                  <Link href="/posts/3" className="text-blue-600 hover:underline">
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

