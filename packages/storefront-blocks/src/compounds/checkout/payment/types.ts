import { PaymentMethodOption } from '../page/types.js';

export interface PaymentSubmitData {
    methodCode: string;
    metadata?: Record<string, string>;
}

export interface PaymentProps {
    methods: PaymentMethodOption[];
    selectedMethodCode?: string;
    onSubmit?: (data: PaymentSubmitData) => void;
    onGoBack?: () => void;
    isSubmitting?: boolean;
    error?: string;
    ref?: React.Ref<HTMLDivElement>;
    selected?: boolean;
}
