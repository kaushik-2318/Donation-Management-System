"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useAppDispatch } from "@/lib/redux/hooks"
import { login } from "@/lib/redux/slices/authSlice"
import { api } from "@/lib/api"
import { FileUpload } from "@/components/file-upload"
import { toast } from "sonner"


export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState("donor")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()

  // Common form fields
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
    registrationNumber: "",
    website: "",
    description: "",
    documents: [],
  })

  // Receiver specific fields
  const [receiverFields, setReceiverFields] = useState({
    purpose: "",
    idProof: null
  })
  const handleCommonFieldChange = (e) => {
    const { name, value } = e.target
    setCommonFields((prev) => ({ ...prev, [name]: value }))
  }

  const handleNgoFieldChange = (e) => {
    const { name, value } = e.target
    setNgoFields((prev) => ({ ...prev, [name]: value }))
  }

  const handleReceiverFieldChange = (e) => {
    const { name, value } = e.target
    setReceiverFields((prev) => ({ ...prev, [name]: value }))
  }

  const handleNgoDocumentsUpload = (files) => {
    setNgoFields((prev) => ({ ...prev, documents: files }))
  }

  const handleReceiverIdProofUpload = (file) => {
    setReceiverFields((prev) => ({ ...prev, idProof: file }))
  }

  const validateForm = () => {
    // Check common fields
    if (!commonFields.name || !commonFields.email || !commonFields.password) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      })
      return false
    }

    if (commonFields.password !== commonFields.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
      })
      return false
    }

    // Check role-specific fields
    if (activeTab === "ngo") {
      if (!ngoFields.registrationNumber) {
        toast({
          variant: "destructive",
          title: "Missing information",
          description: "Please provide your NGO registration number.",
        })
        return false
      }
      if (ngoFields.documents.length === 0) {
        toast({
          variant: "destructive",
          title: "Missing documents",
          description: "Please upload verification documents for your NGO.",
        })
        return false
      }
    } else if (activeTab === "receiver") {
      if (!receiverFields.purpose) {
        toast({
          variant: "destructive",
          title: "Missing information",
          description: "Please provide the purpose for registration.",
        })
        return false
      }
      if (!receiverFields.idProof) {
        toast({
          variant: "destructive",
          title: "Missing ID proof",
          description: "Please upload an ID proof document.",
        })
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll use our mock API
      const userData = {
        name: commonFields.name,
        email: commonFields.email,
        password: commonFields.password,
        role: activeTab.toUpperCase(),
        phone: commonFields.phone,
        address: commonFields.address,
        ...(activeTab === "ngo" && {
          registrationNumber: ngoFields.registrationNumber,
          website: ngoFields.website,
          bio: ngoFields.description,
          documents: ngoFields.documents,
        }),
        ...(activeTab === "receiver" && {
          purpose: receiverFields.purpose,
          idProof: receiverFields.idProof,
        }),
      }

      const user = await api.auth.register(userData)

      dispatch(login(user))

      toast({
        title: "Registration successful",
        description: `Welcome to Samarthan Kriya${activeTab === "ngo" ? ". Your NGO verification is pending." : "!"}`,
      })

      router.push(`/dashboard/${activeTab}`)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Please check your information and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-10">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[500px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Choose your account type and enter your information</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="donor">Donor</TabsTrigger>
            <TabsTrigger value="ngo">NGO</TabsTrigger>
            <TabsTrigger value="receiver">Receiver</TabsTrigger>
          </TabsList>

          <Card className="mt-4">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>
                  {activeTab === "donor"
                    ? "Register as a Donor"
                    : activeTab === "ngo"
                      ? "Register as an NGO"
                      : "Register as a Receiver"}
                </CardTitle>
                <CardDescription>
                  {activeTab === "donor"
                    ? "Create an account to start donating to causes you care about"
                    : activeTab === "ngo"
                      ? "Register your NGO to raise funds for your causes"
                      : "Register to request financial assistance for your needs"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Common Fields for all user types */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={commonFields.name}
                    onChange={handleCommonFieldChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={commonFields.email}
                    onChange={handleCommonFieldChange}
                    required
                  />
                </div>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={commonFields.password}
                      onChange={handleCommonFieldChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={commonFields.confirmPassword}
                      onChange={handleCommonFieldChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={commonFields.phone}
                    onChange={handleCommonFieldChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="Your address"
                    value={commonFields.address}
                    onChange={handleCommonFieldChange}
                    rows={2}
                  />
                </div>

                {/* NGO-specific fields */}
                <TabsContent value="ngo" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">
                      NGO Registration Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="registrationNumber"
                      name="registrationNumber"
                      type="text"
                      placeholder="e.g., NGO123456"
                      value={ngoFields.registrationNumber}
                      onChange={handleNgoFieldChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      placeholder="https://your-ngo.org"
                      value={ngoFields.website}
                      onChange={handleNgoFieldChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">NGO Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your NGO's mission and activities"
                      value={ngoFields.description}
                      onChange={handleNgoFieldChange}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Verification Documents <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Please upload your NGO registration certificate and other relevant documents
                    </p>
                    <FileUpload onUpload={handleNgoDocumentsUpload} multiple={true} accept=".pdf,.jpg,.jpeg,.png" />
                  </div>
                </TabsContent>

                {/* Receiver-specific fields */}
                <TabsContent value="receiver" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="purpose">
                      Purpose of Registration <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="purpose"
                      name="purpose"
                      placeholder="Explain why you need financial assistance"
                      value={receiverFields.purpose}
                      onChange={handleReceiverFieldChange}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      ID Proof <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Please upload a government-issued ID proof (Aadhar, PAN, etc.)
                    </p>
                    <FileUpload
                      onUpload={(files) => handleReceiverIdProofUpload(files[0])}
                      multiple={false}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>
                </TabsContent>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button
                  className="w-full shadow-md hover:shadow-lg transition-shadow"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  By clicking &quot;Create account&quot;, you agree to our{" "}
                  <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </CardFooter>
            </form>
          </Card>
        </Tabs>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

