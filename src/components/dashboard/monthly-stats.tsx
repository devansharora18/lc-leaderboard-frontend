"use client"

import { useState, useEffect, useMemo } from "react"

export function MonthlyStats() {
  const months = useMemo(() => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], [])
  const [data, setData] = useState<Array<{ easy: number; medium: number; hard: number }>>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Generate deterministic data that won't change between renders
    const generateStaticData = () => {
      return months.map((_, index) => ({
        easy: 30 + (index * 7) % 25,
        medium: 20 + (index * 5) % 20,
        hard: 10 + (index * 3) % 15,
      }))
    }

    setIsClient(true)
    setData(generateStaticData())
  }, [months])

  // Render a loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">2025</h3>
          <button className="flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-1 text-xs text-gray-400 hover:bg-zinc-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-400">Loading chart...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">2025</h3>
        <button className="flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-1 text-xs text-gray-400 hover:bg-zinc-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>
      <div className="h-64">
        <div className="flex h-full items-end justify-between">
          {data.map((month, index) => (
            <div key={index} className="flex w-full flex-col items-center">
              <div className="relative mb-1 flex h-52 w-8 flex-col-reverse space-y-reverse space-y-1">
                <div className="w-full rounded-sm bg-green-500" style={{ height: `${month.easy / 2}%` }}></div>
                <div className="w-full rounded-sm bg-yellow-500" style={{ height: `${month.medium / 2}%` }}></div>
                <div className="w-full rounded-sm bg-red-500" style={{ height: `${month.hard / 2}%` }}></div>
              </div>
              <div className="text-xs text-gray-400">{months[index]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
