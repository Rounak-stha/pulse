import { CheckoutOrder } from '../page/types.js';

export interface ConfirmationProps {
    order: CheckoutOrder | null;
    orderCode?: string;
    currencyCode: string;
    ref?: React.Ref<HTMLDivElement>;
    selected?: boolean;
}
