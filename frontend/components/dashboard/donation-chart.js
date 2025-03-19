"use client"

import { useTheme } from "next-themes"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendItem } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

// Mock data for the chart
const data = [
  { month: "Jan", amount: 0 },
  { month: "Feb", amount: 0 },
  { month: "Mar", amount: 500 },
  { month: "Apr", amount: 1000 },
  { month: "May", amount: 750 },
  { month: "Jun", amount: 0 },
]

export default function DonationChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <ChartContainer className="h-[300px]">
      <ChartLegend className="mb-4">
        <ChartLegendItem name="Donations" color="hsl(var(--primary))" />
      </ChartLegend>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "hsl(var(--muted))" : "#eee"} />
          <XAxis
            dataKey="month"
            stroke={isDark ? "hsl(var(--muted-foreground))" : "#888"}
            tick={{ fill: isDark ? "hsl(var(--muted-foreground))" : "#888" }}
          />
          <YAxis
            stroke={isDark ? "hsl(var(--muted-foreground))" : "#888"}
            tick={{ fill: isDark ? "hsl(var(--muted-foreground))" : "#888" }}
            tickFormatter={(value) => `₹${value}`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="border-none bg-background shadow-lg"
                formatter={(value) => [`₹${value}`, "Amount"]}
              />
            }
          />
          <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

