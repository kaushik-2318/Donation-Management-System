"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { register } from "@/lib/api"
import { User, Building2, Users } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("donor")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [commonFields, setCommonFields] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  })

  // NGO specific fields
  const [ngoFields, setNgoFields] = useState({
    organization_name: "",
    registration_number: "",
    founded_year: "",
    organization_description: "",
    website: "",
    social_media_links: "",
  })

  // Receiver specific fields
  const [receiverFields, setReceiverFields] = useState({
    idProof: "",
    bankDetails: "",
    reason: "",
  })

  const handleCommonFieldChange = (e) => {
    const { name, value } = e.target
    setCommonFields({
      ...commonFields,
      [name]: value,
    })
  }

  const handleNgoFieldChange = (e) => {
    const { name, value } = e.target
    setNgoFields({
      ...ngoFields,
      [name]: value,
    })
  }

  const handleReceiverFieldChange = (e) => {
    const { name, value } = e.target
    setReceiverFields({
      ...receiverFields,
      [name]: value,
    })
  }

  const validateForm = () => {
    if (!commonFields.name.trim()) return "Name is required"
    if (!commonFields.email.trim()) return "Email is required"
    if (!/\S+@\S+\.\S+/.test(commonFields.email)) return "Email is invalid"
    if (!commonFields.password) return "Password is required"
    if (commonFields.password.length < 8) return "Password must be at least 8 characters"
    if (commonFields.password !== commonFields.confirmPassword) return "Passwords do not match"
    if (!commonFields.phone.trim()) return "Phone number is required"
    if (activeTab === "ngo") {
      if (!ngoFields.organization_name.trim()) return "Organization name is required"
      if (!ngoFields.registration_number.trim()) return "Registration number is required"
      if (!ngoFields.founded_year) return "Founded year is required"
      if (!ngoFields.organization_description.trim()) return "Organization description is required"
    }
    if (activeTab === "receiver") {
      if (!receiverFields.reason.trim()) return "Reason for registration is required"
    }

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setIsLoading(false)
      return
    }

    try {
      // Combine form data based on active tab
      const formData = {
        full_name: commonFields.name,
        email: commonFields.email,
        password: commonFields.password,
        phone_number: commonFields.phone,
        address: commonFields.address,
        role: activeTab,
      }

      if (activeTab === "ngo") {
        // Convert social media links string to array
        const socialMediaArray = ngoFields.social_media_links
          ? ngoFields.social_media_links.split(",").map((link) => link.trim())
          : []

        formData.organization_name = ngoFields.organization_name
        formData.registration_number = ngoFields.registration_number
        formData.founded_year = Number.parseInt(ngoFields.founded_year)
        formData.organization_description = ngoFields.organization_description
        formData.website = ngoFields.website || ""
        formData.social_media_links = socialMediaArray
      } else if (activeTab === "receiver") {
        formData.receiverDetails = receiverFields
      }

      await register(formData)

      router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}&userType=${formData.role}`)
    } catch (err) {
      console.log(err)
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-lg shadow-md p-8 border">
            <div className="text-center mb-6">
              <Link href="/" className="inline-block">
                <h1 className="text-2xl font-bold text-blue-600">Samarthan Kriya</h1>
              </Link>
              <h2 className="text-2xl font-bold mt-6 mb-2">Create an Account</h2>
              <p className="text-gray-600">Join our community and make a difference</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>}

            <Tabs defaultValue="donor" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="donor" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Donor</span>
                </TabsTrigger>
                <TabsTrigger value="ngo" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>NGO</span>
                </TabsTrigger>
                <TabsTrigger value="receiver" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Receiver</span>
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Common Fields for All User Types */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={commonFields.name}
                      onChange={handleCommonFieldChange}
                      placeholder="John Doe"
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={commonFields.email}
                      onChange={handleCommonFieldChange}
                      placeholder="name@example.com"
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={commonFields.password}
                      onChange={handleCommonFieldChange}
                      placeholder="••••••••"
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={commonFields.confirmPassword}
                      onChange={handleCommonFieldChange}
                      placeholder="••••••••"
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={commonFields.phone}
                      onChange={handleCommonFieldChange}
                      placeholder="+91 98765 43210"
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={commonFields.address}
                      onChange={handleCommonFieldChange}
                      placeholder="Your address"
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* NGO Specific Fields */}
                <TabsContent value="ngo" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="organization_name">Organization Name</Label>
                      <Input
                        id="organization_name"
                        name="organization_name"
                        value={ngoFields.organization_name}
                        onChange={handleNgoFieldChange}
                        placeholder="Your NGO name"
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registration_number">Registration Number</Label>
                      <Input
                        id="registration_number"
                        name="registration_number"
                        value={ngoFields.registration_number}
                        onChange={handleNgoFieldChange}
                        placeholder="NGO registration number"
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="founded_year">Founded Year</Label>
                      <Input
                        id="founded_year"
                        name="founded_year"
                        type="number"
                        min="1800"
                        max={new Date().getFullYear()}
                        value={ngoFields.founded_year}
                        onChange={handleNgoFieldChange}
                        placeholder="e.g. 2010"
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website (Optional)</Label>
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        value={ngoFields.website}
                        onChange={handleNgoFieldChange}
                        placeholder="https://yourwebsite.org"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization_description">Organization Description</Label>
                    <Textarea
                      id="organization_description"
                      name="organization_description"
                      value={ngoFields.organization_description}
                      onChange={handleNgoFieldChange}
                      placeholder="Tell us about your organization and its mission"
                      rows={4}
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="social_media_links">Social Media Links (Optional)</Label>
                    <Input
                      id="social_media_links"
                      name="social_media_links"
                      value={ngoFields.social_media_links}
                      onChange={handleNgoFieldChange}
                      placeholder="Facebook, Twitter, Instagram links (comma separated)"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500">Enter links separated by commas</p>
                  </div>
                </TabsContent>

                {/* Receiver Specific Fields */}
                <TabsContent value="receiver" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="idProof">ID Proof</Label>
                    <Input
                      id="idProof"
                      name="idProof"
                      type="text"
                      value={receiverFields.idProof}
                      onChange={handleReceiverFieldChange}
                      placeholder="Enter your ID number (Aadhar, PAN, etc.)"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bankDetails">Bank Account Details</Label>
                    <Textarea
                      id="bankDetails"
                      name="bankDetails"
                      value={receiverFields.bankDetails}
                      onChange={handleReceiverFieldChange}
                      placeholder="Account number, IFSC code, bank name"
                      rows={2}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Registration</Label>
                    <Textarea
                      id="reason"
                      name="reason"
                      value={receiverFields.reason}
                      onChange={handleReceiverFieldChange}
                      placeholder="Explain why you're registering as a receiver"
                      rows={4}
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </TabsContent>

                <Button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

