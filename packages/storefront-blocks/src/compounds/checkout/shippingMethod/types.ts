import { ShippingMethodOption } from '../page/types.js';

export interface ShippingMethodProps {
    methods: ShippingMethodOption[];
    selectedMethodId?: string;
    currencyCode: string;
    onSubmit?: (shippingMethodId: string) => void;
    onGoBack?: () => void;
    isSubmitting?: boolean;
    error?: string;
    ref?: React.Ref<HTMLDivElement>;
    selected?: boolean;
}
