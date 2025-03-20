"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  Home,
  BarChart3,
  Users,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Bell,
  CreditCard,
  Building2,
  HandHeart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DashboardLayout({ children, userType }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    const storedUserType = localStorage.getItem("userType")
    const storedUserName = localStorage.getItem("userName")

    if (!token || storedUserType !== userType) {
      router.push("/auth/login")
    } else {
      setUserName(storedUserName || "User")
    }
  }, [router, userType])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userType")
    localStorage.removeItem("userName")
    router.push("/")
  }

  const getNavItems = () => {
    const commonItems = [
      { label: "Dashboard", icon: Home, href: `/dashboard/${userType}` },
      { label: "Profile", icon: User, href: "/profile" },
      { label: "Settings", icon: Settings, href: "/settings" },
    ]

    const userSpecificItems = {
      ngo: [
        { label: "Campaigns", icon: BarChart3, href: "/campaigns/manage" },
        { label: "Donors", icon: Users, href: "/donors" },
        { label: "Notifications", icon: Bell, href: "/notifications" },
      ],
      donor: [
        { label: "Campaigns", icon: Heart, href: "/campaigns" },
        { label: "Donations", icon: CreditCard, href: "/donations" },
        { label: "Leaderboard", icon: BarChart3, href: "/leaderboard" },
      ],
      receiver: [
        { label: "My Requests", icon: BarChart3, href: "/requests/manage" },
        { label: "Donors", icon: Users, href: "/donors" },
        { label: "Notifications", icon: Bell, href: "/notifications" },
      ],
    }

    return [...userSpecificItems[userType], ...commonItems]
  }

  const navItems = getNavItems()

  const getUserIcon = () => {
    switch (userType) {
      case "ngo":
        return <Building2 className="h-5 w-5 text-orange-600" />
      case "donor":
        return <HandHeart className="h-5 w-5 text-orange-600" />
      case "receiver":
        return <User className="h-5 w-5 text-orange-600" />
      default:
        return <User className="h-5 w-5 text-orange-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <header className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold text-orange-600">Samarthan Kriya</span>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r h-screen sticky top-0">
          <div className="p-6 border-b">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-orange-600">Samarthan Kriya</span>
            </Link>
          </div>

          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" alt={userName} />
                <AvatarFallback className="bg-orange-100 text-orange-800">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-gray-500 capitalize">{userType}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href
                return (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors ${
                        isActive ? "bg-orange-50 text-orange-600 font-medium" : ""
                      }`}
                    >
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-orange-600 text-orange-600 hover:bg-orange-50"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </Button>
          </div>
        </aside>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-white">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b flex justify-between items-center">
                <Link href="/" className="flex items-center">
                  <span className="text-xl font-bold text-orange-600">Samarthan Kriya</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="p-4 border-b">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" alt={userName} />
                    <AvatarFallback className="bg-orange-100 text-orange-800">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-gray-500 capitalize">{userType}</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-2">
                  {navItems.map((item, index) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-3 rounded-md text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors ${
                            isActive ? "bg-orange-50 text-orange-600 font-medium" : ""
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <item.icon size={20} />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              <div className="p-4 border-t">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border-orange-600 text-orange-600 hover:bg-orange-50"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}

