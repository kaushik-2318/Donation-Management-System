"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Search,
    Phone,
    Mail,
    MessageSquare,
    HelpCircle,
    AlertCircle,
    CheckCircle,
    Database,
    Heart,
    HandHeart,
} from "lucide-react"
import Link from "next/link"

export default function HelpSupportPage() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState("general")
    const [contactForm, setContactForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [submitError, setSubmitError] = useState("")

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleContactFormChange = (e) => {
        const { name, value } = e.target
        setContactForm({
            ...contactForm,
            [name]: value,
        })
    }

    const handleContactSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitSuccess(false)
        setSubmitError("")

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setSubmitSuccess(true)
            setContactForm({
                name: "",
                email: "",
                subject: "",
                message: "",
            })
        } catch (error) {
            setSubmitError("Failed to submit your request. Please try again later.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // FAQs data
    const faqs = {
        general: [
            {
                question: "What is Samarthan Kriya?",
                answer:
                    "Samarthan Kriya is a platform that connects donors with NGOs and individuals in need. Our mission is to facilitate transparent, efficient, and impactful giving that makes a real difference in people's lives.",
            },
            {
                question: "How does the donation process work?",
                answer:
                    "Donors can either contribute to campaigns created by verified NGOs or fulfill specific requests from individuals in need. All transactions are secure and transparent, with updates provided on how the funds are utilized.",
            },
            {
                question: "Is my donation tax-deductible?",
                answer:
                    "Yes, donations made to verified NGOs on our platform are eligible for tax deductions. You will receive a receipt and certificate for your donation that can be used for tax purposes.",
            },
            {
                question: "How do you ensure transparency?",
                answer:
                    "We have a rigorous verification process for NGOs and individuals. Additionally, all campaigns and requests include detailed information and regular updates. We also conduct periodic audits to ensure funds are used as intended.",
            },
            {
                question: "Can I donate anonymously?",
                answer:
                    "Yes, we respect your privacy. You can choose to donate anonymously, and your personal information will not be shared with the recipient.",
            },
        ],
        donor: [
            {
                question: "How do I create an account as a donor?",
                answer:
                    "Click on the 'Sign Up' button on the top right of the homepage, select 'Donor' as your account type, and follow the registration process. It takes just a few minutes to get started.",
            },
            {
                question: "Can I track my donations?",
                answer:
                    "Yes, all your donations are recorded in your dashboard. You can track the progress of campaigns you've contributed to and see how your donations are making an impact.",
            },
            {
                question: "What payment methods are accepted?",
                answer:
                    "We accept credit cards, debit cards, net banking, UPI, and digital wallets. All payment information is securely processed and not stored on our servers.",
            },
            {
                question: "Can I set up recurring donations?",
                answer:
                    "Yes, you can set up monthly recurring donations to causes you care about. This helps NGOs plan their activities with a predictable source of funding.",
            },
            {
                question: "How do I get a tax receipt for my donation?",
                answer:
                    "Tax receipts are automatically generated and sent to your registered email address. You can also download them from your dashboard at any time.",
            },
        ],
        ngo: [
            {
                question: "How do I register my NGO on the platform?",
                answer:
                    "Register through our 'Sign Up' page, select 'NGO' as the account type, and provide all required documentation for verification. Our team will review your application and approve it within 3-5 business days.",
            },
            {
                question: "What documents are required for NGO verification?",
                answer:
                    "You will need to provide your registration certificate, 80G certificate (if applicable), latest annual report, and board member details. Additional documents may be requested during the verification process.",
            },
            {
                question: "How do I create a campaign?",
                answer:
                    "Once verified, you can create campaigns from your dashboard. Provide detailed information about your campaign, including the fundraising goal, timeline, and how the funds will be utilized.",
            },
            {
                question: "What is the platform fee?",
                answer:
                    "We charge a nominal fee of 2% on all donations to maintain our operations. This fee is transparently communicated to donors at the time of donation.",
            },
            {
                question: "How and when will I receive the funds?",
                answer:
                    "Funds are transferred to your registered bank account on a weekly basis. You can also request immediate disbursement for urgent needs.",
            },
        ],
        receiver: [
            {
                question: "Who can register as a receiver?",
                answer:
                    "Individuals in genuine need of financial assistance for medical, educational, or emergency purposes can register as receivers. All applications go through a verification process.",
            },
            {
                question: "How do I verify my identity?",
                answer:
                    "You'll need to provide government-issued ID proof, address proof, and documents supporting your request (such as medical bills, college fee receipts, etc.).",
            },
            {
                question: "How do I create a request?",
                answer:
                    "Once verified, you can create requests from your dashboard. Be specific about your needs, provide supporting documents, and set a realistic fundraising goal.",
            },
            {
                question: "How long does it take to raise funds?",
                answer:
                    "The timeframe varies depending on the nature and urgency of your request. Urgent medical needs often receive faster responses. We recommend setting a reasonable timeline of 30-45 days.",
            },
            {
                question: "How will I receive the funds?",
                answer:
                    "Funds are directly transferred to the service provider (hospital, educational institution, etc.) whenever possible. In other cases, they're transferred to your verified bank account.",
            },
        ],
    }

    const filteredFaqs = Object.keys(faqs).reduce((result, category) => {
        if (searchQuery) {
            result[category] = faqs[category].filter(
                (item) =>
                    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
            )
        } else {
            result[category] = faqs[category]
        }
        return result
    }, {})

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2 text-center">Help & Support</h1>
                    <p className="text-center text-gray-600 mb-8">
                        Find answers to common questions or reach out to our support team for assistance
                    </p>

                    <div className="mb-6">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                <li className="inline-flex items-center">
                                    <Link href="/" className="text-gray-700 hover:text-blue-600 inline-flex items-center">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <span className="mx-2 text-gray-400">/</span>
                                        <span className="text-gray-500">Help & Support</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>

                    <div className="mb-8 relative">
                        <div className="relative">
                            <Input
                                type="search"
                                placeholder="Search for help topics..."
                                className="pl-10 pr-4 py-3"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        <div className="bg-white rounded-lg shadow-md p-5 border text-center hover:shadow-lg transition-shadow">
                            <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                                <HelpCircle className="h-7 w-7 text-blue-600" />
                            </div>
                            <h3 className="font-semibold mb-2">Knowledge Base</h3>
                            <p className="text-sm text-gray-600">Browse our FAQs to find answers to common questions</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-5 border text-center hover:shadow-lg transition-shadow">
                            <div className="bg-green-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="h-7 w-7 text-green-600" />
                            </div>
                            <h3 className="font-semibold mb-2">Live Chat</h3>
                            <p className="text-sm text-gray-600">Chat with our support team (available 9 AM to 6 PM)</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-5 border text-center hover:shadow-lg transition-shadow">
                            <div className="bg-purple-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="h-7 w-7 text-purple-600" />
                            </div>
                            <h3 className="font-semibold mb-2">Email Support</h3>
                            <p className="text-sm text-gray-600">Email us at support@samarthankriya.org</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-5 border text-center hover:shadow-lg transition-shadow">
                            <div className="bg-orange-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Phone className="h-7 w-7 text-orange-600" />
                            </div>
                            <h3 className="font-semibold mb-2">Phone Support</h3>
                            <p className="text-sm text-gray-600">Call us at +91 1234567890 (Mon-Fri, 9-5)</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
                        <div className="p-6 bg-blue-50 border-b">
                            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                            <p className="text-gray-600">Find answers to the most common questions about our platform</p>
                        </div>

                        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <div className="border-b">
                                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                                    <TabsTrigger
                                        value="general"
                                        className="data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3"
                                    >
                                        <HelpCircle className="h-4 w-4" />
                                        General
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="donor"
                                        className="data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3"
                                    >
                                        <Heart className="h-4 w-4" />
                                        For Donors
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="ngo"
                                        className="data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3"
                                    >
                                        <Database className="h-4 w-4" />
                                        For NGOs
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="receiver"
                                        className="data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3"
                                    >
                                        <HandHeart className="h-4 w-4" />
                                        For Receivers
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            {Object.keys(filteredFaqs).map((category) => (
                                <TabsContent key={category} value={category} className="p-6">
                                    {filteredFaqs[category].length > 0 ? (
                                        <Accordion type="single" collapsible className="w-full">
                                            {filteredFaqs[category].map((faq, index) => (
                                                <AccordionItem key={index} value={`item-${index}`}>
                                                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                                                    <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500">No results found for "{searchQuery}"</p>
                                            <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2">
                                                Clear search
                                            </Button>
                                        </div>
                                    )}
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
                        <div className="p-6 bg-blue-50 border-b">
                            <h2 className="text-2xl font-bold">Contact Support</h2>
                            <p className="text-gray-600">
                                Can't find what you're looking for? Reach out to our support team directly.
                            </p>
                        </div>

                        <div className="p-6">
                            {submitSuccess && (
                                <Alert className="mb-6 bg-green-50 border-green-200">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <AlertDescription className="text-green-700">
                                        Your message has been sent successfully. We'll get back to you soon!
                                    </AlertDescription>
                                </Alert>
                            )}

                            {submitError && (
                                <Alert className="mb-6 bg-red-50 border-red-200">
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                    <AlertDescription className="text-red-700">{submitError}</AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={handleContactSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Your Name</Label>
                                        <Input id="name" name="name" value={contactForm.name} onChange={handleContactFormChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={contactForm.email}
                                            onChange={handleContactFormChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        value={contactForm.subject}
                                        onChange={handleContactFormChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2 mb-6">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        value={contactForm.message}
                                        onChange={handleContactFormChange}
                                        required
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
                                        {isSubmitting ? "Sending..." : "Send Message"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

