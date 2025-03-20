import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function TrendingNGOs() {
  const ngos = [
    {
      id: 1,
      name: "Clean Water Initiative",
      description:
        "Providing clean water solutions to communities in need around India.",
      image: "/placeholder.svg?height=200&width=300",
      donationsCount: 1245,
      campaignsCount: 8,
    },
    {
      id: 2,
      name: "Education for All",
      description:
        "Supporting education programs for underprivileged children in rural areas.",
      image: "/placeholder.svg?height=200&width=300",
      donationsCount: 987,
      campaignsCount: 5,
    },
    {
      id: 3,
      name: "Wildlife Conservation Trust",
      description:
        "Protecting endangered species and their habitats through conservation efforts.",
      image: "/placeholder.svg?height=200&width=300",
      donationsCount: 756,
      campaignsCount: 6,
    },
  ];

  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Trending NGOs</h2>
        <Link
          href="/ngos"
          className="text-blue-600 hover:underline group flex items-center"
        >
          View All
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {ngos.map((ngo) => (
          <div
            key={ngo.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden border transform transition-all hover:shadow-md hover:-translate-y-1 duration-300"
          >
            <div className="relative">
              <Image
                src={ngo.image || "/placeholder.svg"}
                alt={ngo.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{ngo.name}</h3>
              <p className="text-gray-600 mb-4">{ngo.description}</p>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>{ngo.donationsCount} donations</span>
                <span>{ngo.campaignsCount} campaigns</span>
              </div>
              <Link href={`/ngos/${ngo.id}`}>
                <Button className="w-full text-white bg-blue-600 hover:bg-blue-700">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
