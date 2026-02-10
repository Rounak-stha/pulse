'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Loader2, MapPin, Phone } from 'lucide-react';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '../../../lib/utils.js';
import type { AddressInput } from '../page/types.js';
import type { ShippingAddressProps } from './types.js';

const addressSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    company: z.string().optional(),
    streetLine1: z.string().min(1, 'Street address is required'),
    streetLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    province: z.string().optional(),
    postalCode: z.string().min(1, 'Postal code is required'),
    countryCode: z.string().min(1, 'Country is required'),
    phoneNumber: z.string().optional(),
});

export const ShippingAddress: FC<ShippingAddressProps> = ({
    countries,
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
    } = useForm<AddressInput>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            fullName: value?.fullName ?? '',
            company: value?.company ?? '',
            streetLine1: value?.streetLine1 ?? '',
            streetLine2: value?.streetLine2 ?? '',
            city: value?.city ?? '',
            province: value?.province ?? '',
            postalCode: value?.postalCode ?? '',
            countryCode: value?.countryCode ?? '',
            phoneNumber: value?.phoneNumber ?? '',
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
                <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-primary" />
                    Shipping Address
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">Where should we deliver your order?</p>
            </div>

            {error && (
                <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(data => onSubmit?.(data))} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <input
                        type="text"
                        {...register('fullName')}
                        placeholder="John Doe"
                        className={inputClasses(!!formErrors.fullName)}
                    />
                    {formErrors.fullName && <p className="text-xs text-destructive">{formErrors.fullName.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Company (optional)</label>
                    <input
                        type="text"
                        {...register('company')}
                        placeholder="Acme Inc."
                        className={inputClasses(!!formErrors.company)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Street Address</label>
                    <input
                        type="text"
                        {...register('streetLine1')}
                        placeholder="123 Main Street"
                        className={inputClasses(!!formErrors.streetLine1)}
                    />
                    {formErrors.streetLine1 && <p className="text-xs text-destructive">{formErrors.streetLine1.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        Apt, Suite, Unit (optional)
                    </label>
                    <input
                        type="text"
                        {...register('streetLine2')}
                        placeholder="Apt 4B"
                        className={inputClasses(!!formErrors.streetLine2)}
                    />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">City</label>
                        <input
                            type="text"
                            {...register('city')}
                            placeholder="New York"
                            className={inputClasses(!!formErrors.city)}
                        />
                        {formErrors.city && <p className="text-xs text-destructive">{formErrors.city.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">State / Province</label>
                        <input
                            type="text"
                            {...register('province')}
                            placeholder="NY"
                            className={inputClasses(!!formErrors.province)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Postal Code</label>
                        <input
                            type="text"
                            {...register('postalCode')}
                            placeholder="10001"
                            className={inputClasses(!!formErrors.postalCode)}
                        />
                        {formErrors.postalCode && (
                            <p className="text-xs text-destructive">{formErrors.postalCode.message}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Country</label>
                    <select
                        {...register('countryCode')}
                        className={cn(
                            inputClasses(!!formErrors.countryCode),
                            'appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10',
                        )}
                    >
                        <option value="">Select country</option>
                        {countries.map(c => (
                            <option key={c.code} value={c.code}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    {formErrors.countryCode && <p className="text-xs text-destructive">{formErrors.countryCode.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        Phone Number (optional)
                    </label>
                    <input
                        type="tel"
                        {...register('phoneNumber')}
                        placeholder="+1 (555) 123-4567"
                        className={inputClasses(!!formErrors.phoneNumber)}
                    />
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
