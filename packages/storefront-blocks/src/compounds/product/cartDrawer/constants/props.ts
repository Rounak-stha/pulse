import { CartDrawerProps } from '../types.js';

export const DefaultCartDrawerProps: Omit<CartDrawerProps, 'open' | 'onClose'> = {
    order: null,
    currencyCode: 'USD',
};
