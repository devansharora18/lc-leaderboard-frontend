export function YearlyActivity() {
  const months = ["June", "July", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"]

  // Generate activity data
  const generateActivityData = () => {
    const data = {}
    months.forEach((month) => {
      data[month] = Array(28)
        .fill(null)
        .map(() => Math.random() > 0.7)
    })
    return data
  }

  const activityData = generateActivityData()

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
