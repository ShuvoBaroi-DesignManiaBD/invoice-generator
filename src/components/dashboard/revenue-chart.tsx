"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface RevenueChartProps {
  data: {
    name: string
    total: number
  }[]
}

const chartConfig = {
  total: {
    label: "Revenue",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
      <BarChart accessibilityLayer data={data}>
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="total" fill="var(--color-total)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
