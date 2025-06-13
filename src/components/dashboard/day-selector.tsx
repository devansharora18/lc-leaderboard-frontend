export function DaySelector() {
  const days = [
    { day: "Sat", date: "7", completed: true },
    { day: "Sun", date: "8", completed: true },
    { day: "Mon", date: "9", completed: true },
    { day: "Tue", date: "10", completed: true },
    { day: "Wed", date: "11", completed: true },
    { day: "Thu", date: "12", completed: true },
    { day: "Fri", date: "13", active: true },
    { day: "Sat", date: "14", future: true },
    { day: "Sun", date: "15", future: true },
    { day: "Mon", date: "16", future: true },
    { day: "Tue", date: "17", future: true },
    { day: "Wed", date: "18", future: true },
    { day: "Thu", date: "19", future: true },
    { day: "Fri", date: "20", future: true },
    { day: "Sat", date: "21", future: true },
    { day: "Sun", date: "22", future: true },
    { day: "Mon", date: "23", future: true },
  ]

  return (
    <div className="grid grid-cols-13 gap-4 p-4">
      {/* Card 1: Current Streak - 1 colspan */}
      <div className="col-span-2 flex flex-col items-center justify-center bg-zinc-900 rounded-lg p-4 h-28">
        <div className="flex flex-col items-center gap-2 mb-1">
          <div className="text-2xl">🔥</div>
          <div className="text-2xl font-bold text-white">19</div>
        </div>
        <div className="text-xs text-gray-400 uppercase tracking-wide">days</div>
        <div className="text-xs text-gray-500">Current Streak</div>
      </div>

      {/* Card 2: Date Selector - 8 colspan */}
      <div className="col-span-8 flex items-center bg-zinc-900 rounded-lg p-4 h-28">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-gray-300">June 5, 2025</div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Left Navigation Arrow */}
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-zinc-800 hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            {/* Day circles */}
            <div className="flex gap-1">
              {days.map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                      day.completed
                        ? "bg-green-500 text-white"
                        : day.active
                        ? "bg-amber-500 text-black font-medium"
                        : day.future
                        ? "bg-gray-600 text-gray-400"
                        : "bg-zinc-800 text-white hover:bg-zinc-700"
                    }`}
                  >
                    {day.completed ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-3 w-3"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      <span className="text-xs font-medium">{day.date}</span>
                    )}
                  </div>
                  <span className="text-[8px] text-gray-400 mt-0.5">{day.day}</span>
                </div>
              ))}
            </div>

            {/* Right Navigation Arrow */}
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-zinc-800 hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Card 3: Task Selector - 4 colspan */}
      <div className="col-span-3 flex flex-col items-center justify-between bg-zinc-900 rounded-lg p-4 h-28">
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-white">10. Regular Expression Matching</div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-1">
              <span className="text-xs font-medium text-gray-400">HARD</span>
            </div>
            <div className="flex items-center gap-1 rounded-md bg-amber-500 px-2 py-1">
              <span className="text-xs font-medium text-black">63%</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-xs font-medium text-amber-500 bg-zinc-800 rounded hover:bg-zinc-700">
            Resume →
          </button>
        </div>
      </div>
    </div>
  )
}
