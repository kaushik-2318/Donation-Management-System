import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Heart, Globe, Award, BarChart3, Handshake } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-800">About Samarthan Kriya</h1>
                        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                            Empowering communities through transparent giving and meaningful impact.
                        </p>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6 text-blue-700">Our Mission</h2>
                                <p className="text-lg text-gray-700 mb-6">
                                    Samarthan Kriya exists to bridge the gap between those who want to help and those who need it most. We
                                    believe in the power of collective action and transparent giving to create lasting change in
                                    communities across India.
                                </p>
                                <p className="text-lg text-gray-700">
                                    Our platform enables individuals to directly support both NGO-led campaigns and personal requests for
                                    assistance, ensuring that help reaches where it's needed most efficiently and transparently.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-6 text-blue-700">Our Vision</h2>
                                <p className="text-lg text-gray-700 mb-6">
                                    We envision a world where no one is left behind due to lack of resources or support. A world where
                                    communities thrive through mutual aid and where technology serves as a bridge to connect those who can
                                    help with those who need it.
                                </p>
                                <p className="text-lg text-gray-700">
                                    By 2030, we aim to have facilitated over ₹100 crore in donations, impacting the lives of over 1
                                    million people across India through our transparent and efficient platform.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-16 bg-blue-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold mb-12 text-center text-blue-800">How Samarthan Kriya Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Users className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-blue-700">Connect</h3>
                                <p className="text-gray-600">
                                    We connect donors with verified NGOs and individuals in need through our secure platform, ensuring
                                    that every donation reaches its intended recipient.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Heart className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-blue-700">Contribute</h3>
                                <p className="text-gray-600">
                                    Make secure donations to campaigns and requests that resonate with you. Track your impact and receive
                                    updates on how your contribution is making a difference.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Globe className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-blue-700">Create Change</h3>
                                <p className="text-gray-600">
                                    Together, we create meaningful change in communities across India. Our transparent reporting ensures
                                    you can see the real-world impact of your generosity.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Values */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold mb-12 text-center text-blue-800">Our Core Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="flex items-start">
                                <div className="mr-4 mt-1">
                                    <Award className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-blue-700">Transparency</h3>
                                    <p className="text-gray-600">
                                        We believe in complete transparency in all our operations. Donors can track exactly where their
                                        money goes and how it's being used.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="mr-4 mt-1">
                                    <Handshake className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-blue-700">Integrity</h3>
                                    <p className="text-gray-600">
                                        We uphold the highest standards of integrity in all our interactions, ensuring trust between donors,
                                        NGOs, and individuals seeking help.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="mr-4 mt-1">
                                    <BarChart3 className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-blue-700">Accountability</h3>
                                    <p className="text-gray-600">
                                        We hold ourselves and our partners accountable for every rupee donated, ensuring maximum impact and
                                        responsible use of resources.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="mr-4 mt-1">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-blue-700">Inclusivity</h3>
                                    <p className="text-gray-600">
                                        We believe in creating a platform that is accessible to all, regardless of background, ensuring help
                                        reaches every corner of society.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="mr-4 mt-1">
                                    <Heart className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-blue-700">Compassion</h3>
                                    <p className="text-gray-600">
                                        At the heart of our work is deep compassion for those in need, driving us to create meaningful
                                        solutions to real problems.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="mr-4 mt-1">
                                    <Globe className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-blue-700">Innovation</h3>
                                    <p className="text-gray-600">
                                        We continuously innovate to make giving and receiving help more efficient, leveraging technology to
                                        maximize social impact.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Impact Stats */}
                <section className="py-16 bg-blue-600 text-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold mb-12 text-center">Our Impact</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="text-center">
                                <p className="text-4xl md:text-5xl font-bold mb-2">₹2.5Cr+</p>
                                <p className="text-xl">Funds Raised</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl md:text-5xl font-bold mb-2">150+</p>
                                <p className="text-xl">NGOs Supported</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl md:text-5xl font-bold mb-2">500+</p>
                                <p className="text-xl">Campaigns Funded</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl md:text-5xl font-bold mb-2">10,000+</p>
                                <p className="text-xl">Lives Impacted</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold mb-12 text-center text-blue-800">Our Team</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-blue-50 p-6 rounded-lg text-center">
                                <div className="w-24 h-24 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-blue-600">RK</span>
                                </div>
                                <h3 className="text-xl font-bold mb-1 text-blue-700">Rahul Kumar</h3>
                                <p className="text-gray-500 mb-3">Founder & CEO</p>
                                <p className="text-gray-600">
                                    With over 15 years of experience in the social sector, Rahul founded Samarthan Kriya to revolutionize
                                    how people give and receive help in India.
                                </p>
                            </div>
                            <div className="bg-blue-50 p-6 rounded-lg text-center">
                                <div className="w-24 h-24 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-blue-600">AS</span>
                                </div>
                                <h3 className="text-xl font-bold mb-1 text-blue-700">Ananya Sharma</h3>
                                <p className="text-gray-500 mb-3">Chief Operations Officer</p>
                                <p className="text-gray-600">
                                    Ananya brings her expertise in operations and NGO partnerships to ensure Samarthan Kriya runs
                                    efficiently and creates maximum impact.
                                </p>
                            </div>
                            <div className="bg-blue-50 p-6 rounded-lg text-center">
                                <div className="w-24 h-24 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-blue-600">VP</span>
                                </div>
                                <h3 className="text-xl font-bold mb-1 text-blue-700">Vikram Patel</h3>
                                <p className="text-gray-500 mb-3">Chief Technology Officer</p>
                                <p className="text-gray-600">
                                    Vikram leads our technology team, building innovative solutions that make giving and receiving help
                                    seamless and transparent.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-blue-50">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-6 text-blue-800">Join Our Mission</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                            Whether you're looking to donate, raise funds, or volunteer your time, there's a place for you in the
                            Samarthan Kriya community.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/auth/register">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg">
                                    Join Us Today
                                </Button>
                            </Link>
                            <Link href="/campaigns">
                                <Button
                                    variant="outline"
                                    className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-md text-lg"
                                >
                                    Browse Campaigns
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}