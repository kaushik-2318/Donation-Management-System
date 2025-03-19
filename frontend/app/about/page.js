import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Heart, Shield, Users, Zap } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-12">
      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium">
              <span className="text-primary">About Our Platform</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Empowering Change Through Transparent Giving
            </h1>
            <p className="text-lg text-muted-foreground">
              Our NGO Donation Management System connects verified organizations with donors to create meaningful
              impact. We believe in transparency, accountability, and the power of collective giving.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild>
                <Link href="/posts">Browse Campaigns</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/register">Join Us</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] overflow-hidden rounded-xl bg-muted">
            <Image
              src="/placeholder.svg?height=800&width=1200&text=Making+a+Difference"
              alt="People helping in community"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Mission</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We&#39;re dedicated to creating a world where giving is easy, transparent, and impactful. Our platform bridges
            the gap between donors and organizations to facilitate meaningful change.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="bg-white border-2 border-primary/10 hover:border-primary/30 transition-all">
            <CardHeader>
              <Heart className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Facilitate Giving</CardTitle>
              <CardDescription>We make it easy for donors to find and support causes they care about.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Our platform streamlines the donation process, allowing donors to contribute to multiple causes with
                ease and confidence.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-primary/10 hover:border-primary/30 transition-all">
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Ensure Transparency</CardTitle>
              <CardDescription>We verify NGOs and track every donation to ensure accountability.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Through our verification process and transparent reporting, donors can see exactly how their
                contributions are making an impact.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-primary/10 hover:border-primary/30 transition-all">
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Maximize Impact</CardTitle>
              <CardDescription>We help NGOs reach more donors and manage resources effectively.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                By connecting NGOs with a wider donor base and providing tools to manage campaigns, we help maximize the
                impact of every donation.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-16 bg-slate-50 rounded-2xl my-12">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our platform makes it easy for donors to find and support causes they care about, while helping NGOs reach
              more supporters.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Create an Account</h3>
              <p className="text-muted-foreground">
                Sign up as a donor, NGO, or receiver to access our platform&#39;s features.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Verify & Connect</h3>
              <p className="text-muted-foreground">
                NGOs get verified, donors browse campaigns, and receivers submit requests.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white mb-4">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Make an Impact</h3>
              <p className="text-muted-foreground">
                Donate to campaigns, track your impact, and receive updates on how your contribution is making a
                difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Key Features</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our platform offers a comprehensive suite of tools for NGOs, donors, and receivers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex gap-4 items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Verified NGOs</h3>
              <p className="text-muted-foreground">
                All NGOs on our platform undergo a thorough verification process to ensure legitimacy and
                accountability.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Transparent Tracking</h3>
              <p className="text-muted-foreground">
                Track your donations and see real-time updates on campaign progress and impact.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
              <p className="text-muted-foreground">
                Our platform uses industry-standard security measures to ensure your donations are processed safely.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Donor Recognition</h3>
              <p className="text-muted-foreground">
                Earn badges and recognition for your generosity, with a leaderboard showcasing top donors.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Campaign Management</h3>
              <p className="text-muted-foreground">
                NGOs can create and manage multiple campaigns, track donations, and communicate with donors.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Detailed Analytics</h3>
              <p className="text-muted-foreground">
                Access comprehensive reports and analytics to understand donation patterns and campaign performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Team</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We&#39;re a dedicated team of professionals committed to making a difference through technology.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="relative h-40 w-40 overflow-hidden rounded-full mb-4">
              <Image src="/placeholder.svg?height=160&width=160&text=CEO" alt="CEO" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-bold">Rajiv Sharma</h3>
            <p className="text-primary font-medium">CEO & Founder</p>
            <p className="text-muted-foreground mt-2">
              With 15+ years in the non-profit sector, Rajiv brings extensive experience in connecting donors with
              causes.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="relative h-40 w-40 overflow-hidden rounded-full mb-4">
              <Image src="/placeholder.svg?height=160&width=160&text=CTO" alt="CTO" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-bold">Priya Patel</h3>
            <p className="text-primary font-medium">CTO</p>
            <p className="text-muted-foreground mt-2">
              Priya leads our technology team, ensuring our platform is secure, scalable, and user-friendly.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="relative h-40 w-40 overflow-hidden rounded-full mb-4">
              <Image src="/placeholder.svg?height=160&width=160&text=COO" alt="COO" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-bold">Amit Verma</h3>
            <p className="text-primary font-medium">COO</p>
            <p className="text-muted-foreground mt-2">
              Amit oversees our operations, ensuring smooth processes for NGO verification and donor support.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground rounded-2xl my-12">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Ready to Make a Difference?</h2>
          <p className="mx-auto max-w-2xl text-lg mb-8">
            Join our platform today and be part of a community dedicated to creating positive change through transparent
            giving.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/register">Create an Account</Link>
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
      </section>
    </div>
  )
}

