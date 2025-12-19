'use client';
import { useState } from 'react';

export function ErrorView({
    title = 'Well, This is Awkward',
    message = 'Something went wrong. Shocking, I know.',
}) {
    const [randomNumber] = useState(() => Math.random());
    const errorEmojis = ['🤷', '💀', '🫠', '😵', '🙃'];
    const randomEmoji = errorEmojis[Math.floor(randomNumber * errorEmojis.length)];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="max-w-md w-full">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-6">
                        <div className="text-7xl mb-4 animate-bounce">{randomEmoji}</div>
                        <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
                        <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mb-4"></div>
                        <p className="text-slate-300 text-lg leading-relaxed">{message}</p>
                    </div>
                </div>

                <div className="text-center mt-6 text-slate-400 text-sm">
                    <p>💡 Pro tip: Have you tried turning it off and on again?</p>
                </div>
            </div>
        </div>
    );
}
