export function ActivityGauge() {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="mb-4 text-lg font-medium">This week</h3>
      <div className="flex items-center justify-center">
        <div className="relative h-40 w-40">
          {/* Gauge Background */}
          <svg className="h-full w-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M50 10 a 40 40 0 0 1 0 80 a 40 40 0 0 1 0 -80"
              stroke="#3B3B3B"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M50 10 a 40 40 0 0 1 0 80 a 40 40 0 0 1 0 -80"
              stroke="url(#gradient)"
              strokeWidth="10"
              fill="none"
              strokeDasharray="188.5"
              strokeDashoffset="94.25"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
          </svg>
          {/* Gauge Text */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-2xl font-bold">130 minutes</div>
            <div className="text-sm text-gray-400">today</div>
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-sm">Easy</span>
          </div>
          <span className="text-sm">35:30h</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm">Medium</span>
          </div>
          <span className="text-sm">21:32h</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded-full bg-red-500"></div>
            <span className="text-sm">Hard</span>
          </div>
          <span className="text-sm">10:30h</span>
        </div>
      </div>
    </div>
  )
}
