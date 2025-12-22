import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Input } from '@/vdb/components/ui/input.js';

import { GoogleButton } from '@/vdb/components/auth/google-button.js';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/vdb/components/ui/form.js';
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
        <div className="w-full container mx-auto my-10">
            <div className="mb-12">
                <img src="/top-of-the-world.png" className="w-full rounded-lg" loading="lazy" />
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold text-center mb-4">Get started with Pulse</h1>

            {/* Subtitle */}
            <p className="text-center mb-10 text-base text-muted-foreground">
                Sign up with your Google account to start building your online store effortlessly.
            </p>

            {/* Form */}
            <Form {...form}>
                <form
                    className="p-6 md:p-8 flex flex-col items-stretch justify-center"
                    onSubmit={form.handleSubmit(data => handleSubmit(data.shopname, data.shopcode))}
                >
                    <div className="space-y-4 mb-6 w-full md:w-1/2 lg:w-1/3 mx-auto">
                        <FormField
                            control={form.control}
                            name="shopname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="shopname" asChild>
                                        <Trans>Shop Name</Trans>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Shop Name" className="h-12" />
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
                                        <Input {...field} placeholder="Shop Code" className="h-12" />
                                    </FormControl>
                                    <FormDescription>
                                        Used for your store’s subdomain (e.g. <b>shopcode.bazaar.com</b>).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Google Sign Up Button */}
                    <div className="w-full md:w-1/2 lg:w-1/3 mx-auto">
                        <GoogleButton disabled={isVerifying || !googleScriptLoaded || !isValid} />
                    </div>
                </form>
            </Form>
        </div>
    );
}
