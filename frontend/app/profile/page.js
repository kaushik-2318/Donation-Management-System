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
import { getProfile, updateProfile } from "@/lib/api"
import { Camera } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [userType, setUserType] = useState("")
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    avatar: null,
    // NGO specific fields
    organizationName: "",
    registrationNumber: "",
    website: "",
    // Receiver specific fields
    bankDetails: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      await updateProfile(profileData)
      setSuccess("Profile updated successfully")

      // Update user name in localStorage
      localStorage.setItem("userName", profileData.name)
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

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>}

          {success && <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">{success}</div>}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md border overflow-hidden">
              <div className="p-6 bg-orange-50 border-b flex flex-col items-center">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-4 border-white">
                    <AvatarImage
                      src={profileData.avatar ? URL.createObjectURL(profileData.avatar) : "/placeholder.svg"}
                      alt={profileData.name}
                    />
                    <AvatarFallback className="bg-orange-100 text-orange-800 text-2xl">
                      {profileData.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="avatar"
                    className="absolute bottom-0 right-0 bg-orange-600 text-white p-1 rounded-full cursor-pointer group-hover:bg-orange-700 transition-colors"
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
                <h2 className="text-xl font-bold mt-4">{profileData.name}</h2>
                <p className="text-gray-600 capitalize">{userType}</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      required
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleChange}
                      required
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={handleChange}
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={profileData.address}
                      onChange={handleChange}
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>

                {/* NGO specific fields */}
                {userType === "ngo" && (
                  <div className="space-y-6 border-t pt-6">
                    <h3 className="text-lg font-semibold">Organization Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="organizationName">Organization Name</Label>
                        <Input
                          id="organizationName"
                          name="organizationName"
                          value={profileData.organizationName}
                          onChange={handleChange}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="registrationNumber">Registration Number</Label>
                        <Input
                          id="registrationNumber"
                          name="registrationNumber"
                          value={profileData.registrationNumber}
                          onChange={handleChange}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        value={profileData.website}
                        onChange={handleChange}
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                )}

                {/* Receiver specific fields */}
                {userType === "receiver" && (
                  <div className="space-y-6 border-t pt-6">
                    <h3 className="text-lg font-semibold">Bank Details</h3>

                    <div className="space-y-2">
                      <Label htmlFor="bankDetails">Bank Account Information</Label>
                      <Textarea
                        id="bankDetails"
                        name="bankDetails"
                        value={profileData.bankDetails}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Account number, IFSC code, bank name"
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

