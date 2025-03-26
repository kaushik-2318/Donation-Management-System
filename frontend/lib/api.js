import axios from "axios"
import getJWTId from "./getJWTID"

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

// Authentication APIs
export const register = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, formData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed.")
  }
}

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed.")
  }
}

// Verify-Email OTP API Call
export const verifyOTP = async (otp, email, role) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, { otp, email, role })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to verify OTP")
  }
}

// Resend Verification Email API Call
export const resendVerificationEmail = async (email, phone, role) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/resend-otp`, { email, phone, role })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to resend verification email")
  }
}

// User Profile APIs
export const getProfile = async () => {
  await delay(500)
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${getJWTId()}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch profile")
  }
}

export const updateProfile = async (profileData) => {
  await delay(1000)
  console.log("Profile updated:", profileData)
  try {
    await axios.put(`${API_BASE_URL}/users/${getJWTId()}`, profileData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return { success: true }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update profile")
  }
}

// Email and Password Management
export const changeEmail = async (newEmail, otp) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/users/change-email`,
      { email: newEmail, otp },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    )
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to change email")
  }
}

export const requestEmailChange = async (currentPassword) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/request-email-change`,
      { currentPassword },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    )
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to request email change")
  }
}

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/users/change-password`,
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    )
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to change password")
  }
}

export const deleteAccount = async (password) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/${getJWTId()}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: { password },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete account")
  }
}

// Request Management APIs
export const createRequest = async (requestData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/requests/create`, requestData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create request")
  }
}

export const getAllRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/requests`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch requests")
  }
}

export const getRequestById = async (requestId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/requests/${requestId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch request")
  }
}

export const updateRequest = async (requestId, requestData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/requests/${requestId}`, requestData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update request")
  }
}

export const deleteRequest = async (requestId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/requests/${requestId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete request")
  }
}

// Dashboard Data API
export const getDashboardData = async (userType) => {
  await delay(1000)
  switch (userType) {
    case "ngo":
      return {
        stats: {
          totalDonations: 125000,
          totalCampaigns: 8,
          activeCampaigns: 5,
          donorsCount: 450,
        },
        donationsData: [
          { month: "Jan", amount: 5000 },
          { month: "Feb", amount: 7500 },
          { month: "Mar", amount: 10000 },
          { month: "Apr", amount: 8000 },
          { month: "May", amount: 12000 },
          { month: "Jun", amount: 15000 },
          { month: "Jul", amount: 18000 },
          { month: "Aug", amount: 22000 },
          { month: "Sep", amount: 19000 },
          { month: "Oct", amount: 14000 },
          { month: "Nov", amount: 9500 },
          { month: "Dec", amount: 11000 },
        ],
        campaigns: [
          {
            id: 1,
            title: "Clean Water for Rural Communities",
            raised: 45000,
            goal: 75000,
            status: "active",
            daysLeft: 23,
          },
          {
            id: 2,
            title: "Education Supplies for Schools",
            raised: 28500,
            goal: 30000,
            status: "active",
            daysLeft: 15,
          },
          {
            id: 3,
            title: "Healthcare for Underserved Areas",
            raised: 50000,
            goal: 50000,
            status: "completed",
            daysLeft: 0,
          },
          {
            id: 4,
            title: "Community Center Renovation",
            raised: 12800,
            goal: 40000,
            status: "active",
            daysLeft: 45,
          },
          {
            id: 5,
            title: "Food Distribution Program",
            raised: 18900,
            goal: 25000,
            status: "active",
            daysLeft: 10,
          },
        ],
      }
    case "donor":
      return {
        stats: {
          totalDonated: 2500,
          campaignsSupported: 12,
          ngosSupported: 5,
          rank: 42,
        },
        donationHistory: [
          {
            id: 1,
            campaign: "Clean Water for Rural Communities",
            ngo: "Water Access Initiative",
            amount: 500,
            date: "2023-03-15",
          },
          {
            id: 2,
            campaign: "Education Supplies for Schools",
            ngo: "Education for All",
            amount: 250,
            date: "2023-04-22",
          },
          {
            id: 3,
            campaign: "Healthcare for Underserved Areas",
            ngo: "Healthcare Access Initiative",
            amount: 750,
            date: "2023-05-10",
          },
          {
            id: 4,
            campaign: "Community Center Renovation",
            ngo: "Community Development Fund",
            amount: 300,
            date: "2023-06-05",
          },
          {
            id: 5,
            campaign: "Food Distribution Program",
            ngo: "Food Security Alliance",
            amount: 400,
            date: "2023-07-18",
          },
        ],
        leaderboard: [
          { rank: 1, name: "Jane Smith", amount: 15000, badge: "gold" },
          { rank: 2, name: "Robert Johnson", amount: 12500, badge: "gold" },
          { rank: 3, name: "Sarah Williams", amount: 10000, badge: "gold" },
          { rank: 4, name: "Michael Brown", amount: 7500, badge: "silver" },
          { rank: 5, name: "Emily Davis", amount: 5000, badge: "silver" },
        ],
        badges: [
          {
            id: 1,
            name: "First Donation",
            description: "Made your first donation",
            earned: true,
          },
          {
            id: 2,
            name: "Regular Donor",
            description: "Donated for 3 consecutive months",
            earned: true,
          },
          {
            id: 3,
            name: "Silver Supporter",
            description: "Donated over $1,000 in total",
            earned: true,
          },
          {
            id: 4,
            name: "Gold Supporter",
            description: "Donated over $5,000 in total",
            earned: false,
          },
          {
            id: 5,
            name: "Platinum Supporter",
            description: "Donated over $10,000 in total",
            earned: false,
          },
        ],
      }
    case "receiver":
      return {
        stats: {
          totalReceived: 8500,
          activeRequests: 2,
          completedRequests: 3,
          donorsCount: 75,
        },
        fundsData: [
          { month: "Jan", amount: 0 },
          { month: "Feb", amount: 0 },
          { month: "Mar", amount: 1500 },
          { month: "Apr", amount: 0 },
          { month: "May", amount: 2000 },
          { month: "Jun", amount: 0 },
          { month: "Jul", amount: 0 },
          { month: "Aug", amount: 3000 },
          { month: "Sep", amount: 0 },
          { month: "Oct", amount: 2000 },
          { month: "Nov", amount: 0 },
          { month: "Dec", amount: 0 },
        ],
        requests: [
          {
            id: 1,
            title: "Medical Treatment for Sarah",
            description: "My daughter Sarah needs urgent medical treatment for a rare condition.",
            raised: 3200,
            goal: 5000,
            status: "active",
            daysLeft: 12,
          },
          {
            id: 2,
            title: "Help Rebuild Our Home After Fire",
            description: "Our family home was destroyed in a fire. We need help to rebuild.",
            raised: 5300,
            goal: 15000,
            status: "active",
            daysLeft: 30,
          },
          {
            id: 3,
            title: "College Tuition Assistance",
            description: "I need help with my college tuition for the upcoming semester.",
            raised: 2500,
            goal: 2500,
            status: "completed",
            daysLeft: 0,
          },
          {
            id: 4,
            title: "Emergency Surgery Funds",
            description: "I need assistance for an emergency surgery not covered by insurance.",
            raised: 4000,
            goal: 4000,
            status: "completed",
            daysLeft: 0,
          },
          {
            id: 5,
            title: "Support for Disability Equipment",
            description: "Need specialized equipment to help with mobility after an accident.",
            raised: 1500,
            goal: 1500,
            status: "completed",
            daysLeft: 0,
          },
        ],
      }
    default:
      return null
  }
}

// Other APIs
export const getSettings = async () => {
  await delay(500)

  // Mock settings data
  return {
    account: {
      email: "john.doe@example.com",
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      campaignUpdates: true,
      donationReceipts: true,
      marketingEmails: false,
    },
    privacy: {
      profileVisibility: "public",
      showDonationAmount: true,
      showInLeaderboard: true,
    },
  }
}

export const updateSettings = async (settingsData) => {
  await delay(1000)
  // In a real app, this would update the settings in the database
  console.log("Settings updated:", settingsData)
  return { success: true }
}

// Create campaign API
export const createCampaign = async (campaignData) => {
  await delay(1500) // Simulate API call

  // In a real app, this would create a campaign in the database
  return {
    id: Math.floor(Math.random() * 1000),
    ...campaignData,
    raised: 0,
    status: "active",
    createdAt: new Date().toISOString(),
  }
}

// Make donation API
export const makeDonation = async (donationData) => {
  await delay(1500) // Simulate API call

  // In a real app, this would process a donation and update the database
  return {
    id: Math.floor(Math.random() * 1000),
    ...donationData,
    status: "completed",
    createdAt: new Date().toISOString(),
  }
}

// Get leaderboard API
export const getLeaderboard = async () => {
  await delay(1000) // Simulate API call

  // In a real app, this would fetch the leaderboard from the database
  return [
    { rank: 1, name: "Jane Smith", amount: 15000, badge: "gold" },
    { rank: 2, name: "Robert Johnson", amount: 12500, badge: "gold" },
    { rank: 3, name: "Sarah Williams", amount: 10000, badge: "gold" },
    { rank: 4, name: "Michael Brown", amount: 7500, badge: "silver" },
    { rank: 5, name: "Emily Davis", amount: 5000, badge: "silver" },
    { rank: 6, name: "David Wilson", amount: 4500, badge: "silver" },
    { rank: 7, name: "Jennifer Taylor", amount: 4000, badge: "silver" },
    { rank: 8, name: "Christopher Martinez", amount: 3500, badge: "silver" },
    { rank: 9, name: "Jessica Anderson", amount: 3000, badge: "bronze" },
    { rank: 10, name: "Matthew Thomas", amount: 2800, badge: "bronze" },
    { rank: 11, name: "Amanda Jackson", amount: 2500, badge: "bronze" },
    { rank: 12, name: "Daniel White", amount: 2200, badge: "bronze" },
    { rank: 13, name: "Elizabeth Harris", amount: 2000, badge: "bronze" },
    { rank: 14, name: "Andrew Clark", amount: 1800, badge: "bronze" },
    { rank: 15, name: "Olivia Lewis", amount: 1500, badge: "bronze" },
  ]
}

// Post Management APIs
export const createPost = async (postData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/posts/create`, postData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create post")
  }
}

export const getAllPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch posts")
  }
}

export const getPostById = async (postId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts/${postId}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch post")
  }
}

export const updatePost = async (postId, postData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/posts/${postId}`, postData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update post")
  }
}

export const deletePost = async (postId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete post")
  }
}
