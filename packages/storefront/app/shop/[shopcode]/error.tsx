'use client';

export default function ShopError({
    error,
    reset,
}: Readonly<{
    error: Error & { digest?: string };
    reset: () => void;
}>) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="max-w-md w-full">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-6">
                        <div className="text-7xl mb-4">💀</div>
                        <h1 className="text-3xl font-bold text-white mb-3">Well… this is awkward</h1>
                        <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mb-4"></div>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            {error.message || 'Our backend blinked. Try again.'}
                        </p>
                    </div>
                    <button
                        onClick={reset}
                        className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );
}
