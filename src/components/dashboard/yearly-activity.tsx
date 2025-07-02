"use client"

import { useState, useEffect, useMemo } from "react"

export function YearlyActivity() {
  const months = useMemo(() => ["June", "July", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"], [])
  const [activityData, setActivityData] = useState<Record<string, boolean[]>>({})
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Generate deterministic activity data using a simple hash function
    const generateStaticActivityData = () => {
      const data: Record<string, boolean[]> = {}
      months.forEach((month, monthIndex) => {
        data[month] = Array(28)
          .fill(null)
          .map((_, dayIndex) => {
            // Create a simple hash from month and day indices
            const hash = (monthIndex * 31 + dayIndex) % 100
            return hash > 70 // ~30% chance of activity
          })
      })
      return data
    }

    setIsClient(true)
    setActivityData(generateStaticActivityData())
  }, [months])

  // Render loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">
              <span className="font-bold">98</span> submissions in the past one year
            </h3>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div>
              Total active days: <span className="font-bold">103</span>
            </div>
            <div>
              Max streak: <span className="font-bold">32</span>
            </div>
          </div>
        </div>
        <div className="h-32 flex items-center justify-center">
          <div className="text-gray-400">Loading activity chart...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">
            <span className="font-bold">98</span> submissions in the past one year
          </h3>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div>
            Total active days: <span className="font-bold">103</span>
          </div>
          <div>
            Max streak: <span className="font-bold">32</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {months.map((month, monthIndex) => (
          <div key={monthIndex} className="flex flex-col">
            <div className="mb-2 text-center text-xs text-gray-400">{month}</div>
            <div className="grid grid-cols-4 gap-1">
              {activityData[month].map((active, dayIndex) => (
                <div key={dayIndex} className={`h-3 w-3 ${active ? "bg-green-500" : "bg-zinc-800"}`}></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
