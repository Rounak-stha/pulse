'use client';
import { CheckCircle2, Package, ShoppingBag } from 'lucide-react';
import type { FC } from 'react';
import { cn } from '../../../lib/utils.js';
import { ConfirmationProps } from './types.js';

export const Confirmation: FC<ConfirmationProps> = ({
    order,
    orderCode,
    currencyCode,
    ref,
    selected,
}) => {
    const formatPrice = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(
            amount / 100,
        );

    const code = orderCode ?? order?.code;

    return (
        <div
            ref={ref}
            className={cn(
                'flex flex-col items-center text-center max-w-lg mx-auto py-8',
                selected && 'ring-2 ring-ring',
            )}
        >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-6">
                Thank you for your purchase. Your order has been placed successfully.
            </p>

            {code && (
                <div className="mb-8 rounded-xl border border-border bg-muted/30 px-6 py-4 w-full">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Order Number
                    </p>
                    <p className="text-xl font-bold font-mono text-foreground tracking-wider">{code}</p>
                </div>
            )}

            {order && (
                <div className="w-full space-y-4 text-left">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Items Ordered
                    </h3>
                    <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                        {order.lines.map(line => (
                            <div key={line.id} className="flex items-center gap-3 px-4 py-3">
                                {line.featuredAsset && (
                                    <img
                                        src={line.featuredAsset.preview}
                                        alt={line.productVariant.name}
                                        className="h-10 w-10 rounded-lg object-cover border border-border"
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {line.productVariant.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Qty: {line.quantity}</p>
                                </div>
                                <span className="text-sm font-medium tabular-nums text-foreground">
                                    {formatPrice(line.linePriceWithTax)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="text-lg font-bold text-foreground tabular-nums">
                            {formatPrice(order.totalWithTax)}
                        </span>
                    </div>
                </div>
            )}

            <div className="mt-8">
                <a
                    href="/"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary/80 px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary shadow-sm"
                >
                    <ShoppingBag className="h-4 w-4" />
                    Continue Shopping
                </a>
            </div>
        </div>
    );
};
