import { AddressInput } from '../page/types.js';

export interface ShippingAddressProps {
    countries: Array<{ code: string; name: string }>;
    value?: Partial<AddressInput>;
    onSubmit?: (address: AddressInput) => void;
    onGoBack?: () => void;
    isSubmitting?: boolean;
    error?: string;
    ref?: React.Ref<HTMLDivElement>;
    selected?: boolean;
}
