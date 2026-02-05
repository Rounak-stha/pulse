import { Product } from '../page/types.js';

export interface AddToCartProps {
    className?: string;
    product: Product;
    variant: Product['variants'][number];
    onAddToCart?: (variantId: string, quantity: number) => void;
    showQuantitySelector: boolean;
    showWishlist: boolean;
    showCompare: boolean;
    buttonSize: 'small' | 'medium' | 'large';
    buttonStyle: 'solid' | 'outline' | 'ghost';
    ref?: React.Ref<HTMLDivElement>;
    selected?: boolean;
}
