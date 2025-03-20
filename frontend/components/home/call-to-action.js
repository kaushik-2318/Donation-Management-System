import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CallToAction() {
  return (
    <section className="mb-16 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8 transform transition-transform hover:scale-[1.01] duration-300">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to Make an Impact?</h2>
          <p className="text-gray-600 mb-6">
            Whether you want to donate to a cause, start a fundraising campaign, or request assistance, our platform
            makes it easy to connect and contribute.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/campaigns">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 group">
                Donate Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                Create Account
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center transform transition-transform hover:scale-105 duration-300">
            <div className="text-3xl font-bold text-orange-600 mb-2">1.2M+</div>
            <div className="text-gray-600">Donors</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center transform transition-transform hover:scale-105 duration-300">
            <div className="text-3xl font-bold text-orange-600 mb-2">₹15Cr+</div>
            <div className="text-gray-600">Raised</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center transform transition-transform hover:scale-105 duration-300">
            <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
            <div className="text-gray-600">NGOs</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center transform transition-transform hover:scale-105 duration-300">
            <div className="text-3xl font-bold text-orange-600 mb-2">2,500+</div>
            <div className="text-gray-600">Campaigns</div>
          </div>
        </div>
      </div>
    </section>
  )
}

