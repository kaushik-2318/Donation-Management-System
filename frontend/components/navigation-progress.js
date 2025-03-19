"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export default function NavigationProgress() {
  const [isNavigating, setIsNavigating] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    let interval;

    // Start progress when navigation begins
    const handleStart = () => {
      setIsNavigating(true)
      setProgress(0)

      interval = setInterval(() => {
        setProgress((prev) => {
          // Slowly increase to 90% while waiting for navigation to complete
          if (prev < 90) {
            return prev + (90 - prev) * 0.1
          }
          return prev
        })
      }, 100)
    }

    // Complete progress when navigation finishes
    const handleComplete = () => {
      clearInterval(interval)
      setProgress(100)

      // Reset after animation completes
      setTimeout(() => {
        setIsNavigating(false)
        setProgress(0)
      }, 500)
    }

    // Listen for route changes
    handleStart()
    handleComplete()

    return () => {
      clearInterval(interval)
    }
  }, [pathname, searchParams])

  if (!isNavigating && progress === 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent">
      <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
    </div>
  )
}

