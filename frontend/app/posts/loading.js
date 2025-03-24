import { Skeleton } from "@/components/ui/skeleton"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackgroundAnimation from "@/components/background-animation"

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col">
            <BackgroundAnimation />
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <Skeleton className="h-10 w-64 mb-2" />
                            <Skeleton className="h-5 w-96" />
                        </div>
                        <Skeleton className="h-10 w-32" />
                    </div>

                    <Skeleton className="h-16 w-full mb-8 rounded-lg" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array(6)
                            .fill()
                            .map((_, i) => (
                                <div key={i} className="bg-white rounded-lg shadow-md border overflow-hidden">
                                    <Skeleton className="h-48 w-full" />
                                    <div className="p-6">
                                        <Skeleton className="h-5 w-24 mb-3" />
                                        <Skeleton className="h-7 w-full mb-2" />
                                        <Skeleton className="h-4 w-48 mb-4" />
                                        <Skeleton className="h-4 w-full mb-2" />
                                        <Skeleton className="h-4 w-full mb-2" />
                                        <Skeleton className="h-4 w-3/4 mb-4" />
                                        <Skeleton className="h-5 w-24" />
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

