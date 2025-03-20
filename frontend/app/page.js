import Header from "@/components/header"
import Footer from "@/components/footer"
import TrendingNGOs from "@/components/home/trending-ngos"
import ActiveCampaigns from "@/components/home/active-campaigns"
import DonationRequests from "@/components/home/donation-requests"
import CallToAction from "@/components/home/call-to-action"
import HeroSection from "@/components/home/hero-section"
import BackgroundAnimation from "@/components/background-animation"

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
        </div>
      </main>
      <Footer />
    </div>
  )
}

