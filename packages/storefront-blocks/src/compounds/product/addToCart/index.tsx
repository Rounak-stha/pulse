'use client';
import { Check, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils.js';
import { useProductPreview } from '../context.js';
import { AddToCartProps } from './types.js';

import type { FC } from 'react';

export const AddToCart: FC<AddToCartProps> = ({
    className,
    variant: variantProp,
    onAddToCart,
    cartQuantity,
    onViewCart,
    maxQuantity = 10,
    showQuantitySelector = true,
    showWishlist = true,
    showCompare = false,
    buttonSize = 'large',
    ref,
}) => {
    const preview = useProductPreview();
    const variant = preview?.selectedVariant ?? variantProp;
    const [quantity, setQuantity] = useState(1);
    const [addedFeedback, setAddedFeedback] = useState(false);

    useEffect(() => {
        if (!addedFeedback) return;
        const timer = setTimeout(() => setAddedFeedback(false), 1500);
        return () => clearTimeout(timer);
    }, [addedFeedback]);

    useEffect(() => {
        setAddedFeedback(false);
    }, [variant?.id]);

    const handleAddToCart = () => {
        if (onAddToCart && variant) {
            onAddToCart(variant.id, quantity);
            setAddedFeedback(true);
        }
    };

    const inStock = variant?.stockLevel !== 'OUT_OF_STOCK';
    const inCart = (cartQuantity ?? 0) > 0;

    return (
        <div ref={ref} className={cn('space-y-4', className)}>
            {showQuantitySelector && inStock && (
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium">Quantity:</label>
                    <div className="flex items-center border rounded-lg">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-4 py-2 hover:bg-muted/10"
                        >
                            -
                        </button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={e =>
                                setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))
                            }
                            className="w-16 text-center border-x"
                            min="1"
                            max={maxQuantity}
                        />
                        <button
                            onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                            className="px-4 py-2 hover:bg-muted/10"
                        >
                            +
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={handleAddToCart}
                disabled={!inStock || addedFeedback}
                className={cn(
                    'w-full rounded-lg font-semibold transition-all duration-200',
                    buttonSize === 'small' && 'px-4 py-2 text-sm',
                    buttonSize === 'medium' && 'px-6 py-3 text-base',
                    buttonSize === 'large' && 'px-8 py-4 text-lg',
                    !inStock && 'bg-muted text-muted-foreground cursor-not-allowed',
                    inStock &&
                        addedFeedback &&
                        'bg-green-600 text-white cursor-not-allowed',
                    inStock &&
                        !addedFeedback &&
                        'bg-primary/80 text-white hover:bg-primary',
                )}
            >
                {!inStock && 'Out of Stock'}
                {inStock && addedFeedback && (
                    <span className="inline-flex items-center justify-center gap-2">
                        <Check className="h-5 w-5" />
                        Added!
                    </span>
                )}
                {inStock && !addedFeedback && (inCart ? 'Add More' : 'Add to Cart')}
            </button>

            {inStock && !addedFeedback && inCart && (
                <div className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Check className="h-4 w-4" />
                        {cartQuantity} in cart
                    </span>
                    {onViewCart && (
                        <button
                            onClick={onViewCart}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                        >
                            <ShoppingCart className="h-4 w-4" />
                            View Cart
                        </button>
                    )}
                </div>
            )}

            {(showWishlist || showCompare) && (
                <div className="flex gap-3">
                    {showWishlist && (
                        <button className="text-sm text-muted/70 hover:text-muted-foreground flex items-center gap-1">
                            <span>♥</span> Add to Wishlist
                        </button>
                    )}
                    {showCompare && (
                        <button className="text-sm text-muted/70 hover:text-muted-foreground">Compare</button>
                    )}
                </div>
            )}
        </div>
    );
};
