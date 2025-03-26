import Header from "@/components/header"
import Footer from "@/components/footer"
import BackgroundAnimation from "@/components/background-animation"

export default function RequestDetailLoading() {
    return (
        <div className="min-h-screen flex flex-col">
            <BackgroundAnimation />
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="mb-6">
                    <div className="h-10 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
                            <div className="h-64 md:h-96 bg-gray-200 rounded-t-lg"></div>

                            <div className="p-6">
                                <div className="h-10 bg-gray-200 rounded w-64 mb-6"></div>

                                <div className="space-y-4">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                    <div className="h-16 bg-gray-200 rounded"></div>
                                    <div className="h-16 bg-gray-200 rounded"></div>
                                    <div className="h-16 bg-gray-200 rounded"></div>
                                    <div className="h-16 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                            <div className="mb-6">
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-2.5 bg-gray-200 rounded-full w-full mb-4"></div>
                                <div className="flex justify-between">
                                    <div className="h-10 bg-gray-200 rounded w-24"></div>
                                    <div className="h-10 bg-gray-200 rounded w-24"></div>
                                </div>
                            </div>

                            <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                            <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>

                            <div className="mt-6 pt-6 border-t">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
                                    <div>
                                        <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

