import { Inter } from "next/font/google"
import "./globals.css"
import Preloader from "@/components/preloader"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Samarthan Kriya - NGO Donation Platform",
  description: "Connect with NGOs, support worthy causes, and help those in need",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Preloader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'