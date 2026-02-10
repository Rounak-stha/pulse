'use client';
import { useMutation, useQuery } from '@apollo/client/react';
import { ShippingAddress as ShippingAddressPure } from '@vendure/storefront-blocks/compounds';
import type { ShippingAddressProps as ShippingAddressPropsPure } from '@vendure/storefront-blocks/types';
import type { FC } from 'react';
import { useState } from 'react';
import {
    availableCountriesQuery,
    setOrderShippingAddressMutation,
} from '@/lib/queries/checkout';

type ShippingAddressProps = ShippingAddressPropsPure & {
    shopcode: string;
    onStepComplete?: () => void;
};

export const ShippingAddress: FC<ShippingAddressProps> = ({
    shopcode,
    onStepComplete,
    ...props
}) => {
    const [error, setError] = useState<string>();
    const { data: countriesData } = useQuery(availableCountriesQuery, {
        context: { headers: { shopcode } },
    });
    const [setAddress, { loading }] = useMutation(setOrderShippingAddressMutation, {
        context: { headers: { shopcode } },
    });

    const countries = (countriesData?.availableCountries ?? props.countries).map(c => ({
        code: c.code,
        name: c.name,
    }));

    const handleSubmit: ShippingAddressPropsPure['onSubmit'] = async address => {
        try {
            setError(undefined);
            const result = await setAddress({ variables: { input: address } });
            const res = result.data?.setOrderShippingAddress;
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
        <ShippingAddressPure
            {...props}
            countries={countries}
            onSubmit={handleSubmit}
            isSubmitting={loading}
            error={error}
        />
    );
};
