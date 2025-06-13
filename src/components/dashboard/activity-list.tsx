export function ActivityList() {
  const activities = [
    {
      title: "Two Sum",
      time: "56:54",
      status: "success",
      progress: 100,
    },
    {
      title: "Add Two Numbers",
      time: "55:74",
      status: "success",
      progress: 100,
    },
    {
      title: "Longest Substring Without Repeating Characters",
      time: "55:74",
      status: "error",
      progress: 100,
    },
    {
      title: "Median of Two Sorted Arrays",
      time: "56:84",
      status: "success",
      progress: 100,
    },
    {
      title: "Longest Palindromic Substring",
      time: "55:74",
      status: "warning",
      progress: 100,
    },
    {
      title: "Zigzag Conversion",
      time: "55:74",
      status: "success",
      progress: 100,
    },
    {
      title: "Reverse Integer",
      time: "56:74",
      status: "success",
      progress: 100,
    },
    {
      title: "String to Integer (atoi)",
      time: "55:74",
      status: "warning",
      progress: 100,
    },
    {
      title: "Palindromic Number",
      time: "55:74",
      status: "error",
      progress: 100,
    },
  ]

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800 text-left text-xs font-medium uppercase text-gray-400">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Acceptance</th>
            <th className="px-4 py-3">Last</th>
            <th className="px-4 py-3">Progress</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={index} className="border-b border-zinc-800 text-sm last:border-0">
              <td className="px-4 py-3">{index + 1}.</td>
              <td className="px-4 py-3">{activity.title}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                    activity.status === "success"
                      ? "bg-green-500/20 text-green-500"
                      : activity.status === "warning"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : "bg-red-500/20 text-red-500"
                  }`}
                >
                  {activity.status === "success" ? "PASS" : activity.status === "warning" ? "WARN" : "FAIL"}
                </span>
              </td>
              <td className="px-4 py-3">{activity.time}</td>
              <td className="px-4 py-3">
                <div className="h-2 w-16 rounded-full bg-zinc-800">
                  <div
                    className={`h-full rounded-full ${
                      activity.status === "success"
                        ? "bg-green-500"
                        : activity.status === "warning"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${activity.progress}%` }}
                  ></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
