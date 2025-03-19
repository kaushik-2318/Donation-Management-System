import Image from "next/image";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, Shield, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50 rounded-3xl"></div>
        <div className="container px-4 md:px-6 relative">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
            <div className="flex flex-col justify-center space-y-4 fade-in">
              <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-4">
                <span className="text-primary">Empowering Change</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Empowering Change Through Transparent Giving
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Connect with verified NGOs, track your impact, and make a difference in the world through our secure
                  donation platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/auth/register">
                  <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="border-2">
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-4">
                <div className="flex items-center">
                  <Shield className="mr-1 h-4 w-4 text-primary" />
                  <span>Verified NGOs</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4 text-primary" />
                  <span>10,000+ Donors</span>
                </div>
                <div className="flex items-center">
                  <Heart className="mr-1 h-4 w-4 text-primary" />
                  <span>₹50M+ Donated</span>
                </div>
              </div>
            </div>
            <div className="relative slide-up">
              <div className="absolute -top-8 -left-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
              <Image
                src="/placeholder.svg?height=550&width=550&text=Making+a+Difference"
                width="550"
                height="550"
                alt="Hero Image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center fade-in">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-4">
              <span className="text-primary">Our Features</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform offers a comprehensive suite of tools for NGOs, donors, and receivers.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4 card-hover-effect bg-white rounded-xl p-6 border shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Shield className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Verified NGOs</h3>
                <p className="text-muted-foreground">
                  All NGOs on our platform are verified through the NGO Darpan API, ensuring your donations go to
                  legitimate organizations.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4 card-hover-effect bg-white rounded-xl p-6 border shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Heart className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Transparent Donations</h3>
                <p className="text-muted-foreground">
                  Track your donations in real-time and see the impact you&#39;re making with detailed progress reports.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4 card-hover-effect bg-white rounded-xl p-6 border shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Users className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Community Recognition</h3>
                <p className="text-muted-foreground">
                  Get recognized for your generosity with our donor leaderboard and achievement badges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaigns Preview Section */}
      <section className="py-12 md:py-24 lg:py-32 bg-slate-50 rounded-3xl">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 fade-in">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-4">
              <span className="text-primary">Featured Campaigns</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Make an Impact Today</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Browse our featured campaigns and start making a difference in the lives of those in need.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl card-hover-effect"
              >
                <div className="aspect-video overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=300&width=500&text=Campaign+${i}`}
                    alt={`Campaign ${i}`}
                    width={500}
                    height={300}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">
                    {i === 1 ? "Clean Water Initiative" : i === 2 ? "Education for All" : "Food for the Homeless"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {i === 1
                      ? "Help us provide clean drinking water to rural communities in need."
                      : i === 2
                        ? "Support our mission to provide quality education to underprivileged children."
                        : "Help us feed homeless individuals in urban areas."}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>₹{i === 1 ? "32,500" : i === 2 ? "45,000" : "28,500"} raised</span>
                      <span className="font-medium">₹{i === 1 ? "50,000" : i === 2 ? "75,000" : "30,000"}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${i === 1 ? 65 : i === 2 ? 60 : 95}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-right text-muted-foreground">
                      {i === 1 ? "65" : i === 2 ? "60" : "95"}% of goal
                    </p>
                  </div>
                  <Button className="w-full mt-4" asChild>
                    <Link href="/donation/donate">Donate Now</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/posts">
                View All Campaigns
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 fade-in">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-4">
              <span className="text-primary">Testimonials</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">What Our Users Say</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear from donors and NGOs who have experienced the impact of our platform.
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Rajesh Kumar",
                role: "Donor",
                image: "/placeholder.svg?height=100&width=100&text=RK",
                quote:
                  "The transparency and ease of use of this platform has made me a regular donor. I can see exactly where my money is going and the impact it's making.",
              },
              {
                name: "Priya Sharma",
                role: "NGO Director",
                image: "/placeholder.svg?height=100&width=100&text=PS",
                quote:
                  "This platform has revolutionized our fundraising efforts. The verification process gives donors confidence, and the tools make campaign management effortless.",
              },
              {
                name: "Amit Patel",
                role: "Donor",
                image: "/placeholder.svg?height=100&width=100&text=AP",
                quote:
                  "I love the donor recognition features. The badges and leaderboard add a fun element to giving, and I can track all my donations in one place.",
              },
            ].map((testimonial, i) => (
              <div key={i} className="rounded-xl bg-white p-6 shadow-md card-hover-effect">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                  </div>
                  <p className="flex-1 text-muted-foreground mb-6">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden mr-4">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground rounded-3xl my-12">
        <div className="container px-4 md:px-6 text-center">
          <div className="mx-auto max-w-3xl space-y-6 fade-in">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Make a Difference?</h2>
            <p className="text-xl text-primary-foreground/90">
              Join our platform today and start your journey of giving.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="shadow-lg" asChild>
                <Link href="/auth/register">Sign Up Now</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/10"
                asChild
              >
                <Link href="/posts">Browse Campaigns</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
