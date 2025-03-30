"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, User, LogOut, Settings, CreditCard, FileText, LayoutDashboard, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

export default function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    const storedUserType = localStorage.getItem("userType")

    if (token) {
      setIsLoggedIn(true)
      setUserType(storedUserType)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userType")
    setIsLoggedIn(false)
    setUserType(null)
    router.push("/")
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">Samarthan Kriya</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/campaigns" className="text-gray-700 hover:text-blue-600 transition-colors">
              Campaigns
            </Link>
            <Link href="/requests" className="text-gray-700 hover:text-blue-600 transition-colors">
              Requests
            </Link>
            <Link href="/leaderboard" className="text-gray-700 hover:text-blue-600 transition-colors">
              Leaderboard
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About Us
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4 bg-white border-red-900 border-10">
            {isLoggedIn ? (
              <DropdownMenu className='bg-white'>
                <DropdownMenuTrigger asChild>
                  <Button variant={'default'} className="relative h-10 w-10 rounded-full outline-none border-none p-0 ring-offset-0">
                    <Image src="./demouser.png" alt="Avatar" className="p-0 rounded-full w-full h-full border-none" width={24} height={24} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuGroup className="flex gap-2 flex-col my-2">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard`}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    {userType === "receiver" && (
                      <DropdownMenuItem asChild>
                        <Link href="/requests/manage">
                          <FileText className="mr-2 h-4 w-4 my-2" />
                          <span>My Requests</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {userType === "ngo" && (
                      <DropdownMenuItem asChild>
                        <Link href="/campaigns/manage">
                          <FileText className="mr-2 h-4 w-4 my-2" />
                          <span>My Campaigns</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {userType === "donor" && (
                      <DropdownMenuItem asChild>
                        <Link href="/donations/history">
                          <CreditCard className="mr-2 h-4 w-4 my-2" />
                          <span>Donation History</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/help">
                      <HelpCircle className="mr-2 h-4 w-4 my-2" />
                      <span>Help & Support</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4 my-2" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4 mb-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/campaigns"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Campaigns
              </Link>
              <Link
                href="/requests"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Requests
              </Link>
              <Link
                href="/leaderboard"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Leaderboard
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
            </nav>

            <div className="flex flex-col space-y-2">
              {isLoggedIn ? (
                <>
                  <Link href={`/dashboard`} onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Link href="/settings" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </Link>
                  {userType === "receiver" && (
                    <Link href="/requests/manage" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        My Requests
                      </Button>
                    </Link>
                  )}
                  <Button
                    className="w-full"
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}