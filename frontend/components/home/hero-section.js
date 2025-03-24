import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
              Make a <span className="text-blue-600">Difference</span> Today
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Join Samarthan Kriya to connect with NGOs, support worthy causes, and help those in need. Every donation
              counts towards creating a better world.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link href="/campaigns">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Donate Now
                </Button>
              </Link>
              <Link href="/posts">
                <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Read Updates
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Join Us
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-lg overflow-hidden shadow-xl transform transition-transform hover:scale-105 duration-300">
              <img src="/placeholder.svg?height=600&width=800" alt="Samarthan Kriya Impact" className="w-full h-auto" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-blue-200 rounded-full opacity-50 z-0"></div>
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-blue-300 rounded-full opacity-30 z-0"></div>
          </div>
        </div>
      </div>

      {/* Animated wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg className="w-full h-auto" viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 50L48 45.7C96 41.3 192 32.7 288 29.2C384 25.7 480 27.3 576 35.8C672 44.3 768 59.7 864 62.5C960 65.3 1056 55.7 1152 47.5C1248 39.3 1344 32.7 1392 29.3L1440 26V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}

