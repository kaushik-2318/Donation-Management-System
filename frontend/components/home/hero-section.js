import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

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
              Join Samarthan Kriya to connect with NGOs, support worthy causes,
              and help those in need. Every donation counts towards creating a
              better world.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link href="/campaigns">
                <Button
                  size={"default"}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Donate Now
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  variant="outline"
                  size={"default"}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Join Us
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-lg overflow-hidden shadow-xl transform transition-transform hover:scale-105 duration-300">
              <Image
                src="/placeholder.svg?height=600&width=800"
                width={100}
                height={100}
                alt="Samarthan Kriya Impact"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-blue-200 rounded-full opacity-50 z-0"></div>
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-blue-300 rounded-full opacity-30 z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

