"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Trophy, Award, Medal } from "lucide-react"
import BackgroundAnimation from "@/components/background-animation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LeaderboardPage() {
  const [period, setPeriod] = useState("daily")

  // Sample data for demonstration
  const leaderboardData = {
    daily: [
      { rank: 1, name: "Rahul Sharma", amount: 15000, badge: "gold" },
      { rank: 2, name: "Priya Patel", amount: 12500, badge: "gold" },
      { rank: 3, name: "Amit Kumar", amount: 10000, badge: "gold" },
      { rank: 4, name: "Neha Singh", amount: 7500, badge: "silver" },
      { rank: 5, name: "Vikram Mehta", amount: 5000, badge: "silver" },
      { rank: 6, name: "Anita Desai", amount: 4500, badge: "silver" },
      { rank: 7, name: "Rajesh Gupta", amount: 4000, badge: "silver" },
      { rank: 8, name: "Meera Joshi", amount: 3500, badge: "silver" },
      { rank: 9, name: "Kiran Shah", amount: 3000, badge: "bronze" },
      { rank: 10, name: "Sanjay Verma", amount: 2800, badge: "bronze" },
      { rank: 11, name: "Pooja Reddy", amount: 2500, badge: "bronze" },
      { rank: 12, name: "Arun Nair", amount: 2200, badge: "bronze" },
      { rank: 13, name: "Divya Kapoor", amount: 2000, badge: "bronze" },
      { rank: 14, name: "Vivek Malhotra", amount: 1800, badge: "bronze" },
      { rank: 15, name: "Anjali Sharma", amount: 1500, badge: "bronze" },
    ],
    monthly: [
      { rank: 1, name: "Suresh Reddy", amount: 75000, badge: "gold" },
      { rank: 2, name: "Ananya Desai", amount: 62500, badge: "gold" },
      { rank: 3, name: "Rajesh Gupta", amount: 50000, badge: "gold" },
      { rank: 4, name: "Meera Joshi", amount: 37500, badge: "silver" },
      { rank: 5, name: "Kiran Shah", amount: 25000, badge: "silver" },
      { rank: 6, name: "Arjun Reddy", amount: 22500, badge: "silver" },
      { rank: 7, name: "Nisha Patel", amount: 20000, badge: "silver" },
      { rank: 8, name: "Vijay Kumar", amount: 17500, badge: "silver" },
      { rank: 9, name: "Deepa Menon", amount: 15000, badge: "bronze" },
      { rank: 10, name: "Ravi Shankar", amount: 14000, badge: "bronze" },
      { rank: 11, name: "Sunita Rao", amount: 12500, badge: "bronze" },
      { rank: 12, name: "Prakash Iyer", amount: 11000, badge: "bronze" },
      { rank: 13, name: "Lakshmi Narayan", amount: 10000, badge: "bronze" },
      { rank: 14, name: "Mohan Das", amount: 9000, badge: "bronze" },
      { rank: 15, name: "Kavita Krishnan", amount: 7500, badge: "bronze" },
    ],
    yearly: [
      { rank: 1, name: "Tata Group", amount: 1500000, badge: "gold" },
      { rank: 2, name: "Reliance Foundation", amount: 1250000, badge: "gold" },
      { rank: 3, name: "Infosys Foundation", amount: 1000000, badge: "gold" },
      { rank: 4, name: "Wipro Foundation", amount: 750000, badge: "silver" },
      { rank: 5, name: "Adani Foundation", amount: 500000, badge: "silver" },
      { rank: 6, name: "Mahindra Foundation", amount: 450000, badge: "silver" },
      { rank: 7, name: "Birla Group", amount: 400000, badge: "silver" },
      { rank: 8, name: "Bajaj Foundation", amount: 350000, badge: "silver" },
      { rank: 9, name: "Godrej Foundation", amount: 300000, badge: "bronze" },
      { rank: 10, name: "Jindal Foundation", amount: 280000, badge: "bronze" },
      { rank: 11, name: "Bharti Foundation", amount: 250000, badge: "bronze" },
      { rank: 12, name: "TVS Group", amount: 220000, badge: "bronze" },
      { rank: 13, name: "Hero Group", amount: 200000, badge: "bronze" },
      { rank: 14, name: "Kotak Foundation", amount: 180000, badge: "bronze" },
      { rank: 15, name: "Axis Bank Foundation", amount: 150000, badge: "bronze" },
    ],
  }

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case "gold":
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case "silver":
        return <Award className="h-6 w-6 text-gray-400" />
      case "bronze":
        return <Medal className="h-6 w-6 text-amber-700" />
      default:
        return null
    }
  }

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "gold":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "silver":
        return "bg-gray-50 text-gray-700 border-gray-200"
      case "bronze":
        return "bg-amber-50 text-amber-700 border-amber-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getBadgeName = (badge) => {
    switch (badge) {
      case "gold":
        return "Gold Donor"
      case "silver":
        return "Silver Donor"
      case "bronze":
        return "Bronze Donor"
      default:
        return "Donor"
    }
  }

  const getPeriodTitle = () => {
    switch (period) {
      case "daily":
        return "Today's Top Donors"
      case "monthly":
        return "This Month's Top Donors"
      case "yearly":
        return "This Year's Top Donors"
      default:
        return "Top Donors"
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundAnimation />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">Donor Leaderboard</h1>
            <Tabs defaultValue="daily" value={period} onValueChange={setPeriod} className="w-full md:w-auto">
              <TabsList className="grid w-full md:w-auto grid-cols-3">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-6 bg-blue-50 border-b">
              <h2 className="text-2xl font-bold text-center mb-6">{getPeriodTitle()}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {leaderboardData[period].slice(0, 3).map((donor) => (
                  <div
                    key={donor.rank}
                    className={`rounded-lg border p-6 flex flex-col items-center text-center transform transition-all hover:shadow-md hover:-translate-y-1 duration-300 ${getBadgeColor(donor.badge)}`}
                  >
                    <div className="text-2xl font-bold mb-1">#{donor.rank}</div>
                    {getBadgeIcon(donor.badge)}
                    <div className="text-xl font-semibold mt-3">{donor.name}</div>
                    <div className="text-sm mt-1">{getBadgeName(donor.badge)}</div>
                    <div className="font-bold mt-2">₹{donor.amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left font-semibold">Rank</th>
                    <th className="py-3 px-4 text-left font-semibold">Donor</th>
                    <th className="py-3 px-4 text-left font-semibold">Badge</th>
                    <th className="py-3 px-4 text-left font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData[period].slice(3).map((donor) => (
                    <tr key={donor.rank} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">#{donor.rank}</td>
                      <td className="py-3 px-4">{donor.name}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(donor.badge)}`}
                        >
                          {getBadgeName(donor.badge)}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">₹{donor.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4">Badge Criteria</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4 bg-yellow-50 transform transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <h3 className="font-semibold text-yellow-700">Gold Badge</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Awarded to donors who have contributed ₹10,000 or more daily, ₹50,000 monthly, or ₹500,000 yearly.
                </p>
              </div>
              <div className="border rounded-lg p-4 bg-gray-50 transform transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="h-5 w-5 text-gray-400" />
                  <h3 className="font-semibold text-gray-700">Silver Badge</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Awarded to donors who have contributed between ₹3,000 and ₹9,999 daily, ₹15,000 and ₹49,999 monthly,
                  or ₹150,000 and ₹499,999 yearly.
                </p>
              </div>
              <div className="border rounded-lg p-4 bg-amber-50 transform transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <Medal className="h-5 w-5 text-amber-700" />
                  <h3 className="font-semibold text-amber-700">Bronze Badge</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Awarded to donors who have contributed between ₹1,000 and ₹2,999 daily, ₹5,000 and ₹14,999 monthly, or
                  ₹50,000 and ₹149,999 yearly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

