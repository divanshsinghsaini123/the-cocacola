export default function Loading() {
    return (
        <main className="bg-[#EEEEEE] min-h-screen py-12 md:py-20 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">
                {/* Title Skeleton */}
                <div className="h-8 md:h-12 bg-gray-300 rounded mb-12 w-2/3 mx-auto animate-pulse"></div>

                <div className="space-y-4">
                    {/* List Item Skeletons */}
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="bg-white rounded-lg overflow-hidden shadow-sm p-6 md:p-8 animate-pulse">
                            <div className="flex justify-between items-center">
                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
