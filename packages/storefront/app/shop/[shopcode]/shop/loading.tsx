export default function ShopCatalogLoading() {
    return (
        <div className="min-h-screen animate-pulse">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="h-10 w-32 bg-gray-200 rounded mb-6" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <div className="aspect-square bg-gray-200 rounded-lg" />
                            <div className="h-4 w-3/4 bg-gray-200 rounded" />
                            <div className="h-4 w-1/3 bg-gray-200 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
