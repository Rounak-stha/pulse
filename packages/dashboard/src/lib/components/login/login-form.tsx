import { Link } from '@tanstack/react-router';
import { ArrowRight, BarChart3, Package, Store } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { GoogleButton } from '@/vdb/components/auth/google-button.js';
import { Card, CardContent } from '@/vdb/components/ui/card.js';

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
        <div className="grid min-h-screen lg:grid-cols-5">
            {/* Left Panel — Brand Story */}
            <div className="relative hidden lg:flex lg:col-span-3 flex-col justify-between bg-zinc-950 p-12 text-white overflow-hidden">
                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)',
                        backgroundSize: '64px 64px',
                    }}
                />

                {/* Gradient glow */}
                <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-teal-500/20 blur-[120px]" />
                <div className="absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" />

                {/* Logo */}
                <div className="relative z-10">
                    <span className="text-2xl font-bold tracking-tight">Pulse</span>
                </div>

                {/* Hero content */}
                <div className="relative z-10 max-w-lg">
                    <h1 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                        Your store,{' '}
                        <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                            simplified.
                        </span>
                    </h1>
                    <p className="mt-4 text-lg text-zinc-400 leading-relaxed">
                        Everything you need to launch, manage, and grow your online business — from
                        products to payments to customers.
                    </p>

                    {/* Stats row */}
                    <div className="mt-10 flex gap-10">
                        <div>
                            <p className="text-3xl font-bold">2k+</p>
                            <p className="text-sm text-zinc-500">Active stores</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold">99.9%</p>
                            <p className="text-sm text-zinc-500">Uptime</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold">150+</p>
                            <p className="text-sm text-zinc-500">Countries</p>
                        </div>
                    </div>
                </div>

                {/* Feature pills */}
                <div className="relative z-10 flex flex-wrap gap-3">
                    {[
                        { icon: Store, label: 'Storefront builder' },
                        { icon: Package, label: 'Order management' },
                        { icon: BarChart3, label: 'Analytics' },
                    ].map(({ icon: Icon, label }) => (
                        <div
                            key={label}
                            className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-400 backdrop-blur-sm"
                        >
                            <Icon className="h-3.5 w-3.5 text-teal-400" />
                            {label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel — Login Form */}
            <div className="flex lg:col-span-2 flex-col items-center justify-center px-6 py-12 sm:px-10">
                <div className="w-full max-w-sm">
                    {/* Mobile logo */}
                    <div className="mb-10 text-center lg:hidden">
                        <span className="text-2xl font-bold tracking-tight">Pulse</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Sign in to continue to your dashboard.
                        </p>
                    </div>

                    <Card className="border bg-card/50 backdrop-blur-sm">
                        <CardContent className="pt-6">
                            <GoogleButton
                                disabled={isVerifying || !googleScriptLoaded}
                                onClick={onSubmit}
                            />
                        </CardContent>
                    </Card>

                    <div className="mt-8 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                        <span>New to Pulse?</span>
                        <Link
                            to="/signup"
                            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                        >
                            Create an account
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <p className="mt-12 text-center text-xs text-muted-foreground/60">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
}
