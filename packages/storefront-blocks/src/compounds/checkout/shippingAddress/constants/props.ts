import { ShippingAddressProps } from '../types.js';

export const DefaultShippingAddressProps: ShippingAddressProps = {
    countries: [],
    value: {
        fullName: '',
        streetLine1: '',
        streetLine2: '',
        city: '',
        province: '',
        postalCode: '',
        countryCode: '',
        phoneNumber: '',
    },
    isSubmitting: false,
};
