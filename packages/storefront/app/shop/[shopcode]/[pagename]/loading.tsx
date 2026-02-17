export default function PageLoading() {
    return (
        <div className="min-h-screen animate-pulse">
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
                <div className="h-[400px] bg-gray-200 rounded-lg" />
                <div className="h-8 w-64 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
            </div>
        </div>
    );
}
