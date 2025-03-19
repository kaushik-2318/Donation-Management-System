"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Preloader() {
  const [loading, setLoading] = useState(true)
  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    // Check if this is the first load of the homepage
    const isFirstLoad = sessionStorage.getItem("firstLoadDone") !== "true"
    setFirstLoad(isFirstLoad)

    if (isFirstLoad) {
      // Simulate loading time only on first load
      const timer = setTimeout(() => {
        setLoading(false)
        // Mark that first load is done
        sessionStorage.setItem("firstLoadDone", "true")
      }, 2000)

      return () => clearTimeout(timer)
    } else {
      // Skip preloader if not first load
      setLoading(false)
    }
  }, [])

  // Don't render anything if it's not the first load
  if (!firstLoad) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500",
        loading ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <div className="flex flex-col items-center">
        <div className="relative">
          <Heart className="h-20 w-20 text-primary animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-lg">
            SK
          </div>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-primary">Samarthan Kriya</h2>
        <p className="text-sm text-muted-foreground mb-4">Empowering Change Through Giving</p>
        <div className="mt-2 w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full animate-loader"
            style={{
              animation: "loader 2s ease-in-out infinite",
            }}
          />
        </div>
        <p className="mt-4 text-lg font-medium text-slate-600">Loading...</p>
      </div>

      <style jsx global>{`
        @keyframes loader {
          0% {
            width: 0%;
            margin-left: 0;
          }
          50% {
            width: 100%;
            margin-left: 0;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
      `}</style>
    </div>
  )
}

