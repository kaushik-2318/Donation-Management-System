"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export default function DonationsChart({ data }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")

      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: data.map((item) => item.month),
          datasets: [
            {
              label: "Donations (₹)",
              data: data.map((item) => item.amount),
              backgroundColor: "rgba(237, 137, 54, 0.5)",
              borderColor: "rgba(237, 137, 54, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => "₹" + value.toLocaleString(),
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => "₹" + context.parsed.y.toLocaleString(),
              },
            },
            legend: {
              display: true,
              position: "top",
            },
          },
          animation: {
            duration: 2000,
            easing: "easeOutQuart",
          },
        },
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return (
    <div className="w-full h-80">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}

