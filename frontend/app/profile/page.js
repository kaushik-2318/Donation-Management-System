"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackgroundAnimation from "@/components/background-animation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProfile, updateProfile } from "@/lib/api"
import { Camera, AlertCircle, CheckCircle, Facebook, Twitter, Instagram, Linkedin, Globe, Github } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [userType, setUserType] = useState("")
  const [activeTab, setActiveTab] = useState("personal")
  const [profileData, setProfileData] = useState({
    full_name: "",
    phone_number: "",
    address: "",
    bio: "",
    avatar: null,
    // Social media links
    social_media: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      github: "",
      website: "",
    },
    // NGO specific fields
    organization_name: "",
    registration_number: "",
    website: "",
    // Receiver specific fields
    bank_details: "",
    reason_for_registration: "",
    id_proof: "",
  })

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    const storedUserType = localStorage.getItem("userType")

    if (!token) {
      router.push("/auth/login")
      return
    }

    setUserType(storedUserType)

    const fetchProfile = async () => {
      try {
        const data = await getProfile()
        setProfileData({
          ...profileData,
          ...data,
          social_media: data.social_media || {
            facebook: "",
            twitter: "",
            instagram: "",
            linkedin: "",
            github: "",
            website: "",
          },
        })
      } catch (err) {
        setError("Failed to load profile data")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    if (type === "file") {
      setProfileData({
        ...profileData,
        [name]: files[0],
      })
    } else {
      setProfileData({
        ...profileData,
        [name]: value,
      })
    }
  }

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target
    setProfileData({
      ...profileData,
      social_media: {
        ...profileData.social_media,
        [name]: value,
      },
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")
    setSuccess("")

    let filteredData = {
      full_name: profileData.full_name,
      phone_number: profileData.phone_number,
      address: profileData.address,
      bio: profileData.bio,
      social_media: profileData.social_media,
    }

    if (userType === "ngo") {
      filteredData = {
        ...filteredData,
        organization_name: profileData.organization_name,
        registration_number: profileData.registration_number,
        website: profileData.website,
      }
    } else if (userType === "receiver") {
      filteredData = {
        ...filteredData,
        bank_details: profileData.bank_details,
        reason_for_registration: profileData.reason_for_registration,
        id_proof: profileData.id_proof,
      }
    }

    try {
      await updateProfile(filteredData)
      setSuccess("Profile updated successfully")
      localStorage.setItem("userName", profileData.full_name)
    } catch (err) {
      setError(err.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundAnimation />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

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
                    <span className="text-gray-500">Profile</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {error && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md border overflow-hidden">
              <div className="p-6 bg-blue-50 border-b flex flex-col items-center">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-4 border-white">
                    <AvatarImage
                      src={profileData.avatar ? URL.createObjectURL(profileData.avatar) : "/placeholder.svg"}
                      alt={profileData.full_name}
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-800 text-2xl">
                      {profileData.full_name ? profileData.full_name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="avatar"
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer group-hover:bg-blue-700 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      id="avatar"
                      name="avatar"
                      className="hidden"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <h2 className="text-xl font-bold mt-4">{profileData.full_name}</h2>
                <p className="text-gray-600 capitalize">{userType}</p>

                <div className="flex mt-4 space-x-3">
                  {profileData.social_media?.facebook && (
                    <a
                      href={profileData.social_media.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Facebook size={20} />
                    </a>
                  )}
                  {profileData.social_media?.twitter && (
                    <a
                      href={profileData.social_media.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Twitter size={20} />
                    </a>
                  )}
                  {profileData.social_media?.instagram && (
                    <a
                      href={profileData.social_media.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-800"
                    >
                      <Instagram size={20} />
                    </a>
                  )}
                  {profileData.social_media?.linkedin && (
                    <a
                      href={profileData.social_media.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:text-blue-900"
                    >
                      <Linkedin size={20} />
                    </a>
                  )}
                  {profileData.social_media?.github && (
                    <a
                      href={profileData.social_media.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 hover:text-gray-900"
                    >
                      <Github size={20} />
                    </a>
                  )}
                  {profileData.social_media?.website && (
                    <a
                      href={profileData.social_media.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800"
                    >
                      <Globe size={20} />
                    </a>
                  )}
                </div>
              </div>

              <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b">
                  {userType === "ngo" ? (
                    // For NGO users, don't render the social media TabsTrigger
                    <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                      <TabsTrigger
                        value="personal"
                        className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                      >
                        Personal Info
                      </TabsTrigger>
                      <TabsTrigger
                        value="organization"
                        className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                      >
                        Organization
                      </TabsTrigger>
                    </TabsList>
                  ) : (
                    // For other users, render all tabs
                    <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                      <TabsTrigger
                        value="personal"
                        className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                      >
                        Personal Info
                      </TabsTrigger>
                      <TabsTrigger
                        value="social"
                        className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                      >
                        Social Media
                      </TabsTrigger>
                      {userType === "receiver" && (
                        <TabsTrigger
                          value="verification"
                          className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                          Verification
                        </TabsTrigger>
                      )}
                    </TabsList>
                  )}
                </div>

                <form onSubmit={handleSubmit}>
                  <TabsContent value="personal" className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          name="full_name"
                          value={profileData.full_name || ""}
                          onChange={handleChange}
                          required
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <Input
                          id="phone_number"
                          name="phone_number"
                          type="tel"
                          value={profileData.phone_number || ""}
                          onChange={handleChange}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={profileData.address || ""}
                        onChange={handleChange}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    {userType === "ngo" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="website" className="flex items-center">
                            <Globe className="mr-2 h-4 w-4 text-green-600" /> Website
                          </Label>
                          <Input
                            id="website"
                            name="website"
                            type="url"
                            placeholder="https://yourwebsite.com"
                            value={profileData.website || ""}
                            onChange={handleChange}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="social_media" className="flex items-center">
                            <Facebook className="mr-2 h-4 w-4 text-blue-600" /> Social Media URL
                          </Label>
                          <Input
                            id="social_media"
                            name="social_media"
                            type="url"
                            placeholder="https://facebook.com/yourorganization"
                            value={profileData.social_media?.url || ""}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                social_media: {
                                  ...profileData.social_media,
                                  url: e.target.value,
                                },
                              })
                            }
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <p className="text-xs text-gray-500">Enter your primary social media profile URL</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="foundation_year">Foundation Year</Label>
                          <Input
                            id="foundation_year"
                            name="foundation_year"
                            type="number"
                            min="1800"
                            max={new Date().getFullYear()}
                            placeholder="e.g. 2010"
                            value={profileData.foundation_year || ""}
                            onChange={handleChange}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio || ""}
                        onChange={handleChange}
                        rows={4}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="social" className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="facebook" className="flex items-center">
                          <Facebook className="mr-2 h-4 w-4 text-blue-600" /> Facebook
                        </Label>
                        <Input
                          id="facebook"
                          name="facebook"
                          type="url"
                          placeholder="https://facebook.com/username"
                          value={profileData.social_media?.facebook || ""}
                          onChange={handleSocialMediaChange}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="twitter" className="flex items-center">
                          <Twitter className="mr-2 h-4 w-4 text-blue-500" /> Twitter
                        </Label>
                        <Input
                          id="twitter"
                          name="twitter"
                          type="url"
                          placeholder="https://twitter.com/username"
                          value={profileData.social_media?.twitter || ""}
                          onChange={handleSocialMediaChange}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="instagram" className="flex items-center">
                          <Instagram className="mr-2 h-4 w-4 text-pink-600" /> Instagram
                        </Label>
                        <Input
                          id="instagram"
                          name="instagram"
                          type="url"
                          placeholder="https://instagram.com/username"
                          value={profileData.social_media?.instagram || ""}
                          onChange={handleSocialMediaChange}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="linkedin" className="flex items-center">
                          <Linkedin className="mr-2 h-4 w-4 text-blue-700" /> LinkedIn
                        </Label>
                        <Input
                          id="linkedin"
                          name="linkedin"
                          type="url"
                          placeholder="https://linkedin.com/in/username"
                          value={profileData.social_media?.linkedin || ""}
                          onChange={handleSocialMediaChange}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="github" className="flex items-center">
                          <Github className="mr-2 h-4 w-4 text-gray-800" /> GitHub
                        </Label>
                        <Input
                          id="github"
                          name="github"
                          type="url"
                          placeholder="https://github.com/username"
                          value={profileData.social_media?.github || ""}
                          onChange={handleSocialMediaChange}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website" className="flex items-center">
                          <Globe className="mr-2 h-4 w-4 text-green-600" /> Website
                        </Label>
                        <Input
                          id="website"
                          name="website"
                          type="url"
                          placeholder="https://yourwebsite.com"
                          value={profileData.social_media?.website || ""}
                          onChange={handleSocialMediaChange}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {userType === "ngo" && (
                    <TabsContent value="organization" className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="organization_name">Organization Name</Label>
                          <Input
                            id="organization_name"
                            name="organization_name"
                            value={profileData.organization_name || ""}
                            onChange={handleChange}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="registration_number">Registration Number</Label>
                          <Input
                            id="registration_number"
                            name="registration_number"
                            value={profileData.registration_number || ""}
                            onChange={handleChange}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  )}

                  {userType === "receiver" && (
                    <TabsContent value="verification" className="p-6 space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="id_proof">ID Proof</Label>
                        <Input
                          id="id_proof"
                          name="id_proof"
                          value={profileData.id_proof || ""}
                          onChange={handleChange}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bank_details">Bank Account Information</Label>
                        <Textarea
                          id="bank_details"
                          name="bank_details"
                          value={profileData.bank_details || ""}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Account number, IFSC code, bank name"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reason_for_registration">Reason for Registration</Label>
                        <Textarea
                          id="reason_for_registration"
                          name="reason_for_registration"
                          value={profileData.reason_for_registration || ""}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Please explain why you are registering as a receiver"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </TabsContent>
                  )}

                  <div className="p-6 border-t">
                    <div className="flex justify-end">
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                </form>
              </Tabs>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}