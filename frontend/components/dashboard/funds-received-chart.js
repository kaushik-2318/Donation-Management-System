"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export default function FundsReceivedChart({ data }) {
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
        type: "line",
        data: {
          labels: data.map((item) => item.month),
          datasets: [
            {
              label: "Funds Received (₹)",
              data: data.map((item) => item.amount),
              backgroundColor: "rgba(237, 137, 54, 0.2)",
              borderColor: "rgba(237, 137, 54, 1)",
              borderWidth: 2,
              tension: 0.3,
              fill: true,
              pointBackgroundColor: "rgba(237, 137, 54, 1)",
              pointRadius: 4,
              pointHoverRadius: 6,
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

