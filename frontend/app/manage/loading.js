import Header from "@/components/header"
import Footer from "@/components/footer"
import BackgroundAnimation from "@/components/background-animation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function LoadingManageRequests() {
    return (
        <div className="min-h-screen flex flex-col">
            <BackgroundAnimation />
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center mb-6">
                        <Button variant="ghost" disabled className="mr-4">
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-3xl font-bold">Manage Your Requests</h1>
                    </div>

                    <div className="space-y-6">
                        <div className="h-10 bg-gray-200 rounded w-96 animate-pulse"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-64 bg-gray-200 rounded-lg"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

