import "./globals.css"
import { Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/sonner"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Preloader from "@/components/preloader"
// import BackgroundAnimation from "@/components/background-animation"
import NavigationProgress from "@/components/navigation-progress"



const inter = Inter({ subsets: ["latin"] })


export const metadata = {
  title: "Samarthan Kriya | Empowering Change Through Giving",
  description: "A platform for NGOs, donors, and receivers to manage donations and make a difference",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Preloader />
          <NavigationProgress />
          {/* <BackgroundAnimation /> */}
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
