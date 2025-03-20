"use client"

import { useEffect, useState } from "react"

export default function Preloader() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!loading) return null

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-pulse"></div>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-blue-600">Samarthan Kriya</h2>
        <p className="text-gray-500">Connecting hearts and causes</p>
      </div>
    </div>
  )
}

