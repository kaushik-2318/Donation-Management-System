import axios from "axios"
import getJWTId from "./getJWTId"

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"


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

export const logout = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return
  } catch (error) {
    throw new Error(error.response?.data?.message || "Logout failed.")
  }
}

export const verifyOTP = async (otp, email, role) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, { otp, email, role })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to verify OTP")
  }
}

export const resendVerificationEmail = async (email, phone, role) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/resend-otp`, { email, phone, role })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to resend verification email")
  }
}

export const getProfile = async () => {
  await delay(500)
  try {
    const response = await axios.get(`${API_BASE_URL}/profile/${getJWTId().id}`, {
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

export const getSettings = async () => {
  await delay(500)
  try {
    const response = await axios.get(`${API_BASE_URL}/settings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch settings")
  }

}

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/settings/password`,
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

export const requestEmailChange = async (currentPassword, newEmail) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/settings/request-email-change`,
      { currentPassword, newEmail },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data?.message || "Failed to request email change")
  }
}

export const changeEmail = async (newEmail, otp) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/settings/email`,
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


export const deleteAccount = async (password) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/profile/${getJWTId().id}`, {
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

export const getDashboardData = async (userType) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/${userType}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch dashboard data")
  }
}

export const createCampaign = async (campaignData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/campaigns/create`, campaignData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create campaign")
  }
}

export const getAllCampaigns = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/campaigns`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch campaigns")
  }
}

export const getCampaignById = async (campaignId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/campaigns/${campaignId}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch campaign")
  }
}

export const getManageCampaigns = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/campaigns/manage`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch manage campaigns")
  }
}

















// Request Management APIs
export const createRequest = async (requestData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/requests/create`, requestData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create request")
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

export const getAllRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/requests`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch requests")
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




export const makeDonation = async (donationData) => {
  await delay(1500)
  try {
    const response = await axios.post(`${API_BASE_URL}/donations/ngo`, donationData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to make donation")
  }
}



//TODO: After notifcation service is implemented, update the settings in the database
export const updateSettings = async (settingsData) => {
  await delay(1000)
  // In a real app, this would update the settings in the database
  console.log("Settings updated:", settingsData)
  return { success: true }
}
//TODO: After leaderboard service is implemented, update the leaderboard from the database
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