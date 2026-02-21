'use client';

import { ApolloProvider } from '@/app/providers/apollo';
import { CartProvider, useCart } from '@/app/providers/cart';
import { CartDrawer } from '@vendure/storefront-blocks/compounds';
import type { CheckoutOrder } from '@vendure/storefront-blocks/types';
import { useRouter } from 'next/navigation';

export function ShopProviders({
    shopcode,
    children,
}: Readonly<{
    shopcode: string;
    children: React.ReactNode;
}>) {
    return (
        <ApolloProvider>
            <CartProvider shopcode={shopcode}>
                {children}
                <CartDrawerConnected shopcode={shopcode} />
            </CartProvider>
        </ApolloProvider>
    );
}

function CartDrawerConnected({ shopcode }: Readonly<{ shopcode: string }>) {
    const { order, drawerOpen, closeDrawer, adjustQuantity, removeLine } = useCart();
    const router = useRouter();

    const checkoutOrder: CheckoutOrder | null = order
        ? {
              id: order.id,
              code: order.code,
              state: order.state,
              currencyCode: order.currencyCode,
              totalQuantity: order.totalQuantity,
              subTotalWithTax: order.subTotalWithTax,
              shippingWithTax: order.shippingWithTax,
              totalWithTax: order.totalWithTax,
              couponCodes: order.couponCodes,
              lines: order.lines,
              shippingLines: order.shippingLines,
              discounts: order.discounts,
          }
        : null;

    return (
        <CartDrawer
            open={drawerOpen}
            onClose={closeDrawer}
            order={checkoutOrder}
            currencyCode={order?.currencyCode ?? 'NPR'}
            onAdjustQuantity={adjustQuantity}
            onRemoveLine={removeLine}
            onCheckout={() => {
                closeDrawer();
                router.push(`/checkout`);
            }}
            onContinueShopping={closeDrawer}
        />
    );
}
