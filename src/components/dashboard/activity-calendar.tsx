export function ActivityCalendar() {
  // Calendar rendering is static for now; dynamic data can be wired later.

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">May - 2025</h3>
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

      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div key={index} className="mb-2 text-center text-xs font-medium text-gray-400">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {Array(7 * 5)
          .fill(null)
          .map((_, index) => {
            const dayNumber = index - 3 + 1 // Adjust for May 2025 starting on a Thursday
            const isCurrentMonth = dayNumber > 0 && dayNumber <= 31
            const isToday = dayNumber === 26
            const isHighlighted = [16, 17, 18].includes(dayNumber)

            return (
              <div key={index} className="flex items-center justify-center h-13">
                {isCurrentMonth && (
                  <div
                    className={`w-12 h-12 rounded-full text-center text-xs flex items-center justify-center ${
                      isToday
                        ? "bg-amber-500 font-bold text-black"
                        : isHighlighted
                          ? "bg-zinc-700 text-white"
                          : "bg-zinc-800 text-white"
                    }`}
                  >
                    {dayNumber}
                  </div>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}
