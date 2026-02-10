'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Check, Loader2, Truck } from 'lucide-react';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '../../../lib/utils.js';
import { ShippingMethodProps } from './types.js';

const shippingMethodSchema = z.object({
    shippingMethodId: z.string().min(1),
});

type ShippingMethodFormData = z.infer<typeof shippingMethodSchema>;

export const ShippingMethod: FC<ShippingMethodProps> = ({
    methods,
    selectedMethodId,
    currencyCode,
    onSubmit,
    onGoBack,
    isSubmitting,
    error,
    ref,
    selected: componentSelected,
}) => {
    const { handleSubmit, setValue, watch } = useForm<ShippingMethodFormData>({
        resolver: zodResolver(shippingMethodSchema),
        defaultValues: {
            shippingMethodId: selectedMethodId ?? methods[0]?.id ?? '',
        },
    });

    const selectedId = watch('shippingMethodId');

    const formatPrice = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(
            amount / 100,
        );

    const onFormSubmit = (data: ShippingMethodFormData) => {
        onSubmit?.(data.shippingMethodId);
    };

    return (
        <div ref={ref} className={cn(componentSelected && 'ring-2 ring-ring')}>
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Truck className="h-6 w-6 text-primary" />
                    Shipping Method
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Choose how you'd like your order delivered.
                </p>
            </div>

            {error && (
                <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            {methods.length === 0 ? (
                <div className="rounded-xl border border-border bg-muted/30 px-6 py-8 text-center">
                    <Truck className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">
                        No shipping methods available. Please check your address.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
                    <div className="space-y-3">
                        {methods.map(method => {
                            const isSelected = method.id === selectedId;
                            const isFree = method.priceWithTax === 0;
                            return (
                                <label
                                    key={method.id}
                                    className={cn(
                                        'flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all duration-200',
                                        isSelected
                                            ? 'border-primary bg-primary/5 shadow-sm'
                                            : 'border-border hover:border-muted-foreground/40 hover:bg-muted/20',
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                                            isSelected
                                                ? 'border-primary bg-primary'
                                                : 'border-border',
                                        )}
                                    >
                                        {isSelected && (
                                            <Check className="h-3 w-3 text-primary-foreground" />
                                        )}
                                    </div>
                                    <input
                                        type="radio"
                                        name="shippingMethod"
                                        value={method.id}
                                        checked={isSelected}
                                        onChange={() => setValue('shippingMethodId', method.id)}
                                        className="sr-only"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-foreground">{method.name}</p>
                                        {method.description && (
                                            <p className="text-sm text-muted-foreground mt-0.5">
                                                {method.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="shrink-0 text-right">
                                        {isFree ? (
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                Free
                                            </span>
                                        ) : (
                                            <span className="font-semibold text-foreground tabular-nums">
                                                {formatPrice(method.priceWithTax)}
                                            </span>
                                        )}
                                    </div>
                                </label>
                            );
                        })}
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
                            disabled={isSubmitting || !selectedId}
                            className={cn(
                                'inline-flex items-center gap-2 rounded-xl bg-primary/80 px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary shadow-sm',
                                (isSubmitting || !selectedId) && 'opacity-60 cursor-not-allowed',
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
            )}
        </div>
    );
};
