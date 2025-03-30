import { Skeleton } from "@/components/ui/skeleton"

export default function HelpSupportLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Skeleton className="h-10 w-80 mb-6" />

                <Skeleton className="h-4 w-full max-w-md mb-8" />

                <Skeleton className="h-12 w-full mb-8 rounded-md" />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {Array(4)
                        .fill()
                        .map((_, i) => (
                            <Skeleton key={i} className="h-40 rounded-lg" />
                        ))}
                </div>

                <Skeleton className="h-[400px] w-full rounded-lg mb-12" />

                <Skeleton className="h-[500px] w-full rounded-lg" />
            </div>
        </div>
    )
}