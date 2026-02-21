'use client';
import { Minus, Plus, ShoppingBag, ShoppingCart, X } from 'lucide-react';
import type { FC } from 'react';
import { cn } from '../../../lib/utils.js';
import { CartDrawerProps } from './types.js';

export const CartDrawer: FC<CartDrawerProps> = ({
    open,
    onClose,
    order,
    currencyCode,
    maxQuantity = 10,
    onAdjustQuantity,
    onRemoveLine,
    onCheckout,
    onContinueShopping,
    ref,
}) => {
    const formatPrice = (amount: number) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
        }).format(amount);

    const hasItems = order && order.lines.length > 0;

    return (
        <>
            {/* Backdrop overlay */}
            <div
                className={cn(
                    'fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
                    open ? 'opacity-100' : 'opacity-0 pointer-events-none',
                )}
                onClick={onClose}
            />

            {/* Drawer panel */}
            <div
                ref={ref}
                className={cn(
                    'fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background shadow-xl transition-transform duration-300 ease-out',
                    open ? 'translate-x-0' : 'translate-x-full',
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-foreground" />
                        <h2 className="text-lg font-semibold text-foreground">Cart</h2>
                        {order && order.totalQuantity > 0 && (
                            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-medium text-primary">
                                {order.totalQuantity}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                    {!hasItems ? (
                        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                            <ShoppingBag className="h-16 w-16 text-muted-foreground/40 mb-4" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h3>
                            <p className="text-sm text-muted-foreground mb-6">Browse products to add items</p>
                            {onContinueShopping && (
                                <button
                                    onClick={onContinueShopping}
                                    className="rounded-lg bg-primary/80 px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary"
                                >
                                    Continue Shopping
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-border px-6">
                            {order.lines.map(line => (
                                <div
                                    key={line.id}
                                    className="group flex items-start gap-4 py-4 transition-colors"
                                >
                                    {line.featuredAsset && (
                                        <img
                                            src={line.featuredAsset.preview}
                                            alt={line.productVariant.name}
                                            className="h-16 w-16 rounded-lg object-cover"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-foreground truncate">
                                            {line.productVariant.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-0.5">
                                            {formatPrice(line.unitPriceWithTax)}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            {onAdjustQuantity ? (
                                                <div className="flex items-center border border-border rounded-lg">
                                                    <button
                                                        onClick={() =>
                                                            onAdjustQuantity(
                                                                line.id,
                                                                Math.max(0, line.quantity - 1),
                                                            )
                                                        }
                                                        className="p-1.5 hover:bg-muted/50 transition-colors"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="px-3 text-sm font-medium tabular-nums">
                                                        {line.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            onAdjustQuantity(line.id, line.quantity + 1)
                                                        }
                                                        disabled={line.quantity >= maxQuantity}
                                                        className="p-1.5 hover:bg-muted/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
                                                    className="p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <span className="font-semibold text-foreground tabular-nums">
                                        {formatPrice(line.linePriceWithTax)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {hasItems && (
                    <div className="border-t border-border bg-background px-6 py-4 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-medium tabular-nums">
                                {formatPrice(order.subTotalWithTax)}
                            </span>
                        </div>

                        {order.shippingWithTax > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="font-medium tabular-nums">
                                    {formatPrice(order.shippingWithTax)}
                                </span>
                            </div>
                        )}

                        {order.discounts.map((discount, i) => (
                            <div key={i} className="flex justify-between text-sm">
                                <span className="text-green-600 dark:text-green-400">
                                    {discount.description}
                                </span>
                                <span className="text-green-600 dark:text-green-400 font-medium tabular-nums">
                                    -{formatPrice(Math.abs(discount.amountWithTax))}
                                </span>
                            </div>
                        ))}

                        <div className="flex justify-between pt-3 border-t border-border">
                            <span className="text-lg font-semibold text-foreground">Total</span>
                            <span className="text-lg font-bold text-foreground tabular-nums">
                                {formatPrice(order.totalWithTax)}
                            </span>
                        </div>

                        {onCheckout && (
                            <button
                                onClick={onCheckout}
                                className="w-full rounded-lg bg-primary/80 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-primary"
                            >
                                Checkout
                            </button>
                        )}

                        <div className="text-center">
                            <button
                                onClick={onContinueShopping ?? onClose}
                                className="text-sm text-muted-foreground underline hover:text-foreground transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
