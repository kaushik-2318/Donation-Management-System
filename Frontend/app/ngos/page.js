"use client";
import Header from "@/components/header";
import React, { useState, useEffect } from "react";
import { getAllNGOs } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function page() {
  const [ngos, setNGOs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const ngos = await getAllNGOs();
        console.log(ngos);
        setNGOs(ngos);
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
    <div>
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">NGOs</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" >
            {ngos.length > 0 ? (
              <div>
                {ngos.map((ngo) => (
                  <div
                    key={ngo._id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden border transform transition-all hover:shadow-md hover:-translate-y-1 duration-300"
                  >
                    <div className="relative">
                      <Image
                        src={"/placeholder.svg"}
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
          </div>
        </div>
      </main>
    </div>
  );
}

