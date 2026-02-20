'use client';
import type { FC } from 'react';
import { cn } from '../../../lib/utils.js';
import { useShopPreview } from '../context.js';
import { ShopProduct } from '../page/types.js';
import { ProductGridProps } from './types.js';

const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

const gapClasses = {
    compact: 'gap-3',
    normal: 'gap-5',
    relaxed: 'gap-8',
};

const aspectRatioClasses = {
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '3:4': 'aspect-[3/4]',
};

function formatPrice(product: ShopProduct): string {
    const fmt = (value: number) =>
        new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: product.currencyCode,
        }).format(value / 100);

    if (product.price.type === 'single') {
        return fmt(product.price.value);
    }
    return `${fmt(product.price.min)} – ${fmt(product.price.max)}`;
}

export const ProductGrid: FC<ProductGridProps> = ({
    products: productsProp,
    view,
    columns,
    gap,
    cardStyle,
    imageAspectRatio,
    showDescription,
    showPrice,
    onProductClick,
    ref,
    selected,
}) => {
    const preview = useShopPreview();
    const products = preview?.products ?? productsProp;

    if (products.length === 0) {
        return (
            <div
                ref={ref}
                className={cn(
                    'flex items-center justify-center py-16 text-muted-foreground',
                    selected && 'ring-2 ring-ring',
                )}
            >
                <p>No products found</p>
            </div>
        );
    }

    if (view === 'list') {
        return (
            <div ref={ref} className={cn('flex flex-col', gapClasses[gap], selected && 'ring-2 ring-ring')}>
                {products.map(product => (
                    <a
                        key={product.productId}
                        href={`/products/${product.productId}`}
                        onClick={e => {
                            if (onProductClick) {
                                e.preventDefault();
                                onProductClick(product);
                            }
                        }}
                        className={cn(
                            'flex gap-4 rounded-lg transition-colors hover:bg-muted/50',
                            cardStyle === 'standard' && 'border border-border shadow-sm p-3',
                            cardStyle === 'minimal' && 'p-3',
                            cardStyle === 'detailed' && 'border border-border shadow-sm p-4',
                        )}
                    >
                        <div
                            className={cn(
                                'flex-shrink-0 w-32 rounded-md overflow-hidden bg-muted',
                                aspectRatioClasses[imageAspectRatio],
                            )}
                        >
                            {product.image?.preview ? (
                                <img
                                    src={product.image.preview}
                                    alt={product.productName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                    No image
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                            <h3 className="font-medium text-foreground truncate">{product.productName}</h3>
                            {showDescription && product.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {product.description}
                                </p>
                            )}
                            {showPrice && (
                                <p className="text-sm font-semibold text-foreground mt-1">
                                    {formatPrice(product)}
                                </p>
                            )}
                        </div>
                    </a>
                ))}
            </div>
        );
    }

    return (
        <div
            ref={ref}
            className={cn('grid', columnClasses[columns], gapClasses[gap], selected && 'ring-2 ring-ring')}
        >
            {products.map(product => (
                <a
                    key={product.productId}
                    href={`/products/${product.productId}`}
                    onClick={e => {
                        if (onProductClick) {
                            e.preventDefault();
                            onProductClick(product);
                        }
                    }}
                    className={cn(
                        'group flex flex-col rounded-lg overflow-hidden transition-all duration-200',
                        cardStyle === 'standard' && 'border border-border shadow-sm hover:shadow-md',
                        cardStyle === 'minimal' && 'hover:bg-muted/50',
                        cardStyle === 'detailed' && 'border border-border shadow-sm hover:shadow-md',
                    )}
                >
                    <div
                        className={cn(
                            'w-full overflow-hidden bg-muted',
                            aspectRatioClasses[imageAspectRatio],
                        )}
                    >
                        {product.image?.preview ? (
                            <img
                                src={product.image.preview}
                                alt={product.productName}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                                No image
                            </div>
                        )}
                    </div>
                    <div className={cn('flex flex-col', cardStyle === 'minimal' ? 'pt-3' : 'p-4')}>
                        <h3 className="font-medium text-foreground truncate">{product.productName}</h3>
                        {showDescription && cardStyle === 'detailed' && product.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {product.description}
                            </p>
                        )}
                        {showPrice && (
                            <p className="text-sm font-semibold text-foreground mt-1">
                                {formatPrice(product)}
                            </p>
                        )}
                    </div>
                </a>
            ))}
        </div>
    );
};
