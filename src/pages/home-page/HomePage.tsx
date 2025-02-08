"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useBeaconDetector } from "@/hooks/useBeaconDetector"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig

export default function HomePage() {
  const { beacon, error, scan } = useBeaconDetector();

  const handleScan = async () => {
    const result = await scan();
    console.log("Scan result:", result);
  };

  return (
    <div className="flex justify-center flex-col gap-5 items-center h-screen">
      <ChartContainer config={chartConfig} className="w-7/12">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>
      <div className="flex justify-center items-center flex-col gap-2">
        <button className="bg-blue-500 text-white font-bold px-5 py-2 rounded-md" onClick={handleScan}>Scan for Beacon</button>
        {beacon && <p>Connected to beacon: {beacon.name}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  )
}
