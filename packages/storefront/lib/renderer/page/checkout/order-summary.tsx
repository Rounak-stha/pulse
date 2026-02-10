'use client';
import { useMutation, useQuery } from '@apollo/client/react';
import { OrderSummary as OrderSummaryPure } from '@vendure/storefront-blocks/compounds';
import type { OrderSummaryProps as OrderSummaryPropsPure } from '@vendure/storefront-blocks/types';
import type { FC } from 'react';
import { activeOrderQuery } from '@/lib/queries/checkout';

type OrderSummaryProps = Omit<OrderSummaryPropsPure, 'order'> & {
    shopcode: string;
    order: OrderSummaryPropsPure['order'];
    onGoNext?: () => void;
};

export const OrderSummary: FC<OrderSummaryProps> = ({ shopcode, ...props }) => {
    return (
        <OrderSummaryPure
            {...props}
            currencyCode={props.order?.currencyCode ?? props.currencyCode}
        />
    );
};
