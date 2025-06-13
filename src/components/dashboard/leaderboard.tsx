export function Leaderboard() {
  const leaderboardData = [
    {
      place: 1,
      player: "Player 1",
      score: 30,
      school: "1342",
      starred: true,
    },
    {
      place: 2,
      player: "Player 2",
      score: 28,
      school: "1217",
      starred: true,
    },
    {
      place: 3,
      player: "Player 3",
      score: 26,
      school: "1054",
      starred: true,
    },
    {
      place: 4,
      player: "Player 1",
      score: 30,
      school: "1342",
      starred: false,
    },
    {
      place: 5,
      player: "Player 2",
      score: 28,
      school: "1217",
      starred: false,
    },
    {
      place: 6,
      player: "Player 3",
      score: 26,
      school: "1054",
      starred: false,
    },
    {
      place: 7,
      player: "Player 1",
      score: 30,
      school: "1342",
      starred: true,
    },
  ]

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800 text-left text-xs font-medium uppercase text-gray-400">
            <th className="px-4 py-3">Place</th>
            <th className="px-4 py-3">Player Name</th>
            <th className="px-4 py-3">Current Streak</th>
            <th className="px-4 py-3">School</th>
            <th className="px-4 py-3">Rating</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((item, index) => (
            <tr key={index} className="border-b border-zinc-800 text-sm last:border-0">
              <td className="px-4 py-3">{item.place}</td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <div className="mr-2 h-6 w-6 rounded-full bg-zinc-700"></div>
                  {item.player}
                </div>
              </td>
              <td className="px-4 py-3">{item.score}</td>
              <td className="px-4 py-3">{item.school}</td>
              <td className="px-4 py-3">
                {item.starred ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-amber-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
