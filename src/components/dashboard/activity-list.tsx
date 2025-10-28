import { useActivities } from '@/hooks/useActivities'

export function ActivityList() {
  const { items, loading, error } = useActivities(10)

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800 text-left text-xs font-medium uppercase text-gray-400">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Last</th>
            <th className="px-4 py-3">Progress</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-400">Loading submissions…</td>
            </tr>
          )}
          {error && !loading && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-red-400">{error}</td>
            </tr>
          )}
          {!loading && !error && items.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-400">No recent submissions</td>
            </tr>
          )}
          {!loading && !error && items.map((activity, index) => (
            <tr key={index} className="border-b border-zinc-800 text-sm last:border-0">
              <td className="px-4 py-3">{index + 1}.</td>
              <td className="px-4 py-3">{activity.title}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                    activity.status === 'success'
                      ? 'bg-green-500/20 text-green-500'
                      : activity.status === 'warning'
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : 'bg-red-500/20 text-red-500'
                  }`}
                >
                  {activity.status === 'success' ? 'PASS' : activity.status === 'warning' ? 'WARN' : 'FAIL'}
                </span>
              </td>
              <td className="px-4 py-3">{activity.time}</td>
              <td className="px-4 py-3">
                <div className="h-2 w-16 rounded-full bg-zinc-800">
                  <div
                    className={`h-full rounded-full ${
                      activity.status === 'success'
                        ? 'bg-green-500'
                        : activity.status === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
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
