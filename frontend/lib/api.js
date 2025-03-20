// This is a mock API implementation for demonstration purposes
// In a real application, this would make actual API calls to your backend

// Simulated API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Login API
export const login = async (credentials) => {
  await delay(1000) // Simulate API call

  // This is just for demonstration - in a real app, this would be validated by the server
  if (credentials.email === "demo@example.com" && credentials.password === "password") {
    return {
      token: "mock-jwt-token",
      userType: "donor", // or "ngo" or "receiver"
      user: {
        id: 1,
        name: "Demo User",
        email: "demo@example.com",
      },
    }
  }

  // For demo purposes, let's accept any credentials
  // In a real app, this would validate against a database
  return {
    token: "mock-jwt-token",
    userType: credentials.email.includes("ngo") ? "ngo" : credentials.email.includes("receiver") ? "receiver" : "donor",
    user: {
      id: 1,
      name: "Demo User",
      email: credentials.email,
    },
  }
}

// Register API
export const register = async (userData) => {
  await delay(1500) // Simulate API call

  // In a real app, this would create a user in the database
  return {
    token: "mock-jwt-token",
    userType: userData.userType,
    user: {
      id: 1,
      name: userData.name,
      email: userData.email,
      userType: userData.userType,
    },
  }
}

// Get dashboard data
export const getDashboardData = async (userType) => {
  await delay(1000) // Simulate API call

  // In a real app, this would fetch actual data from the database
  // For now, we'll return mock data based on user type
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
          { id: 1, name: "First Donation", description: "Made your first donation", earned: true },
          { id: 2, name: "Regular Donor", description: "Donated for 3 consecutive months", earned: true },
          { id: 3, name: "Silver Supporter", description: "Donated over $1,000 in total", earned: true },
          { id: 4, name: "Gold Supporter", description: "Donated over $5,000 in total", earned: false },
          { id: 5, name: "Platinum Supporter", description: "Donated over $10,000 in total", earned: false },
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

// Create donation request API
export const createRequest = async (requestData) => {
  await delay(1500) // Simulate API call

  // In a real app, this would create a request in the database
  return {
    id: Math.floor(Math.random() * 1000),
    ...requestData,
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

// Get profile API
export const getProfile = async () => {
  await delay(500)

  // Mock profile data
  return {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+15551234567",
    address: "123 Main St, Anytown USA",
    bio: "Passionate about making a difference in the world.",
    organizationName: "Helping Hands NGO",
    registrationNumber: "123456789",
    website: "https://helpinghands.org",
    bankDetails: "Account: 1234567890, IFSC: ABCD0000123, Bank: Example Bank",
  }
}

// Update profile API
export const updateProfile = async (profileData) => {
  await delay(1000)
  // In a real app, this would update the profile in the database
  console.log("Profile updated:", profileData)
  return { success: true }
}

// Get settings API
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

// Update settings API
export const updateSettings = async (settingsData) => {
  await delay(1000)
  // In a real app, this would update the settings in the database
  console.log("Settings updated:", settingsData)
  return { success: true }
}

// Generate and upload receipt API
export const generateAndUploadReceipt = async (donationData) => {
  await delay(1500)

  // In a real app, this would generate a PDF receipt and upload it to UploadThing
  return {
    receiptUrl: `/receipts/receipt-${Math.floor(Math.random() * 1000)}.pdf`,
    donationId: donationData.id,
  }
}

// Get donations with receipts API
export const getDonationsWithReceipts = async () => {
  await delay(1000)

  // Mock donations with receipts
  return [
    {
      id: 1,
      campaign: "Clean Water for Rural Communities",
      ngo: "Water Access Initiative",
      amount: 5000,
      date: "2023-03-15",
      receiptUrl: "/receipts/receipt-1.pdf",
    },
    {
      id: 2,
      campaign: "Education Supplies for Schools",
      ngo: "Education for All",
      amount: 2500,
      date: "2023-04-22",
      receiptUrl: "/receipts/receipt-2.pdf",
    },
    {
      id: 3,
      campaign: "Healthcare for Underserved Areas",
      ngo: "Healthcare Access Initiative",
      amount: 7500,
      date: "2023-05-10",
      receiptUrl: "/receipts/receipt-3.pdf",
    },
  ]
}

