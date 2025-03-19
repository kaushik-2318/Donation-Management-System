"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { selectAuth } from "@/lib/redux/slices/authSlice"
import { addPost } from "@/lib/redux/slices/postSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreatePostPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector(selectAuth)
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    proofLink: "",
  })

  // Redirect if not authenticated or not NGO/RECEIVER
  if (!isAuthenticated || (user?.role !== "NGO" && user?.role !== "RECEIVER")) {
    router.push("/auth/login")
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form
      if (!formData.title || !formData.description || !formData.goal) {
        throw new Error("Please fill in all required fields")
      }

      const goalAmount = Number.parseFloat(formData.goal)
      if (isNaN(goalAmount) || goalAmount <= 0) {
        throw new Error("Please enter a valid goal amount")
      }

      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful post creation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newPost = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        goal: goalAmount,
        raised: 0,
        creatorId: user?.id || "",
        creatorName: user?.name || "",
        creatorType: user?.role as "NGO" | "RECEIVER",
        proofLink: formData.proofLink || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "active",
      }

      dispatch(addPost(newPost as any))

      toast({
        title: "Campaign created successfully",
        description: "Your donation campaign has been published.",
      })

      router.push("/posts")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating campaign",
        description: error.message || "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link href="/posts">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create Donation Campaign</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>Create a new donation campaign to raise funds for your cause.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter a clear, descriptive title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Campaign Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your campaign and why you need donations"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Funding Goal (₹) *</Label>
              <Input
                id="goal"
                name="goal"
                type="number"
                placeholder="Enter amount in INR"
                min="1"
                step="1"
                value={formData.goal}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proofLink">
                Proof Document Link <span className="text-muted-foreground">(Google Drive)</span>
              </Label>
              <Input
                id="proofLink"
                name="proofLink"
                placeholder="https://drive.google.com/file/..."
                value={formData.proofLink}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">
                Upload supporting documents to a Google Drive folder and share the link here.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/posts">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Campaign"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

