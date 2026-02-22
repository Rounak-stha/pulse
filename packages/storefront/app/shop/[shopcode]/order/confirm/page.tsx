import { getClient } from '@/lib/apollo-client-server';
import { orderByCodeQuery } from '@/lib/queries/checkout';
import { Confirmation } from '@vendure/storefront-blocks/compounds';
import type { CheckoutOrder } from '@vendure/storefront-blocks/types';
import { AlertTriangle, XCircle } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Order Confirmation',
    robots: { index: false, follow: false },
};

interface OrderConfirmPageProps {
    params: Promise<{ shopcode: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getParam(value: string | string[] | undefined): string | undefined {
    if (Array.isArray(value)) return value[0];
    return value;
}

export default async function OrderConfirmPage(props: OrderConfirmPageProps) {
    return (
        <Suspense>
            <OrderData {...props} />
        </Suspense>
    );
}

async function OrderData({ params, searchParams }: OrderConfirmPageProps) {
    const { shopcode } = await params;
    const query = await searchParams;

    const orderCode = getParam(query.code) ?? getParam(query.purchase_order_id);
    const status = getParam(query.status);

    if (!orderCode) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <XCircle className="h-12 w-12 text-destructive mb-4" />
                <h1 className="text-2xl font-bold text-foreground mb-2">Invalid Payment Callback</h1>
                <p className="text-muted-foreground mb-6">
                    No order information was found in the payment response.
                </p>
                <Link
                    href={`/shop/${shopcode}/checkout`}
                    className="inline-flex items-center rounded-xl bg-primary/80 px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary shadow-sm"
                >
                    Return to Checkout
                </Link>
            </div>
        );
    }

    if (status === 'User canceled') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <XCircle className="h-12 w-12 text-destructive mb-4" />
                <h1 className="text-2xl font-bold text-foreground mb-2">Payment Cancelled</h1>
                <p className="text-muted-foreground mb-6">
                    Your payment was cancelled. Your order has not been placed.
                </p>
                <Link
                    href={`/shop/${shopcode}/checkout`}
                    className="inline-flex items-center rounded-xl bg-primary/80 px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary shadow-sm"
                >
                    Return to Checkout
                </Link>
            </div>
        );
    }

    if (status === 'Expired' || status === 'Failed') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <h1 className="text-2xl font-bold text-foreground mb-2">Payment {status}</h1>
                <p className="text-muted-foreground mb-6">
                    Your payment could not be processed. Please try again.
                </p>
                <Link
                    href={`/shop/${shopcode}/checkout`}
                    className="inline-flex items-center rounded-xl bg-primary/80 px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary shadow-sm"
                >
                    Retry Checkout
                </Link>
            </div>
        );
    }

    const client = getClient();
    const { data } = await client.query({
        query: orderByCodeQuery,
        variables: { code: orderCode },
        context: { headers: { shopcode } },
    });

    const fetchedOrder = data?.orderByCode;
    const order: CheckoutOrder | null = fetchedOrder
        ? {
              id: fetchedOrder.id,
              code: fetchedOrder.code,
              state: fetchedOrder.state,
              currencyCode: fetchedOrder.currencyCode,
              totalQuantity: fetchedOrder.totalQuantity,
              subTotalWithTax: fetchedOrder.subTotalWithTax,
              shippingWithTax: fetchedOrder.shippingWithTax,
              totalWithTax: fetchedOrder.totalWithTax,
              couponCodes: fetchedOrder.couponCodes,
              lines: fetchedOrder.lines,
              shippingLines: fetchedOrder.shippingLines,
              discounts: fetchedOrder.discounts,
          }
        : null;

    return (
        <div className="container mx-auto max-w-2xl py-12 px-4">
            <Confirmation order={order} orderCode={orderCode} currencyCode={order?.currencyCode ?? 'USD'} />
        </div>
    );
}
