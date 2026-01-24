import type { FC } from 'react';
import { cn } from '../../../lib/utils.js';
import {
    backgroundClasses,
    borderClasses,
    containerSizeClasses,
    contentAlignmentClasses,
    galleryColumnClasses,
    gapClasses,
    infoColumnClasses,
    layoutClasses,
    spacingClasses,
} from './constants/styles.js';
import { ProductPageRuntimeProps } from './types.js';

export const ProductPage: FC<ProductPageRuntimeProps> = ({
    ProductGallerySlot,
    ProductInfoSlot,
    AddToCartSlot,
    ref,
    selected,
    SlotFlexibleZone,
    layout,
    galleryPosition,
    spacing,
    backgroundColor,
    borderStyle,
    contentAlignment,
    stickyGallery,
    containerSize,
}) => {
    return (
        <div
            ref={ref}
            className={cn(
                'transition-all duration-200',
                containerSizeClasses[containerSize],
                'mx-auto',
                spacingClasses[spacing],
                selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
            )}
        >
            <div
                className={cn(
                    'grid',
                    layoutClasses[layout],
                    gapClasses[spacing],
                    'mb-12',
                    backgroundClasses[backgroundColor],
                    borderClasses[borderStyle],
                    borderStyle !== 'none' && spacingClasses[spacing],
                )}
            >
                {/* Gallery Section */}
                {ProductGallerySlot && (
                    <div
                        className={cn(
                            'w-full',
                            galleryColumnClasses(galleryPosition)[layout],
                            galleryPosition === 'right' && layout === 'default' && 'md:order-2',
                            stickyGallery && 'lg:sticky lg:top-4 lg:self-start',
                        )}
                    >
                        <div className="rounded-lg overflow-hidden">{ProductGallerySlot}</div>
                    </div>
                )}

                {/* Info Section */}
                <div
                    className={cn(
                        'flex flex-col',
                        contentAlignmentClasses[contentAlignment],
                        'space-y-6',
                        infoColumnClasses(galleryPosition)[layout],
                        galleryPosition === 'right' && layout === 'default' && 'md:order-1',
                    )}
                >
                    {/* Product Info */}
                    {ProductInfoSlot && <div className="w-full space-y-4">{ProductInfoSlot}</div>}

                    {/* Add to Cart */}
                    {AddToCartSlot && (
                        <div className="w-full pt-4 border-t border-border">{AddToCartSlot}</div>
                    )}
                </div>
            </div>

            {/* Flexible Zone */}
            {SlotFlexibleZone && <div className={cn('w-full', gapClasses[spacing])}>{SlotFlexibleZone}</div>}
        </div>
    );
};
