import { Product } from "../page/types.js";

export interface ProductInfoProps {
    className?: string;
    product: Pick<Product, 'id' | 'name' | 'description'> & { sku: string };
    selectedVariant: Product['variants'][number];
    showSKU: boolean;
    showStock: boolean;
    priceSize: 'small' | 'medium' | 'large';
    ref?: React.Ref<HTMLDivElement>;
    selected?: boolean;
}
