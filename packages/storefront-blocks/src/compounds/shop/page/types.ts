import { ReactNode } from 'react';

export interface ShopProduct {
    productId: string;
    productName: string;
    slug: string;
    description?: string;
    image?: { id: string; preview: string } | null;
    price: { type: 'single'; value: number } | { type: 'range'; min: number; max: number };
    currencyCode: string;
}

export interface FacetGroup {
    id: string;
    name: string;
    values: Array<{ id: string; name: string; count: number }>;
}

export interface ShopPageBaseProps {
    layout: 'sidebar-left' | 'sidebar-right' | 'top-filters';
    containerSize: 'default' | 'wide' | 'full';
    spacing: 'compact' | 'normal' | 'comfortable';
    sidebarWidth: 'narrow' | 'default' | 'wide';
    stickySidebar: boolean;
    showFilters: boolean;
    FiltersSlot?: ReactNode;
    ToolbarSlot?: ReactNode;
    ProductGridSlot?: ReactNode;
    PaginationSlot?: ReactNode;
    ref?: React.Ref<HTMLDivElement>;
    selected?: boolean;
}

export interface ShopPageRuntimeProps extends ShopPageBaseProps {
    totalItems: number;
}

export interface ShopPageBuilderProps extends ShopPageBaseProps {
    collectionSlug?: string;
}
