import { CheckoutOrder } from '../page/types.js';

export interface OrderSummaryProps {
    order: CheckoutOrder | null;
    currencyCode: string;
    showLineImages: boolean;
    showCoupons: boolean;
    compact: boolean;
    onGoNext?: () => void;
    onAdjustQuantity?: (lineId: string, quantity: number) => void;
    onRemoveLine?: (lineId: string) => void;
    className?: string;
    ref?: React.Ref<HTMLDivElement>;
    selected?: boolean;
}
