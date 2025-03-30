import { Skeleton } from "@/components/ui/skeleton"

export default function EditCampaignLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <Skeleton className="h-10 w-48 mb-6" />

                <Skeleton className="h-4 w-full max-w-md mb-8" />

                <div className="rounded-lg overflow-hidden">
                    <Skeleton className="h-[600px] w-full" />
                </div>
            </div>
        </div>
    )
}

