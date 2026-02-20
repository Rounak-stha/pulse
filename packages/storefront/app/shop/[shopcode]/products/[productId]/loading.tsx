export default function ProductLoading() {
    return (
        <div className="min-h-screen animate-pulse">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="aspect-square bg-gray-200 rounded-lg" />
                    <div className="space-y-4">
                        <div className="h-8 w-3/4 bg-gray-200 rounded" />
                        <div className="h-6 w-1/4 bg-gray-200 rounded" />
                        <div className="h-4 w-full bg-gray-200 rounded" />
                        <div className="h-4 w-full bg-gray-200 rounded" />
                        <div className="h-4 w-2/3 bg-gray-200 rounded" />
                        <div className="h-12 w-full bg-gray-200 rounded mt-8" />
                    </div>
                </div>
            </div>
        </div>
    );
}
