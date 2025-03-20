import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function DonationRequests() {
  const requests = [
    {
      id: 1,
      title: "Medical Treatment for Priya",
      requester: "Rahul Sharma",
      description:
        "My daughter Priya needs urgent medical treatment for a rare condition.",
      image: "/placeholder.svg?height=200&width=300",
      raised: 32000,
      goal: 50000,
      daysLeft: 12,
    },
    {
      id: 2,
      title: "Help Rebuild Our Home After Fire",
      requester: "Kumar Family",
      description:
        "Our family home was destroyed in a fire. We need help to rebuild.",
      image: "/placeholder.svg?height=200&width=300",
      raised: 85000,
      goal: 150000,
      daysLeft: 30,
    },
    {
      id: 3,
      title: "College Tuition for First-Generation Student",
      requester: "Ananya Patel",
      description:
        "I'm the first in my family to attend college and need help with tuition.",
      image: "/placeholder.svg?height=200&width=300",
      raised: 48000,
      goal: 100000,
      daysLeft: 45,
    },
  ];

  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Donation Requests</h2>
        <Link
          href="/requests"
          className="text-blue-600 hover:underline group flex items-center"
        >
          View All
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden border transform transition-all hover:shadow-md hover:-translate-y-1 duration-300"
          >
            <div className="relative">
              <Image
                src={request.image || "/placeholder.svg"}
                alt={request.title}
                width={300}
                height={200}
                className="w-full h-40 object-cover"
              />
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-2 py-1 m-2 rounded">
                {request.daysLeft} days left
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{request.title}</h3>
              <div className="text-sm text-gray-600 mb-2">
                Requested by: {request.requester}
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {request.description}
              </p>

              {/* Progress bar */}
              <div className="mb-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (request.raised / request.goal) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between text-sm mb-4">
                <span className="font-medium">
                  ₹{request.raised.toLocaleString()}
                </span>
                <span className="text-gray-500">
                  ₹{request.goal.toLocaleString()}
                </span>
              </div>

              <Link href={`/requests/${request.id}`}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Donate
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
