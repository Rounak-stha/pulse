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
