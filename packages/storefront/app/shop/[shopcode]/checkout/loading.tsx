export default function CheckoutLoading() {
    return (
        <div className="min-h-screen animate-pulse">
            <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
                <div className="h-8 w-48 bg-gray-200 rounded" />
                <div className="h-64 bg-gray-200 rounded-lg" />
                <div className="h-48 bg-gray-200 rounded-lg" />
                <div className="h-12 w-full bg-gray-200 rounded" />
            </div>
        </div>
    );
}
