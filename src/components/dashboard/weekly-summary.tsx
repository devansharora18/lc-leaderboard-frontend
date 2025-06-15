export function WeeklySummary() {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="mb-4 text-lg font-medium">This week</h3>
      <div className="space-y-4">
        {/* Progress bars for different time periods */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-300">3h 30m</span>
            </div>
          </div>
          <div className="h-2 w-full rounded-full bg-zinc-800">
            <div className="h-full w-3/4 rounded-full bg-green-500"></div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-gray-300">2h 30m</span>
            </div>
          </div>
          <div className="h-2 w-full rounded-full bg-zinc-800">
            <div className="h-full w-1/2 rounded-full bg-yellow-500"></div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-300">0h 30m</span>
            </div>
          </div>
          <div className="h-2 w-full rounded-full bg-zinc-800">
            <div className="h-full w-1/4 rounded-full bg-red-500"></div>
          </div>
        </div>

        {/* Weekly stats */}
        <div className="mt-6 space-y-3 border-t border-zinc-800 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Problems solved</span>
            <span className="text-white">24</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total time</span>
            <span className="text-white">6h 30m</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Average time</span>
            <span className="text-white">16m 15s</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Streak</span>
            <span className="text-white">5 days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
