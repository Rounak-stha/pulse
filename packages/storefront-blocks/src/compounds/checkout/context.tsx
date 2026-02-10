'use client';
import { createContext, useContext } from 'react';
import { CheckoutOrder, CheckoutStep } from './page/types.js';

export interface CheckoutPreviewData {
    order: CheckoutOrder | null;
    step: CheckoutStep;
}

const CheckoutPreviewContext = createContext<CheckoutPreviewData | null>(null);

export const CheckoutPreviewProvider = CheckoutPreviewContext.Provider;

export function useCheckoutPreview(): CheckoutPreviewData | null {
    return useContext(CheckoutPreviewContext);
}
