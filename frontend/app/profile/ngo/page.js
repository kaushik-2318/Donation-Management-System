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
import { api, User } from "@/lib/api"
import { Edit, Save, Building, MapPin, Globe, Phone, Mail, FileText, CheckCircle } from "lucide-react"

export default function NGOProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAppSelector(selectAuth)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [ngoProfile, setNgoProfile] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    bio: "",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  })
  const [newAvatar, setNewAvatar] = useState(null)
  const [newDocuments, setNewDocuments] = useState([])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    if (user?.role !== "NGO") {
      router.push("/profile/donor")
      return
    }

    // Fetch NGO profile
    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call with the user's ID
        const profile = await api.users.getUserProfile("ngo1")

        if (profile) {
          setNgoProfile(profile)
          setFormData({
            name: profile.name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            address: profile.address || "",
            website: profile.website || "",
            bio: profile.bio || "",
            facebook: profile.socialLinks?.facebook || "",
            twitter: profile.socialLinks?.twitter || "",
            instagram: profile.socialLinks?.instagram || "",
            linkedin: profile.socialLinks?.linkedin || "",
          })
        }
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

    fetchProfile()
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

  const handleDocumentsUpload = (files) => {
    setNewDocuments(files)
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call to update the profile
      const updatedProfile = await api.users.updateUserProfile("ngo1", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        website: formData.website,
        bio: formData.bio,
        socialLinks: {
          facebook: formData.facebook,
          twitter: formData.twitter,
          instagram: formData.instagram,
          linkedin: formData.linkedin,
        },
      })

      // Handle avatar upload if there's a new one
      if (newAvatar) {
        await api.users.uploadProfileImage("ngo1", newAvatar)
      }

      // Handle documents upload if there are new ones
      if (newDocuments.length > 0) {
        for (const doc of newDocuments) {
          await api.users.uploadDocument("ngo1", doc)
        }
      }

      setNgoProfile(updatedProfile)
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

  if (isLoading && !ngoProfile) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center h-64">
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">NGO Profile</h1>
            <p className="text-muted-foreground">Manage your organization&#39;s information and documents</p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)} className="shadow-sm hover:shadow-md transition-shadow">
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
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="verification">Verification Status</TabsTrigger>
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
                    <AvatarImage src={ngoProfile?.avatar || ""} alt={ngoProfile?.name || "NGO"} />
                    <AvatarFallback className="text-lg bg-primary/10 text-primary">
                      {ngoProfile?.name?.charAt(0) || "N"}
                    </AvatarFallback>
                  </Avatar>

                  {isEditing ? (
                    <div className="w-full mb-4">
                      <Label htmlFor="avatar">Profile Picture</Label>
                      <FileUpload onUpload={handleAvatarUpload} multiple={false} accept="image/*" />
                    </div>
                  ) : null}

                  <h2 className="text-xl font-bold">{ngoProfile?.name}</h2>
                  <Badge
                    className="mt-1 mb-2"
                    variant={ngoProfile?.verificationStatus === "verified" ? "default" : "outline"}
                  >
                    {ngoProfile?.verificationStatus === "verified" ? (
                      <>
                        <CheckCircle className="mr-1 h-3 w-3" /> Verified
                      </>
                    ) : ngoProfile?.verificationStatus === "pending" ? (
                      "Verification Pending"
                    ) : (
                      "Not Verified"
                    )}
                  </Badge>

                  <div className="w-full space-y-2 mt-4 text-left">
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>Reg. No: {ngoProfile?.registrationNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{ngoProfile?.address || "No address provided"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={ngoProfile?.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {ngoProfile?.website || "No website provided"}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{ngoProfile?.phone || "No phone provided"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{ngoProfile?.email}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    {ngoProfile?.socialLinks?.facebook && (
                      <a
                        href={ngoProfile.socialLinks.facebook}
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
                          className="lucide lucide-facebook"
                        >
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                      </a>
                    )}
                    {ngoProfile?.socialLinks?.twitter && (
                      <a
                        href={ngoProfile.socialLinks.twitter}
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
                    )}
                    {ngoProfile?.socialLinks?.instagram && (
                      <a
                        href={ngoProfile.socialLinks.instagram}
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
                          className="lucide lucide-instagram"
                        >
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </svg>
                      </a>
                    )}
                    {ngoProfile?.socialLinks?.linkedin && (
                      <a
                        href={ngoProfile.socialLinks.linkedin}
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
                          className="lucide lucide-linkedin"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect width="4" height="12" x="2" y="9" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Profile Details Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>Update your organization&#39;s information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    // Edit mode
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Organization Name</Label>
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
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          name="website"
                          type="url"
                          value={formData.website}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Organization Description</Label>
                        <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={4} />
                      </div>

                      <div className="space-y-2">
                        <Label>Social Media Links</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="facebook">Facebook</Label>
                            <Input
                              id="facebook"
                              name="facebook"
                              type="url"
                              value={formData.facebook}
                              onChange={handleInputChange}
                              placeholder="https://facebook.com/yourpage"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="twitter">Twitter</Label>
                            <Input
                              id="twitter"
                              name="twitter"
                              type="url"
                              value={formData.twitter}
                              onChange={handleInputChange}
                              placeholder="https://twitter.com/yourhandle"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="instagram">Instagram</Label>
                            <Input
                              id="instagram"
                              name="instagram"
                              type="url"
                              value={formData.instagram}
                              onChange={handleInputChange}
                              placeholder="https://instagram.com/yourhandle"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input
                              id="linkedin"
                              name="linkedin"
                              type="url"
                              value={formData.linkedin}
                              onChange={handleInputChange}
                              placeholder="https://linkedin.com/company/yourcompany"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    // View mode
                    <>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">About Us</h3>
                          <p className="text-muted-foreground mt-1">{ngoProfile?.bio || "No description provided."}</p>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium">Contact Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                              <p className="text-sm font-medium">Email</p>
                              <p className="text-muted-foreground">{ngoProfile?.email}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Phone</p>
                              <p className="text-muted-foreground">{ngoProfile?.phone || "Not provided"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Address</p>
                              <p className="text-muted-foreground">{ngoProfile?.address || "Not provided"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Website</p>
                              <p className="text-muted-foreground">
                                {ngoProfile?.website ? (
                                  <a
                                    href={ngoProfile.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    {ngoProfile.website}
                                  </a>
                                ) : (
                                  "Not provided"
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium">Social Media</h3>
                          <div className="flex gap-4 mt-2">
                            {ngoProfile?.socialLinks?.facebook && (
                              <a
                                href={ngoProfile.socialLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-facebook"
                                >
                                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                </svg>
                                <span className="sr-only">Facebook</span>
                              </a>
                            )}
                            {ngoProfile?.socialLinks?.twitter && (
                              <a
                                href={ngoProfile.socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
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
                                <span className="sr-only">Twitter</span>
                              </a>
                            )}
                            {ngoProfile?.socialLinks?.instagram && (
                              <a
                                href={ngoProfile.socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-instagram"
                                >
                                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                </svg>
                                <span className="sr-only">Instagram</span>
                              </a>
                            )}
                            {ngoProfile?.socialLinks?.linkedin && (
                              <a
                                href={ngoProfile.socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-linkedin"
                                >
                                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                  <rect width="4" height="12" x="2" y="9" />
                                  <circle cx="4" cy="4" r="2" />
                                </svg>
                                <span className="sr-only">LinkedIn</span>
                              </a>
                            )}
                            {!ngoProfile?.socialLinks?.facebook &&
                              !ngoProfile?.socialLinks?.twitter &&
                              !ngoProfile?.socialLinks?.instagram &&
                              !ngoProfile?.socialLinks?.linkedin && (
                                <p className="text-muted-foreground">No social media links provided.</p>
                              )}
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

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Verification Documents</CardTitle>
                <CardDescription>These documents are used to verify your NGO&#39;s legitimacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Upload New Documents</Label>
                      <p className="text-sm text-muted-foreground">
                        Upload additional documents for verification. Accepted formats: PDF, JPG, PNG.
                      </p>
                      <FileUpload onUpload={handleDocumentsUpload} multiple={true} accept=".pdf,.jpg,.jpeg,.png" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Current Documents</h3>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                      {ngoProfile?.documents && ngoProfile.documents.length > 0 ? (
                        ngoProfile.documents.map((doc, index) => (
                          <div key={index} className="flex items-center p-3 border rounded-md">
                            <FileText className="h-6 w-6 text-muted-foreground mr-2" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">Document {index + 1}</p>
                              <p className="text-xs text-muted-foreground truncate">{doc}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="ml-2">
                              View
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground col-span-2">No documents uploaded yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {isEditing && (
                  <Button
                    className="w-full shadow-md hover:shadow-lg transition-shadow"
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Documents"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
                <CardDescription>Check the status of your NGO verification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center p-6 bg-muted/20 rounded-lg">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                      {ngoProfile?.verificationStatus === "verified" ? (
                        <CheckCircle className="h-8 w-8 text-primary" />
                      ) : (
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      {ngoProfile?.verificationStatus === "verified"
                        ? "Verified"
                        : ngoProfile?.verificationStatus === "pending"
                          ? "Verification Pending"
                          : "Not Verified"}
                    </h3>
                    <p className="text-muted-foreground">
                      {ngoProfile?.verificationStatus === "verified"
                        ? "Your NGO has been verified. You can now create campaigns and receive donations."
                        : ngoProfile?.verificationStatus === "pending"
                          ? "Your verification is in progress. This usually takes 2-3 business days."
                          : "Please upload the required documents to start the verification process."}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Verification Requirements</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>NGO Registration Certificate</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>80G Certificate (if applicable)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>FCRA Registration (if applicable)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>PAN Card of the Organization</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <span>Annual Reports (last 2 years)</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Need Help?</h3>
                  <p className="text-muted-foreground">
                    If you have any questions about the verification process or need assistance, please contact our
                    support team at{" "}
                    <a href="mailto:verification@samarthankriya.org" className="text-primary hover:underline">
                      verification@samarthankriya.org
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

