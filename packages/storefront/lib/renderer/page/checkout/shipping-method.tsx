'use client';
import { useMutation, useQuery } from '@apollo/client/react';
import { ShippingMethod as ShippingMethodPure } from '@vendure/storefront-blocks/compounds';
import type { ShippingMethodProps as ShippingMethodPropsPure } from '@vendure/storefront-blocks/types';
import type { FC } from 'react';
import { useState } from 'react';
import {
    eligibleShippingMethodsQuery,
    setOrderShippingMethodMutation,
} from '@/lib/queries/checkout';

type ShippingMethodProps = ShippingMethodPropsPure & {
    shopcode: string;
    onStepComplete?: () => void;
};

export const ShippingMethod: FC<ShippingMethodProps> = ({
    shopcode,
    onStepComplete,
    ...props
}) => {
    const [error, setError] = useState<string>();
    const { data: methodsData } = useQuery(eligibleShippingMethodsQuery, {
        context: { headers: { shopcode } },
    });
    const [setMethod, { loading }] = useMutation(setOrderShippingMethodMutation, {
        context: { headers: { shopcode } },
    });

    const methods = (methodsData?.eligibleShippingMethods ?? props.methods).map(m => ({
        id: m.id,
        name: m.name,
        description: m.description,
        priceWithTax: m.priceWithTax,
        currencyCode: props.currencyCode,
    }));

    const handleSubmit: ShippingMethodPropsPure['onSubmit'] = async shippingMethodId => {
        try {
            setError(undefined);
            const result = await setMethod({
                variables: { shippingMethodId: [shippingMethodId] },
            });
            const res = result.data?.setOrderShippingMethod;
            if (res && res.__typename !== 'Order') {
                setError((res as any).message ?? 'An error occurred');
                return;
            }
            onStepComplete?.();
        } catch {
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <ShippingMethodPure
            {...props}
            methods={methods}
            onSubmit={handleSubmit}
            isSubmitting={loading}
            error={error}
        />
    );
};
