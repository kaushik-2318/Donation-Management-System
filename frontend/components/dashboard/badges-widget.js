import { CheckCircle, XCircle } from "lucide-react"

export default function BadgesWidget({ badges }) {
  if (!badges || badges.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No badges earned yet.
      </div>
    )
  }
  return (
    <div className="space-y-4">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className="flex items-start gap-3 border-b pb-3 last:border-0 hover:bg-gray-50 p-2 rounded-md transition-colors"
        >
          {badge.earned ? (
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 text-gray-300 mt-0.5" />
          )}
          <div>
            <div className={`font-medium ${badge.earned ? "text-gray-900" : "text-gray-500"}`}>{badge.name}</div>
            <div className="text-sm text-gray-500">{badge.description}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

