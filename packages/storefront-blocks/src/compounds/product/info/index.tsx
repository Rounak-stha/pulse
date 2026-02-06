'use client';
import { CheckCircle2, ChevronDown, ChevronUp, Package, XCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../../lib/utils.js';
import { useProductPreview } from '../context.js';
import { ProductInfoProps } from './types.js';

const DESCRIPTION_MAX_HEIGHT = 100;

export const ProductInfo: React.FC<ProductInfoProps> = ({
    className,
    product: productProp,
    selectedVariant: selectedVariantProp,
    showSKU = true,
    showStock = true,
    priceSize = 'large',
    onVariantChange,
    ref,
}) => {
    const preview = useProductPreview();
    const product = preview?.product ?? productProp;
    const selectedVariant = preview?.selectedVariant ?? selectedVariantProp;
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const inStock = selectedVariant.stockLevel !== 'OUT_OF_STOCK';
    const hasMultipleVariants = product.variants.length > 1;

    const formatPrice = (price: number, currencyCode: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
        }).format(price);
    };

    console.log({ product });
    return (
        <div ref={ref} className={cn('space-y-6', className)}>
            <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">{product.name}</h1>

            <div className="h-px bg-border" />

            <div className="space-y-2">
                <div
                    className={cn(
                        'font-bold text-foreground',
                        priceSize === 'small' && 'text-2xl',
                        priceSize === 'medium' && 'text-3xl',
                        priceSize === 'large' && 'text-4xl lg:text-5xl',
                    )}
                >
                    {formatPrice(selectedVariant.price, selectedVariant.currencyCode)}
                </div>
            </div>

            {/* Stock Status & SKU */}
            <div className="flex flex-wrap items-center gap-3">
                {showStock && (
                    <div
                        className={cn(
                            'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                            inStock
                                ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400'
                                : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400',
                        )}
                    >
                        {inStock ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        <span>{inStock ? 'In Stock' : 'Out of Stock'}</span>
                        {inStock && selectedVariant.stockLevel && (
                            <span className="opacity-75">• {selectedVariant.stockLevel} available</span>
                        )}
                    </div>
                )}

                {showSKU && selectedVariant.sku && (
                    <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2 text-sm">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">SKU:</span>
                        <span className="font-mono font-medium text-foreground">{selectedVariant.sku}</span>
                    </div>
                )}
            </div>

            {product.description && (
                <>
                    <div className="h-px bg-border" />
                    <div className="space-y-3">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Description
                        </h2>
                        <div className="relative">
                            <div
                                className={cn(
                                    'overflow-hidden transition-all duration-300',
                                    !isDescriptionExpanded && 'max-h-[100px]',
                                )}
                                style={
                                    isDescriptionExpanded
                                        ? { maxHeight: 'none' }
                                        : { maxHeight: DESCRIPTION_MAX_HEIGHT }
                                }
                            >
                                <p
                                    className="text-sm leading-relaxed text-foreground/90"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            </div>
                            {!isDescriptionExpanded && (
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent" />
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsDescriptionExpanded(prev => !prev)}
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                            {isDescriptionExpanded ? (
                                <>
                                    Show less <ChevronUp className="h-4 w-4" />
                                </>
                            ) : (
                                <>
                                    Read more <ChevronDown className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </div>
                </>
            )}

            {hasMultipleVariants && (
                <>
                    <div className="h-px bg-border" />
                    <div className="space-y-3">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Variant
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {product.variants.map(variant => {
                                const isSelected = variant.id === selectedVariant.id;
                                const isOutOfStock = variant.stockLevel === 'OUT_OF_STOCK';
                                return (
                                    <button
                                        key={variant.id}
                                        type="button"
                                        disabled={isOutOfStock}
                                        onClick={() => onVariantChange?.(variant)}
                                        className={cn(
                                            'rounded-lg border px-4 py-2 text-sm font-medium transition-all',
                                            isSelected
                                                ? 'border-secondary bg-secondary text-secondary-foreground shadow-sm'
                                                : 'border-border bg-background text-foreground hover:border-primary hover:bg-muted',
                                            isOutOfStock && 'cursor-not-allowed opacity-50 line-through',
                                        )}
                                    >
                                        {variant.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
