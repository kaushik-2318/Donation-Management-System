import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye } from "lucide-react"

export default function RequestsList({ requests }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="py-3 px-4 font-semibold">Request</th>
            <th className="py-3 px-4 font-semibold">Status</th>
            <th className="py-3 px-4 font-semibold">Raised</th>
            <th className="py-3 px-4 font-semibold">Goal</th>
            <th className="py-3 px-4 font-semibold">Days Left</th>
            <th className="py-3 px-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">
                <Link href={`/requests/${request.id}`} className="text-blue-600 hover:underline">
                  {request.title}
                </Link>
              </td>
              <td className="py-3 px-4">
                <Badge
                  variant={request.status === "active" ? "default" : "outline"}
                  className={
                    request.status === "active"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                  }
                >
                  {request.status === "active" ? "Active" : "Completed"}
                </Badge>
              </td>
              <td className="py-3 px-4">₹{request.raised.toLocaleString()}</td>
              <td className="py-3 px-4">₹{request.goal.toLocaleString()}</td>
              <td className="py-3 px-4">{request.daysLeft}</td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Link href={`/requests/${request.id}/edit`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/requests/${request.id}`}>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

