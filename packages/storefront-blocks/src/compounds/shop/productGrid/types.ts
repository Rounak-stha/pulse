import { ShopProduct } from '../page/types.js';

export interface ProductGridProps {
    products: ShopProduct[];
    view: 'grid' | 'list';
    columns: 2 | 3 | 4;
    gap: 'compact' | 'normal' | 'relaxed';
    cardStyle: 'standard' | 'minimal' | 'detailed';
    imageAspectRatio: '1:1' | '4:3' | '3:4';
    showDescription: boolean;
    showPrice: boolean;
    onProductClick?: (product: ShopProduct) => void;
    ref?: React.Ref<HTMLDivElement>;
    selected?: boolean;
}
