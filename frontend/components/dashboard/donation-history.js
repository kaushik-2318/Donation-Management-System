"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function DonationHistory({ donations }) {
  const handleDownloadReceipt = (receiptUrl, campaignName) => {
    // In a real app, this would download the receipt
    // For demo purposes, we'll just alert
    alert(`Downloading receipt for ${campaignName}`)

    // In a real implementation, you would use:
    // window.open(receiptUrl, '_blank');
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="py-3 px-4 font-semibold">Campaign</th>
            <th className="py-3 px-4 font-semibold">NGO</th>
            <th className="py-3 px-4 font-semibold">Amount</th>
            <th className="py-3 px-4 font-semibold">Date</th>
            <th className="py-3 px-4 font-semibold">Receipt</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">
                <Link href="#" className="text-orange-600 hover:underline">
                  {donation.campaign}
                </Link>
              </td>
              <td className="py-3 px-4">{donation.ngo}</td>
              <td className="py-3 px-4">₹{donation.amount.toLocaleString()}</td>
              <td className="py-3 px-4">{new Date(donation.date).toLocaleDateString()}</td>
              <td className="py-3 px-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-600 text-orange-600 hover:bg-orange-50"
                  onClick={() => handleDownloadReceipt(donation.receiptUrl, donation.campaign)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Receipt
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

