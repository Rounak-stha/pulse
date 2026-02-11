'use client';
import { createContext, useContext } from 'react';
import { FacetGroup, ShopProduct } from './page/types.js';

export interface ShopPreviewData {
    products: ShopProduct[];
    facetGroups: FacetGroup[];
    totalItems: number;
}

const ShopPreviewContext = createContext<ShopPreviewData | null>(null);

export const ShopPreviewProvider = ShopPreviewContext.Provider;

export function useShopPreview(): ShopPreviewData | null {
    return useContext(ShopPreviewContext);
}
