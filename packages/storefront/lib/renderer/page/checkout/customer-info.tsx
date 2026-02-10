'use client';
import { setCustomerForOrderMutation } from '@/lib/queries/checkout';
import { useMutation } from '@apollo/client/react';
import { CustomerInfo as CustomerInfoPure } from '@vendure/storefront-blocks/compounds';
import type { CustomerInfoProps as CustomerInfoPropsPure } from '@vendure/storefront-blocks/types';
import type { FC } from 'react';
import { useState } from 'react';

type CustomerInfoProps = CustomerInfoPropsPure & {
    shopcode: string;
    onStepComplete?: () => void;
};

export const CustomerInfo: FC<CustomerInfoProps> = ({ shopcode, onStepComplete, ...props }) => {
    const [error, setError] = useState<string>();
    const [setCustomer, { loading }] = useMutation(setCustomerForOrderMutation, {
        context: { headers: { shopcode } },
    });

    const handleSubmit: CustomerInfoPropsPure['onSubmit'] = async data => {
        try {
            setError(undefined);
            const result = await setCustomer({
                variables: {
                    input: {
                        emailAddress: data.emailAddress,
                        firstName: data.firstName,
                        lastName: data.lastName,
                    },
                },
            });
            const res = result.data?.setCustomerForOrder;
            if (res && res.__typename !== 'Order') {
                setError(res.message ?? 'An error occurred');
                return;
            }
            onStepComplete?.();
        } catch {
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return <CustomerInfoPure {...props} onSubmit={handleSubmit} isSubmitting={loading} error={error} />;
};
