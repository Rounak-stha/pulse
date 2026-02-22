'use client';
import {
    addPaymentToOrderMutation,
    eligiblePaymentMethodsQuery,
    transitionOrderToStateMutation,
} from '@/lib/queries/checkout';
import { useMutation, useQuery } from '@apollo/client/react';
import { Payment as PaymentPure } from '@vendure/storefront-blocks/compounds';
import type { PaymentProps as PaymentPropsPure } from '@vendure/storefront-blocks/types';
import type { FC } from 'react';
import { useState } from 'react';

type PaymentProps = PaymentPropsPure & {
    shopcode: string;
    onOrderComplete?: (orderCode: string) => void;
};

/**
 * Extracts a redirect URL from the order's payments metadata.
 * Any payment handler that needs an external redirect (e.g. Khalti, Stripe, PayPal)
 * should put the URL in `metadata.public.paymentUrl`.
 */
function getPaymentRedirectUrl(
    payments: Array<{ state: string; metadata: Record<string, unknown> | null }>,
): string | undefined {
    for (const payment of payments) {
        const pub = payment.metadata?.public as Record<string, unknown> | undefined;
        const url = pub?.paymentUrl;
        if (typeof url === 'string' && url.length > 0) {
            return url;
        }
    }
    return undefined;
}

export const Payment: FC<PaymentProps> = ({ shopcode, onOrderComplete, ...props }) => {
    const [error, setError] = useState<string>();
    const { data: methodsData } = useQuery(eligiblePaymentMethodsQuery, {
        context: { headers: { shopcode } },
    });
    const [transitionOrder] = useMutation(transitionOrderToStateMutation, {
        context: { headers: { shopcode } },
    });
    const [addPayment, { loading }] = useMutation(addPaymentToOrderMutation, {
        context: { headers: { shopcode } },
    });

    const methods = (methodsData?.eligiblePaymentMethods ?? props.methods).map(m => ({
        id: m.id,
        name: m.name,
        description: m.description,
        code: m.code,
    }));

    const handleSubmit: PaymentPropsPure['onSubmit'] = async data => {
        try {
            setError(undefined);
            await transitionOrder({ variables: { state: 'ArrangingPayment' } });
            const result = await addPayment({
                variables: {
                    input: {
                        method: data.methodCode,
                        metadata: data.metadata ?? {},
                    },
                },
            });
            const res = result.data?.addPaymentToOrder;
            if (res && res.__typename === 'Order') {
                // Check if the payment handler returned an external redirect URL
                // (e.g. Khalti, Stripe Checkout, PayPal, etc.)
                const redirectUrl = getPaymentRedirectUrl(res.payments ?? []);
                if (redirectUrl) {
                    // External payment page — full navigation required
                    window.location.href = redirectUrl;
                    return;
                }
                // Inline payment (e.g. COD) — order is complete
                onOrderComplete?.(res.code);
                return;
            }
            if (res) {
                await transitionOrder({ variables: { state: 'AddingItems' } });
                setError(res.message ?? 'Payment failed');
            }
        } catch {
            await transitionOrder({ variables: { state: 'AddingItems' } });
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <PaymentPure
            {...props}
            methods={methods}
            onSubmit={handleSubmit}
            isSubmitting={loading}
            error={error}
        />
    );
};
