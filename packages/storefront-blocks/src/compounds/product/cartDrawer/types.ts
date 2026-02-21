import { CheckoutOrder } from '../../checkout/page/types.js';

export interface CartDrawerProps {
    open: boolean;
    onClose: () => void;
    order: CheckoutOrder | null;
    currencyCode: string;
    maxQuantity?: number;
    onAdjustQuantity?: (lineId: string, quantity: number) => void;
    onRemoveLine?: (lineId: string) => void;
    onCheckout?: () => void;
    onContinueShopping?: () => void;
    ref?: React.Ref<HTMLDivElement>;
}
