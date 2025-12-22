import { Link } from '@tanstack/react-router';

import { GoogleButton } from '@/vdb/components/auth/google-button.js';
import { useEffect } from 'react';
import { toast } from 'sonner';
export interface LoginFormProps {
    googleScriptLoaded: boolean;
    signinError?: string;
    isVerifying?: boolean;
    onSubmit: () => void;
}

export function LoginForm({ signinError, isVerifying, onSubmit, googleScriptLoaded }: LoginFormProps) {
    useEffect(() => {
        if (!isVerifying && signinError) {
            toast.error(signinError);
        }
    }, [isVerifying, signinError]);

    return (
        <div className="w-full container mx-auto my-10">
            <div className="mb-12">
                <img src="/top-of-the-world.png" className="w-full rounded-lg" loading="lazy" />
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold text-center mb-4">Welcome back to Pulse</h1>

            {/* Subtitle */}
            <p className="text-center mb-10 text-base text-muted-foreground">
                Sign in with your Google account to manage your online store.
            </p>

            {/* Form */}
            <div className="w-full md:w-1/2 lg:w-1/3 mx-auto">
                <GoogleButton disabled={isVerifying || !googleScriptLoaded} onClick={onSubmit} />
            </div>
            <p className="text-sm text-muted-foreground text-center mt-2">
                <span className="mr-1">Don't have an account?</span>
                <Link to="/signup">
                    <span className="text-blue-500 hover:underline">Register</span>
                </Link>
            </p>
        </div>
    );
}
