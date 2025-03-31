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
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getSettings, updateSettings, changePassword, requestEmailChange, changeEmail, deleteAccount } from "@/lib/api"
import { AlertCircle, CheckCircle, Mail, Lock, Trash } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("account")
  const [emailChangeStep, setEmailChangeStep] = useState(1) // 1: Request, 2: Verify OTP
  const [isDeleting, setIsDeleting] = useState(false)

  const [accountSettings, setAccountSettings] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [emailChangeData, setEmailChangeData] = useState({
    currentPassword: "",
    newEmail: "",
    otp: "",
  })

  const [deleteAccountData, setDeleteAccountData] = useState({
    password: "",
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

  const handleEmailChangeDataChange = (e) => {
    const { name, value } = e.target
    setEmailChangeData({
      ...emailChangeData,
      [name]: value,
    })
  }

  const handleDeleteAccountDataChange = (e) => {
    const { name, value } = e.target
    setDeleteAccountData({
      ...deleteAccountData,
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

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")
    setSuccess("")

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
    try {
      await changePassword(accountSettings.currentPassword, accountSettings.newPassword)
      setSuccess("Password changed successfully")

      setAccountSettings({
        ...accountSettings,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (err) {
      setError(err.message || "Failed to change password")
    } finally {
      setIsSaving(false)
    }
  }

  const handleRequestEmailChange = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")
    setSuccess("")

    if (!emailChangeData.currentPassword) {
      setError("Current password is required to change email")
      setIsSaving(false)
      return
    }

    if (!emailChangeData.newEmail || !/\S+@\S+\.\S+/.test(emailChangeData.newEmail)) {
      setError("Please enter a valid email address")
      setIsSaving(false)
      return
    }

    try {
      await requestEmailChange(emailChangeData.currentPassword, emailChangeData.newEmail)
      setSuccess("Verification code sent to your new email address")
      setEmailChangeStep(2)
    } catch (err) {
      setError(err.message || "Failed to request email change")
    } finally {
      setIsSaving(false)
    }
  }

  const handleVerifyEmailChange = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")
    setSuccess("")

    if (!emailChangeData.otp) {
      setError("Please enter the verification code")
      setIsSaving(false)
      return
    }

    try {
      await changeEmail(emailChangeData.newEmail, emailChangeData.otp)
      setSuccess("Email changed successfully")

      setAccountSettings({
        ...accountSettings,
        email: emailChangeData.newEmail,
      })

      setEmailChangeData({
        currentPassword: "",
        newEmail: "",
        otp: "",
      })

      setEmailChangeStep(1)
    } catch (err) {
      setError(err.message || "Failed to verify email change")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    setError("")
    try {
      await deleteAccount(deleteAccountData.password)
      localStorage.clear()
      router.push("/")
    } catch (err) {
      setError(err.message || "Failed to delete account")
      setIsDeleting(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsSaving(true)
    setError("")
    setSuccess("")
    
    console.log("Saving notification settings:", notificationSettings)

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

    console.log("Saving privacy settings:", privacySettings)

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

          {/* Add breadcrumb navigation */}
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
                    <span className="text-gray-500">Settings</span>
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
              <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b">
                  <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                    <TabsTrigger
                      value="account"
                      className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      Account
                    </TabsTrigger>
                    <TabsTrigger
                      value="notifications"
                      className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger
                      value="privacy"
                      className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      Privacy
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="account" className="p-6 space-y-6">
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-blue-900">Email Address</h3>
                          <p className="text-sm text-blue-700 mb-2">{accountSettings.email}</p>
                          <p className="text-xs text-blue-600">
                            Your email is used for login and notifications. Changing it requires verification.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Mail className="mr-2 h-5 w-5 text-gray-500" />
                        Change Email
                      </h3>

                      {emailChangeStep === 1 ? (
                        <form onSubmit={handleRequestEmailChange} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                              id="currentPassword"
                              name="currentPassword"
                              type="password"
                              value={emailChangeData.currentPassword}
                              onChange={handleEmailChangeDataChange}
                              required
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="newEmail">New Email Address</Label>
                            <Input
                              id="newEmail"
                              name="newEmail"
                              type="email"
                              value={emailChangeData.newEmail}
                              onChange={handleEmailChangeDataChange}
                              required
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>

                          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSaving}>
                            {isSaving ? "Sending..." : "Send Verification Code"}
                          </Button>
                        </form>
                      ) : (
                        <form onSubmit={handleVerifyEmailChange} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="otp">Verification Code</Label>
                            <Input
                              id="otp"
                              name="otp"
                              value={emailChangeData.otp}
                              onChange={handleEmailChangeDataChange}
                              required
                              placeholder="Enter the 6-digit code sent to your new email"
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSaving}>
                              {isSaving ? "Verifying..." : "Verify & Change Email"}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setEmailChangeStep(1)}>
                              Back
                            </Button>
                          </div>
                        </form>
                      )}
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Lock className="mr-2 h-5 w-5 text-gray-500" />
                        Change Password
                      </h3>

                      <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={accountSettings.currentPassword}
                            onChange={handleAccountChange}
                            required
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                            required
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                            required
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>

                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSaving}>
                          {isSaving ? "Changing..." : "Change Password"}
                        </Button>
                      </form>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center text-red-600">
                        <Trash className="mr-2 h-5 w-5" />
                        Delete Account
                      </h3>

                      <p className="text-gray-600 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                            Delete Account
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your account and remove your
                              data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <div className="space-y-2 py-4">
                            <Label htmlFor="deletePassword" className="text-red-600">
                              Enter your password to confirm
                            </Label>
                            <Input
                              id="deletePassword"
                              name="password"
                              type="password"
                              value={deleteAccountData.password}
                              onChange={handleDeleteAccountDataChange}
                              required
                              className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                            />
                          </div>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteAccount}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={isDeleting}
                            >
                              {isDeleting ? "Deleting..." : "Delete Account"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
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
                        className="data-[state=checked]:bg-blue-600"
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
                        className="data-[state=checked]:bg-blue-600"
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
                            className="data-[state=checked]:bg-blue-600"
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
                            className="data-[state=checked]:bg-blue-600"
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
                            className="data-[state=checked]:bg-blue-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveNotifications}
                      className="bg-blue-600 hover:bg-blue-700"
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
                        className="data-[state=checked]:bg-blue-600"
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
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSavePrivacy} className="bg-blue-600 hover:bg-blue-700" disabled={isSaving}>
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