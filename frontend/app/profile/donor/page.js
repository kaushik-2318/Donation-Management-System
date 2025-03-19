"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/redux/hooks"
import { selectAuth } from "@/lib/redux/slices/authSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { FileUpload } from "@/components/file-upload"
import { api, User, Donation } from "@/lib/api"
import { Edit, Save, MapPin, Phone, Mail, Download, FileText, Award } from "lucide-react"

export default function DonorProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAppSelector(selectAuth)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [donorProfile, setDonorProfile] = useState < User | null > (null)
  const [donations, setDonations] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    twitter: "",
  })
  const [newAvatar, setNewAvatar] = useState < File | null > (null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    if (user?.role !== "DONOR") {
      router.push("/profile/ngo")
      return
    }

    // Fetch donor profile and donations
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // In a real app, these would be API calls with the user's ID
        const [profile, donationsList] = await Promise.all([
          api.users.getUserProfile("user1"),
          api.donations.getDonations("user1"),
        ])

        if (profile) {
          setDonorProfile(profile)
          setFormData({
            name: profile.name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            address: profile.address || "",
            bio: profile.bio || "",
            twitter: profile.socialLinks?.twitter || "",
          })
        }

        setDonations(donationsList)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading profile",
          description: "Could not load your profile information. Please try again later.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated, router, toast, user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarUpload = (files) => {
    if (files.length > 0) {
      setNewAvatar(files[0])
    }
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call to update the profile
      const updatedProfile = await api.users.updateUserProfile("user1", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        bio: formData.bio,
        socialLinks: {
          twitter: formData.twitter,
        },
      })

      // Handle avatar upload if there's a new one
      if (newAvatar) {
        await api.users.uploadProfileImage("user1", newAvatar)
      }

      setDonorProfile(updatedProfile)
      setIsEditing(false)

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: "Could not update your profile. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadReceipt = async (donationId) => {
    try {
      // In a real app, this would download the receipt
      toast({
        title: "Downloading receipt",
        description: "Your donation receipt is being downloaded.",
      })

      // Simulate download delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, this would open the receipt in a new tab or download it
      window.open(`https://example.com/receipts/receipt${donationId}.pdf`, "_blank")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error downloading receipt",
        description: "Could not download the receipt. Please try again later.",
      })
    }
  }

  if (isLoading && !donorProfile) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center h-64">
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  // Calculate total donated amount
  const totalDonated = donations.reduce((sum, donation) => sum + donation.amount, 0)

  // Determine badges based on total donation amount
  const badges = []
  if (totalDonated >= 500) badges.push("Bronze Donor")
  if (totalDonated >= 1000) badges.push("Silver Donor")
  if (totalDonated >= 2000) badges.push("Gold Donor")
  if (totalDonated >= 5000) badges.push("Platinum Donor")
  if (totalDonated >= 10000) badges.push("Diamond Donor")

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Donor Profile</h1>
            <p className="text-muted-foreground">Manage your profile and view your donation history</p>
          </div>
          <Button
            onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
            className="shadow-sm hover:shadow-md transition-shadow"
            disabled={isLoading && isEditing}
          >
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Profile Summary Card */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Profile Summary</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={donorProfile?.avatar || ""} alt={donorProfile?.name || "Donor"} />
                    <AvatarFallback className="text-lg bg-primary/10 text-primary">
                      {donorProfile?.name?.charAt(0) || "D"}
                    </AvatarFallback>
                  </Avatar>

                  {isEditing ? (
                    <div className="w-full mb-4">
                      <Label htmlFor="avatar">Profile Picture</Label>
                      <FileUpload onUpload={handleAvatarUpload} multiple={false} accept="image/*" />
                    </div>
                  ) : null}

                  <h2 className="text-xl font-bold">{donorProfile?.name}</h2>
                  {badges.length > 0 && <Badge className="mt-1 mb-2">{badges[badges.length - 1]}</Badge>}

                  <div className="w-full space-y-2 mt-4 text-left">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{donorProfile?.address || "No address provided"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{donorProfile?.phone || "No phone provided"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{donorProfile?.email}</span>
                    </div>
                  </div>

                  {donorProfile?.socialLinks?.twitter && (
                    <div className="mt-4">
                      <a
                        href={donorProfile.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-twitter"
                        >
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                        </svg>
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Profile Details Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    // Edit mode
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">About Me</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Tell us a bit about yourself and why you donate"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter Profile</Label>
                        <Input
                          id="twitter"
                          name="twitter"
                          type="url"
                          value={formData.twitter}
                          onChange={handleInputChange}
                          placeholder="https://twitter.com/yourhandle"
                        />
                      </div>
                    </>
                  ) : (
                    // View mode
                    <>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">About Me</h3>
                          <p className="text-muted-foreground mt-1">{donorProfile?.bio || "No bio provided."}</p>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium">Contact Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                              <p className="text-sm font-medium">Email</p>
                              <p className="text-muted-foreground">{donorProfile?.email}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Phone</p>
                              <p className="text-muted-foreground">{donorProfile?.phone || "Not provided"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Address</p>
                              <p className="text-muted-foreground">{donorProfile?.address || "Not provided"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Twitter</p>
                              <p className="text-muted-foreground">
                                {donorProfile?.socialLinks?.twitter ? (
                                  <a
                                    href={donorProfile.socialLinks.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    {donorProfile.socialLinks.twitter}
                                  </a>
                                ) : (
                                  "Not provided"
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium">Donation Summary</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                              <p className="text-sm font-medium">Total Donated</p>
                              <p className="text-xl font-bold text-primary">₹{totalDonated.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Donations Made</p>
                              <p className="text-xl font-bold">{donations.length}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter>
                  {isEditing && (
                    <div className="flex gap-2 w-full">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsEditing(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="w-full shadow-md hover:shadow-lg transition-shadow"
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="donations">
            <Card>
              <CardHeader>
                <CardTitle>Donation History</CardTitle>
                <CardDescription>View all your donations and download receipts</CardDescription>
              </CardHeader>
              <CardContent>
                {donations.length > 0 ? (
                  <div className="space-y-4">
                    <div className="rounded-md border">
                      <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
                        <div>Date</div>
                        <div className="col-span-2">Campaign</div>
                        <div className="text-right">Amount</div>
                        <div className="text-right">Receipt</div>
                      </div>
                      <div className="divide-y">
                        {donations.map((donation) => (
                          <div key={donation.id} className="grid grid-cols-5 gap-4 p-4 items-center">
                            <div className="text-sm text-muted-foreground">
                              {new Date(donation.date).toLocaleDateString()}
                            </div>
                            <div className="col-span-2">
                              <p className="font-medium">{donation.campaignName}</p>
                              <p className="text-xs text-muted-foreground">
                                Transaction ID: {donation.transactionId || "N/A"}
                              </p>
                            </div>
                            <div className="text-right font-medium">₹{donation.amount.toLocaleString()}</div>
                            <div className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => handleDownloadReceipt(donation.id)}
                              >
                                <Download className="h-3 w-3" />
                                <span>Receipt</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No donations yet</h3>
                    <p className="text-muted-foreground">
                      You haven&apos;t made any donations yet. Start making a difference today!
                    </p>
                    <Button className="mt-4 shadow-md hover:shadow-lg transition-shadow" asChild>
                      <a href="/posts">Browse Campaigns</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges">
            <Card>
              <CardHeader>
                <CardTitle>Your Badges</CardTitle>
                <CardDescription>Achievements you&apos;ve earned through your donations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {/* Bronze Badge */}
                  <Card className={badges.includes("Bronze Donor") ? "border-2 border-amber-600/20" : "opacity-50"}>
                    <CardContent className="pt-6 text-center">
                      <Award className="h-12 w-12 mx-auto mb-2 text-amber-600" />
                      <h3 className="text-lg font-medium">Bronze Donor</h3>
                      <p className="text-sm text-muted-foreground mt-1">Donated ₹500+</p>
                      {badges.includes("Bronze Donor") ? (
                        <Badge variant="outline" className="mt-4 bg-amber-600/10 text-amber-600 border-amber-600/20">
                          Achieved
                        </Badge>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-4">
                          Donate ₹{(500 - totalDonated).toLocaleString()}+ more to unlock
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Silver Badge */}
                  <Card className={badges.includes("Silver Donor") ? "border-2 border-slate-400/20" : "opacity-50"}>
                    <CardContent className="pt-6 text-center">
                      <Award className="h-12 w-12 mx-auto mb-2 text-slate-400" />
                      <h3 className="text-lg font-medium">Silver Donor</h3>
                      <p className="text-sm text-muted-foreground mt-1">Donated ₹1,000+</p>
                      {badges.includes("Silver Donor") ? (
                        <Badge variant="outline" className="mt-4 bg-slate-400/10 text-slate-500 border-slate-400/20">
                          Achieved
                        </Badge>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-4">
                          Donate ₹{(1000 - totalDonated).toLocaleString()}+ more to unlock
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Gold Badge */}
                  <Card className={badges.includes("Gold Donor") ? "border-2 border-yellow-500/20" : "opacity-50"}>
                    <CardContent className="pt-6 text-center">
                      <Award className="h-12 w-12 mx-auto mb-2 text-yellow-500" />
                      <h3 className="text-lg font-medium">Gold Donor</h3>
                      <p className="text-sm text-muted-foreground mt-1">Donated ₹2,000+</p>
                      {badges.includes("Gold Donor") ? (
                        <Badge variant="outline" className="mt-4 bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                          Achieved
                        </Badge>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-4">
                          Donate ₹{(2000 - totalDonated).toLocaleString()}+ more to unlock
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Platinum Badge */}
                  <Card className={badges.includes("Platinum Donor") ? "border-2 border-blue-500/20" : "opacity-50"}>
                    <CardContent className="pt-6 text-center">
                      <Award className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                      <h3 className="text-lg font-medium">Platinum Donor</h3>
                      <p className="text-sm text-muted-foreground mt-1">Donated ₹5,000+</p>
                      {badges.includes("Platinum Donor") ? (
                        <Badge variant="outline" className="mt-4 bg-blue-500/10 text-blue-600 border-blue-500/20">
                          Achieved
                        </Badge>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-4">
                          Donate ₹{(5000 - totalDonated).toLocaleString()}+ more to unlock
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Diamond Badge */}
                  <Card className={badges.includes("Diamond Donor") ? "border-2 border-purple-500/20" : "opacity-50"}>
                    <CardContent className="pt-6 text-center">
                      <Award className="h-12 w-12 mx-auto mb-2 text-purple-500" />
                      <h3 className="text-lg font-medium">Diamond Donor</h3>
                      <p className="text-sm text-muted-foreground mt-1">Donated ₹10,000+</p>
                      {badges.includes("Diamond Donor") ? (
                        <Badge variant="outline" className="mt-4 bg-purple-500/10 text-purple-600 border-purple-500/20">
                          Achieved
                        </Badge>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-4">
                          Donate ₹{(10000 - totalDonated).toLocaleString()}+ more to unlock
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

