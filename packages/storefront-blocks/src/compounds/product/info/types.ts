import { Product } from '../page/types.js';

export interface ProductInfoProps {
    className?: string;
    product: Product;
    selectedVariant: Product['variants'][number];
    showSKU: boolean;
    showStock: boolean;
    priceSize: 'small' | 'medium' | 'large';
    ref?: React.Ref<HTMLDivElement>;
    onVariantChange?: (variant: Product['variants'][number]) => void;
    selected?: boolean;
}
