import { Skeleton } from "@/components/ui/skeleton"

export default function PublicProfileLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Skeleton className="h-4 w-full max-w-md mb-6" />

                <div className="rounded-lg overflow-hidden mb-6">
                    <Skeleton className="h-40 w-full" />
                    <div className="relative">
                        <Skeleton className="absolute -top-16 left-6 h-32 w-32 rounded-full" />
                    </div>
                    <div className="pt-20 pb-6 px-6">
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-60 mb-4" />
                        <Skeleton className="h-16 w-full mb-6" />
                        <div className="flex flex-wrap gap-4">
                            {Array(3)
                                .fill()
                                .map((_, i) => (
                                    <Skeleton key={i} className="h-9 w-32" />
                                ))}
                        </div>
                    </div>
                </div>

                <div className="rounded-lg overflow-hidden">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-[400px] w-full" />
                </div>
            </div>
        </div>
    )
}

