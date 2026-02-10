'use client';
import { Minus, Plus, ShoppingBag, Tag, Truck, X } from 'lucide-react';
import type { FC } from 'react';
import { cn } from '../../../lib/utils.js';
import { lineItemClasses } from './constants/styles.js';
import { OrderSummaryProps } from './types.js';

export const OrderSummary: FC<OrderSummaryProps> = ({
    order,
    currencyCode,
    showLineImages,
    showCoupons,
    compact,
    onGoNext,
    onAdjustQuantity,
    onRemoveLine,
    className,
    ref,
    selected,
}) => {
    const formatPrice = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(amount / 100);

    if (!order || order.lines.length === 0) {
        return (
            <div
                ref={ref}
                className={cn('flex flex-col items-center justify-center py-16 text-center', className)}
            >
                <ShoppingBag className="h-16 w-16 text-muted-foreground/40 mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
                <p className="text-sm text-muted-foreground">Add some items to get started.</p>
            </div>
        );
    }

    return (
        <div ref={ref} className={cn('space-y-6', className)}>
            {!compact && (
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Order Summary</h2>
                    <span className="text-sm text-muted-foreground">
                        {order.totalQuantity} {order.totalQuantity === 1 ? 'item' : 'items'}
                    </span>
                </div>
            )}

            {compact && (
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Order Summary
                </h3>
            )}

            <div className={cn('divide-y divide-border', compact && 'space-y-0')}>
                {order.lines.map(line => (
                    <div
                        key={line.id}
                        className={cn('flex items-start gap-4 py-4 first:pt-0 last:pb-0', compact && 'py-3')}
                    >
                        {showLineImages && line.featuredAsset && (
                            <img
                                src={line.featuredAsset.preview}
                                alt={line.productVariant.name}
                                className={compact ? lineItemClasses.imageCompact : lineItemClasses.image}
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <p className={cn('font-medium text-foreground truncate', compact && 'text-sm')}>
                                {line.productVariant.name}
                            </p>
                            {!compact && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    SKU: {line.productVariant.sku}
                                </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                                {onAdjustQuantity ? (
                                    <div className="flex items-center border border-border rounded-lg">
                                        <button
                                            onClick={() =>
                                                onAdjustQuantity(line.id, Math.max(0, line.quantity - 1))
                                            }
                                            className="p-1.5 hover:bg-muted/50 transition-colors"
                                        >
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="px-3 text-sm font-medium tabular-nums">
                                            {line.quantity}
                                        </span>
                                        <button
                                            onClick={() => onAdjustQuantity(line.id, line.quantity + 1)}
                                            className="p-1.5 hover:bg-muted/50 transition-colors"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <span className="text-sm text-muted-foreground">
                                        Qty: {line.quantity}
                                    </span>
                                )}
                                {onRemoveLine && (
                                    <button
                                        onClick={() => onRemoveLine(line.id)}
                                        className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <span
                            className={cn('font-semibold text-foreground tabular-nums', compact && 'text-sm')}
                        >
                            {formatPrice(line.linePriceWithTax)}
                        </span>
                    </div>
                ))}
            </div>

            {showCoupons && order.couponCodes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {order.couponCodes.map(code => (
                        <span
                            key={code}
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                        >
                            <Tag className="h-3 w-3" />
                            {code}
                        </span>
                    ))}
                </div>
            )}

            <div className={cn('space-y-3 pt-4 border-t border-border', compact && 'space-y-2 pt-3')}>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium tabular-nums">{formatPrice(order.subTotalWithTax)}</span>
                </div>

                {order.shippingWithTax > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                            <Truck className="h-3.5 w-3.5" />
                            Shipping
                        </span>
                        <span className="font-medium tabular-nums">{formatPrice(order.shippingWithTax)}</span>
                    </div>
                )}

                {order.discounts.map((discount, i) => (
                    <div key={i} className="flex justify-between text-sm">
                        <span className="text-green-600 dark:text-green-400">{discount.description}</span>
                        <span className="text-green-600 dark:text-green-400 font-medium tabular-nums">
                            -{formatPrice(Math.abs(discount.amountWithTax))}
                        </span>
                    </div>
                ))}

                <div className={cn('flex justify-between pt-3 border-t border-border', compact && 'pt-2')}>
                    <span className={cn('font-semibold text-foreground', !compact && 'text-lg')}>Total</span>
                    <span className={cn('font-bold text-foreground tabular-nums', !compact && 'text-lg')}>
                        {formatPrice(order.totalWithTax)}
                    </span>
                </div>
            </div>

            {!compact && onGoNext && (
                <button
                    type="button"
                    onClick={onGoNext}
                    className="w-full rounded-xl bg-primary/80 px-8 py-4 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary shadow-sm"
                >
                    Proceed to Checkout
                </button>
            )}
        </div>
    );
};
