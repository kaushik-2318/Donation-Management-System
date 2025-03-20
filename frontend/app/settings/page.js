"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackgroundAnimation from "@/components/background-animation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSettings, updateSettings } from "@/lib/api"

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("account")

  const [accountSettings, setAccountSettings] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    campaignUpdates: true,
    donationReceipts: true,
    marketingEmails: false,
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showDonationAmount: true,
    showInLeaderboard: true,
  })

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/auth/login")
      return
    }

    const fetchSettings = async () => {
      try {
        const data = await getSettings()

        // Update state with fetched settings
        if (data.account) {
          setAccountSettings({
            ...accountSettings,
            email: data.account.email,
          })
        }

        if (data.notifications) {
          setNotificationSettings(data.notifications)
        }

        if (data.privacy) {
          setPrivacySettings(data.privacy)
        }
      } catch (err) {
        setError("Failed to load settings")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [router])

  const handleAccountChange = (e) => {
    const { name, value } = e.target
    setAccountSettings({
      ...accountSettings,
      [name]: value,
    })
  }

  const handleNotificationChange = (name, checked) => {
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    })
  }

  const handlePrivacyChange = (name, value) => {
    setPrivacySettings({
      ...privacySettings,
      [name]: value,
    })
  }

  const handleSaveAccount = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")
    setSuccess("")

    // Validate passwords if changing
    if (accountSettings.newPassword) {
      if (accountSettings.newPassword !== accountSettings.confirmPassword) {
        setError("New passwords do not match")
        setIsSaving(false)
        return
      }

      if (!accountSettings.currentPassword) {
        setError("Current password is required to set a new password")
        setIsSaving(false)
        return
      }
    }

    try {
      await updateSettings({ account: accountSettings })
      setSuccess("Account settings updated successfully")

      // Clear password fields after successful update
      setAccountSettings({
        ...accountSettings,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (err) {
      setError(err.message || "Failed to update account settings")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      await updateSettings({ notifications: notificationSettings })
      setSuccess("Notification settings updated successfully")
    } catch (err) {
      setError(err.message || "Failed to update notification settings")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSavePrivacy = async () => {
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      await updateSettings({ privacy: privacySettings })
      setSuccess("Privacy settings updated successfully")
    } catch (err) {
      setError(err.message || "Failed to update privacy settings")
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
          <h1 className="text-3xl font-bold mb-6">Settings</h1>

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>}

          {success && <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">{success}</div>}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md border overflow-hidden">
              <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b">
                  <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                    <TabsTrigger
                      value="account"
                      className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-orange-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      Account
                    </TabsTrigger>
                    <TabsTrigger
                      value="notifications"
                      className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-orange-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger
                      value="privacy"
                      className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-orange-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      Privacy
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="account" className="p-6 space-y-6">
                  <form onSubmit={handleSaveAccount} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={accountSettings.email}
                        onChange={handleAccountChange}
                        required
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">Change Password</h3>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={accountSettings.currentPassword}
                            onChange={handleAccountChange}
                            className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={accountSettings.newPassword}
                            onChange={handleAccountChange}
                            className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={accountSettings.confirmPassword}
                            onChange={handleAccountChange}
                            className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="notifications" className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                        className="data-[state=checked]:bg-orange-600"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">SMS Notifications</h3>
                        <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                      </div>
                      <Switch
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)}
                        className="data-[state=checked]:bg-orange-600"
                      />
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-4">Notification Types</h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Campaign Updates</h4>
                            <p className="text-sm text-gray-500">Get updates on campaigns you've donated to</p>
                          </div>
                          <Switch
                            checked={notificationSettings.campaignUpdates}
                            onCheckedChange={(checked) => handleNotificationChange("campaignUpdates", checked)}
                            className="data-[state=checked]:bg-orange-600"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Donation Receipts</h4>
                            <p className="text-sm text-gray-500">Receive receipts for your donations</p>
                          </div>
                          <Switch
                            checked={notificationSettings.donationReceipts}
                            onCheckedChange={(checked) => handleNotificationChange("donationReceipts", checked)}
                            className="data-[state=checked]:bg-orange-600"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Marketing Emails</h4>
                            <p className="text-sm text-gray-500">Receive marketing and promotional emails</p>
                          </div>
                          <Switch
                            checked={notificationSettings.marketingEmails}
                            onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
                            className="data-[state=checked]:bg-orange-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveNotifications}
                      className="bg-orange-600 hover:bg-orange-700"
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="privacy" className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profileVisibility">Profile Visibility</Label>
                      <select
                        id="profileVisibility"
                        value={privacySettings.profileVisibility}
                        onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                      >
                        <option value="public">Public - Anyone can view your profile</option>
                        <option value="registered">
                          Registered Users - Only registered users can view your profile
                        </option>
                        <option value="private">Private - Only you can view your profile</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Show Donation Amounts</h3>
                        <p className="text-sm text-gray-500">Display the amount you've donated on your profile</p>
                      </div>
                      <Switch
                        checked={privacySettings.showDonationAmount}
                        onCheckedChange={(checked) => handlePrivacyChange("showDonationAmount", checked)}
                        className="data-[state=checked]:bg-orange-600"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Show in Leaderboard</h3>
                        <p className="text-sm text-gray-500">Allow your name to appear in the donor leaderboard</p>
                      </div>
                      <Switch
                        checked={privacySettings.showInLeaderboard}
                        onCheckedChange={(checked) => handlePrivacyChange("showInLeaderboard", checked)}
                        className="data-[state=checked]:bg-orange-600"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSavePrivacy}
                      className="bg-orange-600 hover:bg-orange-700"
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

