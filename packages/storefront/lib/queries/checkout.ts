import { gql, TypedDocumentNode } from '@apollo/client';

type ActiveOrder = {
    __typename: 'Order';
    id: string;
    code: string;
    couponCodes: string[];
    state: string;
    currencyCode: string;
    totalQuantity: number;
    subTotalWithTax: number;
    shippingWithTax: number;
    totalWithTax: number;
    discounts: {
        description: string;
        amountWithTax: number;
    }[];
    lines: {
        id: string;
        unitPriceWithTax: number;
        quantity: number;
        linePriceWithTax: number;
        productVariant: {
            id: string;
            name: string;
            sku: string;
        };
        featuredAsset: {
            id: string;
            preview: string;
        } | null;
    }[];
    shippingLines: {
        shippingMethod: {
            description: string;
        };
        priceWithTax: number;
    }[];
    customer: {
        firstName: string;
        lastName: string;
        emailAddress: string;
        phoneNumber: string;
        title: string;
    } | null;
    shippingAddress: {
        fullName: string;
        company: string;
        city: string;
        province: string;
        postalCode: string;
        phoneNumber: string;
        country: string;
        streetLine1: string;
        streetLine2?: string;
    } | null;
};

const CHECKOUT_ORDER_FRAGMENT = gql`
    fragment CheckoutOrder on Order {
        __typename
        id
        code
        couponCodes
        state
        currencyCode
        totalQuantity
        subTotalWithTax
        shippingWithTax
        totalWithTax
        discounts {
            description
            amountWithTax
        }
        lines {
            id
            unitPriceWithTax
            quantity
            linePriceWithTax
            productVariant {
                id
                name
                sku
            }
            featuredAsset {
                id
                preview
            }
        }
        shippingLines {
            shippingMethod {
                description
            }
            priceWithTax
        }
        customer {
            firstName
            lastName
            emailAddress
            phoneNumber
            title
        }

        shippingAddress {
            fullName
            company
            city
            province
            postalCode
            phoneNumber
            country
            streetLine1
            streetLine2
        }
    }
`;

type ActiveOrderQuery = {
    activeOrder: ActiveOrder | null;
};

export const activeOrderQuery: TypedDocumentNode<ActiveOrderQuery> = gql`
    query ActiveOrder {
        activeOrder {
            ...CheckoutOrder
        }
    }
    ${CHECKOUT_ORDER_FRAGMENT}
`;

type SetCustomerForOrderMutation = {
    setCustomerForOrder:
        | ActiveOrder
        | { __typename: 'AlreadyLoggedInError'; errorCode: string; message: string }
        | { __typename: 'EmailAddressConflictError'; errorCode: string; message: string }
        | { __typename: 'GuestCheckoutError'; errorCode: string; message: string }
        | { __typename: 'NoActiveOrderError'; errorCode: string; message: string };
};

type SetCustomerForOrderVariables = {
    input: {
        emailAddress: string;
        firstName?: string;
        lastName?: string;
    };
};

export const setCustomerForOrderMutation: TypedDocumentNode<
    SetCustomerForOrderMutation,
    SetCustomerForOrderVariables
> = gql`
    mutation SetCustomerForOrder($input: CreateCustomerInput!) {
        setCustomerForOrder(input: $input) {
            ... on Order {
                ...CheckoutOrder
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${CHECKOUT_ORDER_FRAGMENT}
`;

type SetOrderShippingAddressMutation = {
    setOrderShippingAddress:
        | ActiveOrder
        | { __typename: 'NoActiveOrderError'; errorCode: string; message: string };
};

type SetOrderShippingAddressVariables = {
    input: {
        fullName?: string;
        company?: string;
        streetLine1: string;
        streetLine2?: string;
        city?: string;
        province?: string;
        postalCode?: string;
        countryCode: string;
        phoneNumber?: string;
    };
};

export const setOrderShippingAddressMutation: TypedDocumentNode<
    SetOrderShippingAddressMutation,
    SetOrderShippingAddressVariables
> = gql`
    mutation SetOrderShippingAddress($input: CreateAddressInput!) {
        setOrderShippingAddress(input: $input) {
            ... on Order {
                ...CheckoutOrder
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${CHECKOUT_ORDER_FRAGMENT}
`;

type ShippingMethodQuote = {
    id: string;
    name: string;
    description: string;
    price: number;
    priceWithTax: number;
    metadata: Record<string, unknown> | null;
};

type EligibleShippingMethodsQuery = {
    eligibleShippingMethods: ShippingMethodQuote[];
};

export const eligibleShippingMethodsQuery: TypedDocumentNode<EligibleShippingMethodsQuery> = gql`
    query EligibleShippingMethods {
        eligibleShippingMethods {
            id
            name
            description
            price
            priceWithTax
            metadata
        }
    }
`;

type PaymentMethodQuote = {
    id: string;
    name: string;
    description: string;
    code: string;
};

type EligiblePaymentMethodsQuery = {
    eligiblePaymentMethods: PaymentMethodQuote[];
};

export const eligiblePaymentMethodsQuery: TypedDocumentNode<EligiblePaymentMethodsQuery> = gql`
    query EligiblePaymentMethods {
        eligiblePaymentMethods {
            id
            name
            description
            code
        }
    }
`;

type SetOrderShippingMethodMutation = {
    setOrderShippingMethod:
        | ActiveOrder
        | { __typename: 'IneligibleShippingMethodError'; errorCode: string; message: string }
        | { __typename: 'NoActiveOrderError'; errorCode: string; message: string }
        | { __typename: 'OrderModificationError'; errorCode: string; message: string };
};

type SetOrderShippingMethodVariables = {
    shippingMethodId: string[];
};

export const setOrderShippingMethodMutation: TypedDocumentNode<
    SetOrderShippingMethodMutation,
    SetOrderShippingMethodVariables
> = gql`
    mutation SetOrderShippingMethod($shippingMethodId: [ID!]!) {
        setOrderShippingMethod(shippingMethodId: $shippingMethodId) {
            ... on Order {
                ...CheckoutOrder
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${CHECKOUT_ORDER_FRAGMENT}
`;

type OrderPayment = {
    id: string;
    state: string;
    metadata: Record<string, unknown> | null;
};

type ActiveOrderWithPayments = ActiveOrder & {
    payments: OrderPayment[];
};

type AddPaymentToOrderMutation = {
    addPaymentToOrder:
        | ActiveOrderWithPayments
        | { __typename: 'IneligiblePaymentMethodError'; errorCode: string; message: string }
        | { __typename: 'NoActiveOrderError'; errorCode: string; message: string }
        | { __typename: 'OrderPaymentStateError'; errorCode: string; message: string }
        | { __typename: 'OrderStateTransitionError'; errorCode: string; message: string }
        | { __typename: 'PaymentDeclinedError'; errorCode: string; message: string }
        | { __typename: 'PaymentFailedError'; errorCode: string; message: string };
};

type AddPaymentToOrderVariables = {
    input: {
        method: string;
        metadata?: Record<string, string>;
    };
};

export const addPaymentToOrderMutation: TypedDocumentNode<
    AddPaymentToOrderMutation,
    AddPaymentToOrderVariables
> = gql`
    mutation AddPaymentToOrder($input: PaymentInput!) {
        addPaymentToOrder(input: $input) {
            ... on Order {
                ...CheckoutOrder
                payments {
                    id
                    state
                    metadata
                }
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${CHECKOUT_ORDER_FRAGMENT}
`;

type TransitionOrderToStateMutation = {
    transitionOrderToState:
        | ActiveOrder
        | { __typename: 'OrderStateTransitionError'; errorCode: string; message: string };
};

type TransitionOrderToStateVariables = {
    state: string;
};

export const transitionOrderToStateMutation: TypedDocumentNode<
    TransitionOrderToStateMutation,
    TransitionOrderToStateVariables
> = gql`
    mutation TransitionOrderToState($state: String!) {
        transitionOrderToState(state: $state) {
            ... on Order {
                ...CheckoutOrder
            }
            ... on OrderStateTransitionError {
                errorCode
                message
            }
        }
    }
    ${CHECKOUT_ORDER_FRAGMENT}
`;

type Country = {
    code: string;
    name: string;
};

type AvailableCountriesQuery = {
    availableCountries: Country[];
};

export const availableCountriesQuery: TypedDocumentNode<AvailableCountriesQuery> = gql`
    query AvailableCountries {
        availableCountries {
            code
            name
        }
    }
`;

type OrderByCodeQuery = {
    orderByCode: (ActiveOrder & { payments: OrderPayment[] }) | null;
};

type OrderByCodeVariables = {
    code: string;
};

export const orderByCodeQuery: TypedDocumentNode<OrderByCodeQuery, OrderByCodeVariables> = gql`
    query OrderByCode($code: String!) {
        orderByCode(code: $code) {
            ...CheckoutOrder
            payments {
                id
                state
                metadata
            }
        }
    }
    ${CHECKOUT_ORDER_FRAGMENT}
`;
