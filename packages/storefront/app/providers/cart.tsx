'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import {
    activeOrderQuery,
    addItemToOrderMutation,
    adjustOrderLineMutation,
    removeOrderLineMutation,
} from '@/lib/queries/cart';

type CartOrder = {
    id: string;
    code: string;
    couponCodes: string[];
    state: string;
    currencyCode: string;
    totalQuantity: number;
    subTotalWithTax: number;
    shippingWithTax: number;
    totalWithTax: number;
    discounts: { description: string; amountWithTax: number }[];
    lines: {
        id: string;
        unitPriceWithTax: number;
        quantity: number;
        linePriceWithTax: number;
        productVariant: { id: string; name: string; sku: string };
        featuredAsset: { id: string; preview: string } | null;
    }[];
    shippingLines: { shippingMethod: { description: string }; priceWithTax: number }[];
};

interface CartContextValue {
    order: CartOrder | null;
    totalQuantity: number;
    drawerOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
    toggleDrawer: () => void;
    addItem: (variantId: string, quantity: number) => Promise<void>;
    adjustQuantity: (lineId: string, quantity: number) => Promise<void>;
    removeLine: (lineId: string) => Promise<void>;
    getVariantQuantity: (variantId: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return ctx;
}

interface CartProviderProps {
    shopcode: string;
    children: React.ReactNode;
}

export function CartProvider({ shopcode, children }: Readonly<CartProviderProps>) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const headers = { shopcode };

    const { data, refetch } = useQuery(activeOrderQuery, {
        context: { headers },
    });

    const [addItemMutation] = useMutation(addItemToOrderMutation, {
        context: { headers },
    });

    const [adjustLineMutation] = useMutation(adjustOrderLineMutation, {
        context: { headers },
    });

    const [removeLineMutation] = useMutation(removeOrderLineMutation, {
        context: { headers },
    });

    const order = data?.activeOrder ?? null;

    const addItem = useCallback(
        async (variantId: string, quantity: number) => {
            await addItemMutation({ variables: { productVariantId: variantId, quantity } });
            await refetch();
        },
        [addItemMutation, refetch],
    );

    const adjustQuantity = useCallback(
        async (lineId: string, quantity: number) => {
            if (quantity <= 0) {
                await removeLineMutation({ variables: { orderLineId: lineId } });
            } else {
                await adjustLineMutation({ variables: { orderLineId: lineId, quantity } });
            }
            await refetch();
        },
        [adjustLineMutation, removeLineMutation, refetch],
    );

    const removeLine = useCallback(
        async (lineId: string) => {
            await removeLineMutation({ variables: { orderLineId: lineId } });
            await refetch();
        },
        [removeLineMutation, refetch],
    );

    const getVariantQuantity = useCallback(
        (variantId: string): number => {
            if (!order) return 0;
            const line = order.lines.find(l => l.productVariant.id === variantId);
            return line?.quantity ?? 0;
        },
        [order],
    );

    const openDrawer = useCallback(() => setDrawerOpen(true), []);
    const closeDrawer = useCallback(() => setDrawerOpen(false), []);
    const toggleDrawer = useCallback(() => setDrawerOpen(prev => !prev), []);

    const value: CartContextValue = {
        order,
        totalQuantity: order?.totalQuantity ?? 0,
        drawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        addItem,
        adjustQuantity,
        removeLine,
        getVariantQuantity,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
