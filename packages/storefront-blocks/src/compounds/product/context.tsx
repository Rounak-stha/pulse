'use client';
import { createContext, useContext } from 'react';
import { Product } from './page/types.js';

export interface ProductPreviewData {
    product: Product;
    selectedVariant: Product['variants'][number];
    images: Array<{ id: string; source: string; preview: string }>;
}

const ProductPreviewContext = createContext<ProductPreviewData | null>(null);

export const ProductPreviewProvider = ProductPreviewContext.Provider;

export function useProductPreview(): ProductPreviewData | null {
    return useContext(ProductPreviewContext);
}
