'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Loader2, Mail, User } from 'lucide-react';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '../../../lib/utils.js';
import { CustomerInfoFormData, CustomerInfoProps } from './types.js';

const customerInfoSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    emailAddress: z.string().min(1, 'Email is required').email('Enter a valid email'),
    lastName: z.string().optional().default(''),
});

export const CustomerInfo: FC<CustomerInfoProps> = ({
    value,
    onSubmit,
    onGoBack,
    isSubmitting,
    error,
    ref,
    selected,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors: formErrors },
    } = useForm<CustomerInfoFormData>({
        resolver: zodResolver(customerInfoSchema),
        defaultValues: {
            emailAddress: value?.emailAddress ?? '',
            firstName: value?.firstName ?? '',
            lastName: value?.lastName ?? '',
        },
    });

    const inputClasses = (hasError: boolean) =>
        cn(
            'w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all duration-200',
            'placeholder:text-muted-foreground/60',
            'focus:ring-2 focus:ring-primary/20 focus:border-primary',
            hasError ? 'border-destructive' : 'border-border',
        );

    return (
        <div ref={ref} className={cn(selected && 'ring-2 ring-ring')}>
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Contact Information</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    We'll use this to send your order confirmation.
                </p>
            </div>

            {error && (
                <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(data => onSubmit?.(data))} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <User className="h-4 w-4 text-muted-foreground" />
                            First Name
                        </label>
                        <input
                            type="text"
                            {...register('firstName')}
                            placeholder="John"
                            className={inputClasses(!!formErrors.firstName)}
                        />
                        {formErrors.firstName && (
                            <p className="text-xs text-destructive">{formErrors.firstName.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <User className="h-4 w-4 text-muted-foreground" />
                            Last Name
                        </label>
                        <input
                            type="text"
                            {...register('lastName')}
                            placeholder="Doe"
                            className={inputClasses(!!formErrors.lastName)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Email Address
                    </label>
                    <input
                        type="email"
                        {...register('emailAddress')}
                        placeholder="john@example.com"
                        className={inputClasses(!!formErrors.emailAddress)}
                    />
                    {formErrors.emailAddress && (
                        <p className="text-xs text-destructive">{formErrors.emailAddress.message}</p>
                    )}
                </div>

                <div className="flex items-center justify-between pt-4">
                    {onGoBack ? (
                        <button
                            type="button"
                            onClick={onGoBack}
                            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </button>
                    ) : (
                        <div />
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                            'inline-flex items-center gap-2 rounded-xl bg-primary/80 px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary shadow-sm',
                            isSubmitting && 'opacity-60 cursor-not-allowed',
                        )}
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                Continue
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
