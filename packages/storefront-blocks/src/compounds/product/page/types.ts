import { ReactNode } from 'react';

export type StockLevel = 'OUT_OF_STOCK' | 'LOW_STOCK' | 'IN_STOCK';

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    featuredAsset: {
        id: string;
        source: string;
        preview: string;
    } | null;
    assets: Array<{
        id: string;
        source: string;
        preview: string;
    }>;
    variants: Array<{
        id: string;
        name: string;
        sku: string;
        stockLevel: StockLevel;
        price: number;
        priceWithTax: number;
        currencyCode: string;
        featuredAsset: {
            id: string;
            source: string;
            preview: string;
        } | null;
        assets: Array<{
            id: string;
            source: string;
            preview: string;
        }>;
    }>;
}

export interface ProductPageBaseProps {
    layout: 'default' | 'wide' | 'sidebar';
    galleryPosition: 'left' | 'right';
    spacing: 'compact' | 'normal' | 'comfortable';
    backgroundColor: 'default' | 'muted' | 'accent';
    borderStyle: 'none' | 'subtle' | 'bold';
    contentAlignment: 'start' | 'center';
    stickyGallery: boolean;
    containerSize: 'default' | 'wide' | 'full';
    SlotFlexibleZone?: React.ReactNode;
    ProductGallerySlot?: ReactNode;
    ProductInfoSlot?: ReactNode;
    AddToCartSlot?: ReactNode;
    onAddToCart?: (variantId: string, quantity: number) => void;
    ref?: React.Ref<HTMLDivElement>;
    selected?: boolean;
}

export interface ProductPageRuntimeProps extends ProductPageBaseProps {
    product: Product;
}

export interface ProductPageBuilderProps extends ProductPageBaseProps {
    productId: string;
}
