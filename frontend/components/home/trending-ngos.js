'use client'

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getTrendingNGOs } from "@/lib/api";

export default function TrendingNGOs() {
  const [ngos, setNGOs] = useState([
    {
      id: 1,
      organization_name: "Clean Water Initiative",
      organization_description: "Providing clean water solutions to communities in need around India.",
      organization_image: "./clean water.jpg",
      stats: {
        totalDonations: 1245,
        totalCampaigns: 8,
      },
    },
    {
      id: 2,
      organization_name: "Education for All",
      organization_description: "Supporting education programs for underprivileged children in rural areas.",  
      organization_image: "./edu_for_all.jpg",
      stats: {
        totalDonations: 987,
        totalCampaigns: 5,
      },
    },
    {
      id: 3,
      organization_name: "Wildlife Conservation Trust",
      organization_description: "Protecting endangered species and their habitats through conservation efforts.",
      organization_image: "./Tiger.webp",
      stats: {
        totalDonations: 756,
        totalCampaigns: 6,
      },
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const ngos = await getTrendingNGOs();
        setLoading(false);
      } catch (err) {
        console.error("Error fetching trending NGOs:", err);
        setError(err);
        setLoading(false);
      }
    };
    fetchNGOs();
  }, []);
  
  return (
    <>
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
        {ngos.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {ngos.map((ngo) => (
              <div
                key={ngo._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden border transform transition-all hover:shadow-md hover:-translate-y-1 duration-300"
              >
                <div className="relative">
                  <Image
                    src={ngo.organization_image}
                    alt={ngo.organization_name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{ngo.organization_name}</h3>
                  <p className="text-gray-600 mb-4">{ngo.organization_description}</p>
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span>{ngo.stats.totalDonations} donations</span>
                    <span>{ngo.stats.totalCampaigns} campaigns</span>
                  </div>
                  <Link href={`/ngos/${ngo._id}`}>
                    <Button className="w-full text-white bg-blue-600 hover:bg-blue-700">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {loading && <div>Loading...</div>}
            <div className="text-center text-gray-500">No trending NGOs found</div>
          </>
        )}
      </section>
    </>

  );
}
