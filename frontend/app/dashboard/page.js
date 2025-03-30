'use client'

import React from 'react'
import getJWTId from "@/lib/getJWTId";
import ReceiverDashboard from '@/components/dashboard/receiver'
import NgoDashboard from '@/components/dashboard/ngo'
import DonorDashboard from '@/components/dashboard/donor'

export default function page() {
    if (typeof window !== "undefined") {
        const { id, role } = getJWTId();
        if (role === 'receiver') {
            return <ReceiverDashboard />
        } else if (role === 'ngo') {
            return <NgoDashboard />
        } else if (role === 'donor') {
            return <DonorDashboard />
        }
    }
}
