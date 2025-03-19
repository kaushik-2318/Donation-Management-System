// Central API file for all API calls



// Mock API functions with simulated delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Auth API
export const authAPI = {
  login: async (email, password) => {
    await delay(1000) // Simulate API delay

    // Mock login - in a real app, this would be an API call
    if (email && password) {
      return {
        id: "1",
        name: "John Doe",
        email,
        role: "DONOR",
        avatar: "",
        createdAt: new Date().toISOString(),
      }
    }

    throw new Error("Invalid credentials")
  },

  register: async () => {
    await delay(1500) // Simulate API delay

    // Mock registration - in a real app, this would be an API call
    return {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone,
      address: userData.address,
      registrationNumber: userData.registrationNumber,
      createdAt: new Date().toISOString(),
      verificationStatus: userData.role === "NGO" ? "pending" : "verified",
    }
  },

  logout: async () => {
    await delay(500) // Simulate API delay
    // In a real app, this would clear the session/token
  },

  getCurrentUser: async () => {
    await delay(800) // Simulate API delay
    // In a real app, this would validate the current token/session
    return null
  },
}

// Posts/Campaigns API
export const postsAPI = {
  getPosts: async () => {
    await delay(1000) // Simulate API delay

    // Mock data
    return [
      {
        id: "1",
        title: "Clean Water Initiative",
        description: "Help us provide clean drinking water to rural communities in need.",
        goal: 50000,
        raised: 32500,
        creatorId: "ngo1",
        creatorName: "Water for All NGO",
        creatorType: "NGO",
        proofLink: "https://drive.google.com/file/example1",
        createdAt: "2023-03-01",
        updatedAt: "2023-03-15",
        status: "active",
        donorsCount: 28,
        category: "Water & Sanitation",
      },
      {
        id: "2",
        title: "Education for All",
        description: "Support our mission to provide quality education to underprivileged children.",
        goal: 75000,
        raised: 45000,
        creatorId: "ngo2",
        creatorName: "Education First Foundation",
        creatorType: "NGO",
        proofLink: "https://drive.google.com/file/example2",
        createdAt: "2023-02-15",
        updatedAt: "2023-03-10",
        status: "active",
        donorsCount: 35,
        category: "Education",
      },
      {
        id: "3",
        title: "Food for the Homeless",
        description: "Help us feed homeless individuals in urban areas.",
        goal: 30000,
        raised: 28500,
        creatorId: "ngo3",
        creatorName: "Food Relief Organization",
        creatorType: "NGO",
        proofLink: "https://drive.google.com/file/example3",
        createdAt: "2023-01-20",
        updatedAt: "2023-03-05",
        status: "active",
        donorsCount: 22,
        category: "Food & Hunger",
      },
      {
        id: "4",
        title: "Medical Treatment Support",
        description: "I need financial assistance for my critical medical treatment.",
        goal: 100000,
        raised: 65000,
        creatorId: "receiver1",
        creatorName: "John Smith",
        creatorType: "RECEIVER",
        proofLink: "https://drive.google.com/file/example4",
        createdAt: "2023-02-28",
        updatedAt: "2023-03-12",
        status: "active",
        donorsCount: 42,
        category: "Healthcare",
      },
      {
        id: "5",
        title: "Disaster Relief Fund",
        description: "Support victims of the recent natural disaster in coastal regions.",
        goal: 200000,
        raised: 175000,
        creatorId: "ngo4",
        creatorName: "Disaster Response Team",
        creatorType: "NGO",
        proofLink: "https://drive.google.com/file/example5",
        createdAt: "2023-02-10",
        updatedAt: "2023-03-08",
        status: "active",
        donorsCount: 112,
        category: "Disaster Relief",
      },
    ]
  },

  getPostById: async (id) => {
    await delay(800) // Simulate API delay

    const posts = await postsAPI.getPosts()
    return posts.find((post) => post.id === id) || null
  },

  createPost: async (postData) => {
    await delay(1500) // Simulate API delay

    // Mock post creation
    return {
      ...postData,
      id: Date.now().toString(),
      raised: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      donorsCount: 0,
    }
  },

  updatePost: async (id, postData) => {
    await delay(1200) // Simulate API delay

    const post = await postsAPI.getPostById(id)
    if (!post) throw new Error("Post not found")

    return {
      ...post,
      ...postData,
      updatedAt: new Date().toISOString(),
    }
  },

  deletePost: async (id) => {
    await delay(1000) // Simulate API delay
    // In a real app, this would delete the post
  },
}

// Donations API
export const donationsAPI = {
  getDonations: async (userId) => {
    await delay(1000) // Simulate API delay

    // Mock donations
    return [
      {
        id: "1",
        amount: 500,
        donorId: userId || "user1",
        donorName: "John Doe",
        campaignId: "1",
        campaignName: "Clean Water Initiative",
        date: "2023-03-15",
        status: "completed",
        receiptUrl: "https://example.com/receipts/receipt1.pdf",
        paymentMethod: "card",
        transactionId: "tx_123456",
      },
      {
        id: "2",
        amount: 1000,
        donorId: userId || "user1",
        donorName: "John Doe",
        campaignId: "2",
        campaignName: "Education for All",
        date: "2023-04-20",
        status: "completed",
        receiptUrl: "https://example.com/receipts/receipt2.pdf",
        paymentMethod: "upi",
        transactionId: "tx_234567",
      },
      {
        id: "3",
        amount: 750,
        donorId: userId || "user1",
        donorName: "John Doe",
        campaignId: "3",
        campaignName: "Food for the Homeless",
        date: "2023-05-10",
        status: "completed",
        receiptUrl: "https://example.com/receipts/receipt3.pdf",
        paymentMethod: "netbanking",
        transactionId: "tx_345678",
      },
    ]
  },

  createDonation: async (donationData) => {
    await delay(1500) // Simulate API delay

    // Mock donation creation
    const newDonation = {
      id: Date.now().toString(),
      ...donationData,
      date: new Date().toISOString(),
      status: "completed",
      transactionId: `tx_${Math.floor(Math.random() * 1000000)}`,
      receiptUrl: `https://example.com/receipts/receipt${Math.floor(Math.random() * 1000)}.pdf`,
    }

    // In a real app, this would also update the campaign's raised amount

    return newDonation
  },

  generateReceipt: async (donationId) => {
    await delay(2000) // Simulate PDF generation and upload

    // Mock receipt URL
    return `https://example.com/receipts/receipt${donationId}.pdf`
  },

  getDonationById: async (id) => {
    await delay(800) // Simulate API delay

    const donations = await donationsAPI.getDonations()
    return donations.find((donation) => donation.id === id) || null
  },
}

// User/Profile API
export const userAPI = {
  getUserProfile: async (userId) => {
    await delay(1000) // Simulate API delay

    // Mock user profiles
    const users = {
      ngo1: {
        id: "ngo1",
        name: "Water for All NGO",
        email: "contact@waterforall.org",
        role: "NGO",
        avatar: "",
        bio: "We are dedicated to providing clean water to communities in need.",
        phone: "+91 9876543210",
        address: "123 NGO Street, New Delhi, India",
        website: "https://waterforall.org",
        socialLinks: {
          facebook: "https://facebook.com/waterforall",
          twitter: "https://twitter.com/waterforall",
          instagram: "https://instagram.com/waterforall",
        },
        verificationStatus: "verified",
        registrationNumber: "NGO123456",
        createdAt: "2022-01-15",
      },
      user1: {
        id: "user1",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "DONOR",
        avatar: "",
        bio: "Regular donor supporting various causes.",
        phone: "+91 9876543211",
        address: "456 Donor Avenue, Mumbai, India",
        socialLinks: {
          twitter: "https://twitter.com/johndoe",
        },
        createdAt: "2022-02-20",
      },
    }

    return users[userId] || null
  },

  updateUserProfile: async (userId, profileData) => {
    await delay(1200) // Simulate API delay

    const user = await userAPI.getUserProfile(userId)
    if (!user) throw new Error("User not found")

    return {
      ...user,
      ...profileData,
    }
  },

  uploadProfileImage: async (userId, image) => {
    await delay(1500) // Simulate upload

    // Mock image URL
    return `https://example.com/avatars/${userId}.jpg`
  },

  uploadDocument: async (userId, document) => {
    await delay(2000) // Simulate upload

    // Mock document URL
    return `https://example.com/documents/${userId}_${document.name}`
  },
}

// Export all APIs
export const api = {
  auth: authAPI,
  posts: postsAPI,
  donations: donationsAPI,
  users: userAPI,
}

export default api

