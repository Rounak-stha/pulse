import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { ArrowRight, BarChart3, Package, Store } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { GoogleButton } from '@/vdb/components/auth/google-button.js';
import { Card, CardContent } from '@/vdb/components/ui/card.js';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/vdb/components/ui/form.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Trans } from '@/vdb/lib/trans.js';

export interface SignUpFormProps {
    googleScriptLoaded: boolean;
    signUpError?: string;
    isVerifying?: boolean;
    onSubmit: (shopname: string, shopcode: string) => void;
}

const formSchema = z.object({
    shopname: z.string().min(3),
    shopcode: z
        .string()
        .min(3, 'Shop code must be at least 3 characters')
        .max(30, 'Shop code must be at most 30 characters')
        .regex(
            /^(?!-)(?!.*--)[a-z0-9-]+(?<!-)$/,
            'Shop code can only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen',
        ),
});

export function SignupForm({
    signUpError,
    isVerifying,
    onSubmit: handleSubmit,
    googleScriptLoaded,
}: SignUpFormProps) {
    useEffect(() => {
        if (!isVerifying && signUpError) {
            toast.error(signUpError);
        }
    }, [isVerifying, signUpError]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            shopname: '',
            shopcode: '',
        },
        mode: 'onChange',
    });

    const {
        formState: { isValid },
    } = form;

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
                        Launch your store{' '}
                        <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                            in minutes.
                        </span>
                    </h1>
                    <p className="mt-4 text-lg text-zinc-400 leading-relaxed">
                        No code, no hassle. Create a beautiful online store with built-in payments, inventory,
                        and a drag-and-drop website builder.
                    </p>
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

            {/* Right Panel — Signup Form */}
            <div className="flex lg:col-span-2 flex-col items-center justify-center px-6 py-12 sm:px-10">
                <div className="w-full max-w-sm">
                    {/* Mobile logo */}
                    <div className="mb-10 text-center lg:hidden">
                        <span className="text-2xl font-bold tracking-tight">Pulse</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight">Create your store</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Fill in your shop details to get started.
                        </p>
                    </div>

                    <Card className="border bg-card/50 backdrop-blur-sm">
                        <CardContent className="pt-6">
                            <Form {...form}>
                                <form
                                    className="space-y-4"
                                    onSubmit={form.handleSubmit(data =>
                                        handleSubmit(data.shopname, data.shopcode),
                                    )}
                                >
                                    <FormField
                                        control={form.control}
                                        name="shopname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="shopname" asChild>
                                                    <Trans>Shop Name</Trans>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="My Awesome Store"
                                                        className="h-11"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="shopcode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="shopcode" asChild>
                                                    <Trans>Shop Code</Trans>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="my-awesome-store"
                                                        className="h-11"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Your store's subdomain (e.g. <b>shopcode.tdata.app</b>).
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="pt-2">
                                        <GoogleButton
                                            disabled={isVerifying || !googleScriptLoaded || !isValid}
                                        />
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <div className="mt-8 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                        <span>Already have an account?</span>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                        >
                            Sign in
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
