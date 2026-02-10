'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check, CreditCard, Loader2, Lock, Shield } from 'lucide-react';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '../../../lib/utils.js';
import { PaymentProps } from './types.js';

const paymentSchema = z.object({
    methodCode: z.string().min(1),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export const Payment: FC<PaymentProps> = ({
    methods,
    selectedMethodCode,
    onSubmit,
    onGoBack,
    isSubmitting,
    error,
    ref,
    selected: componentSelected,
}) => {
    const { handleSubmit, setValue, watch } = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            methodCode: selectedMethodCode ?? methods[0]?.code ?? '',
        },
    });

    const selectedCode = watch('methodCode');

    const onFormSubmit = (data: PaymentFormValues) => {
        onSubmit?.({ methodCode: data.methodCode });
    };

    return (
        <div ref={ref} className={cn(componentSelected && 'ring-2 ring-ring')}>
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-primary" />
                    Payment
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Select your payment method to complete the order.
                </p>
            </div>

            {error && (
                <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            {methods.length === 0 ? (
                <div className="rounded-xl border border-border bg-muted/30 px-6 py-8 text-center">
                    <CreditCard className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">
                        No payment methods available.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
                    <div className="space-y-3">
                        {methods.map(method => {
                            const isSelected = method.code === selectedCode;
                            return (
                                <label
                                    key={method.code}
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
                                        name="paymentMethod"
                                        value={method.code}
                                        checked={isSelected}
                                        onChange={() => setValue('methodCode', method.code)}
                                        className="sr-only"
                                    />
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-foreground">
                                            {method.name}
                                        </p>
                                        {method.description && (
                                            <p className="text-sm text-muted-foreground mt-0.5">
                                                {method.description}
                                            </p>
                                        )}
                                    </div>
                                </label>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                        <Shield className="h-4 w-4" />
                        <span>Your payment information is encrypted and secure.</span>
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
                            disabled={isSubmitting || !selectedCode}
                            className={cn(
                                'inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 shadow-md hover:shadow-lg',
                                (isSubmitting || !selectedCode) &&
                                    'opacity-60 cursor-not-allowed',
                            )}
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Lock className="h-4 w-4" />
                                    Place Order
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};
