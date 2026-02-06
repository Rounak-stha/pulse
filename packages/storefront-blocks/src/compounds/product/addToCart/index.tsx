'use client';
import { useState } from 'react';
import { cn } from '../../../lib/utils.js';
import { useProductPreview } from '../context.js';
import { AddToCartProps } from './types.js';

import type { FC } from 'react';

export const AddToCart: FC<AddToCartProps> = ({
    className,
    variant: variantProp,
    onAddToCart,
    showQuantitySelector = true,
    showWishlist = true,
    showCompare = false,
    buttonSize = 'large',
    ref,
}) => {
    const preview = useProductPreview();
    const variant = preview?.selectedVariant ?? variantProp;
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        if (onAddToCart && variant) {
            onAddToCart(variant.id, quantity);
        }
    };

    const inStock = variant?.stockLevel !== 'OUT_OF_STOCK';
    const maxQty = 10;

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
                                setQuantity(Math.max(1, Math.min(maxQty, parseInt(e.target.value) || 1)))
                            }
                            className="w-16 text-center border-x"
                            min="1"
                            max={maxQty}
                        />
                        <button
                            onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                            className="px-4 py-2 hover:bg-muted/10"
                        >
                            +
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={cn(
                    'w-full rounded-lg font-semibold transition-colors',
                    buttonSize === 'small' && 'px-4 py-2 text-sm',
                    buttonSize === 'medium' && 'px-6 py-3 text-base',
                    buttonSize === 'large' && 'px-8 py-4 text-lg',
                    inStock
                        ? 'bg-primary/80 text-white hover:bg-primary'
                        : 'bg-muted text-muted-foreground cursor-not-allowed',
                )}
            >
                {inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>

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
