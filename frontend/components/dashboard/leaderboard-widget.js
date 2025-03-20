import { Trophy } from "lucide-react"

export default function LeaderboardWidget({ leaderboard }) {
  const getBadgeColor = (badge) => {
    switch (badge) {
      case "gold":
        return "text-yellow-500"
      case "silver":
        return "text-gray-400"
      case "bronze":
        return "text-amber-700"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      {leaderboard.map((donor) => (
        <div
          key={donor.rank}
          className="flex items-center justify-between border-b pb-3 last:border-0 hover:bg-gray-50 p-2 rounded-md transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 text-center font-semibold">#{donor.rank}</div>
            <div>
              <div className="font-medium">{donor.name}</div>
              <div className="text-sm text-gray-500">₹{donor.amount.toLocaleString()} donated</div>
            </div>
          </div>
          <Trophy className={`h-5 w-5 ${getBadgeColor(donor.badge)}`} />
        </div>
      ))}
    </div>
  )
}

