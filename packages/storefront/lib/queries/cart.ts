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
};

type ErrorResult = {
    __typename: 'ErrorResult';
    errorCode: string;
    message: string;
};

type InsufficientStockError = {
    __typename: 'InsufficientStockError';
    quantityAvailable: number;
    order: ActiveOrder;
};

type AddItemToOrderResult = ActiveOrder | ErrorResult | InsufficientStockError;

type AddItemToOrderMutation = {
    addItemToOrder: AddItemToOrderResult;
};

type AddItemToOrderMutationVariables = {
    productVariantId: string;
    quantity: number;
};

const ACTIVE_ORDER_FRAGMENT = gql`
    fragment ActiveOrder on Order {
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
    }
`;

export const addItemToOrderMutation: TypedDocumentNode<
    AddItemToOrderMutation,
    AddItemToOrderMutationVariables
> = gql`
    mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!) {
        addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
            ... on Order {
                ...ActiveOrder
            }
            ... on ErrorResult {
                errorCode
                message
            }
            ... on InsufficientStockError {
                quantityAvailable
            }
        }
    }
    ${ACTIVE_ORDER_FRAGMENT}
`;

// Active Order Query
type ActiveOrderQuery = {
    activeOrder: ActiveOrder | null;
};

export const activeOrderQuery: TypedDocumentNode<ActiveOrderQuery> = gql`
    query ActiveOrder {
        activeOrder {
            ...ActiveOrder
        }
    }
    ${ACTIVE_ORDER_FRAGMENT}
`;

// Adjust Order Line
type AdjustOrderLineResult = ActiveOrder | ErrorResult;

type AdjustOrderLineMutation = {
    adjustOrderLine: AdjustOrderLineResult;
};

type AdjustOrderLineMutationVariables = {
    orderLineId: string;
    quantity: number;
};

export const adjustOrderLineMutation: TypedDocumentNode<
    AdjustOrderLineMutation,
    AdjustOrderLineMutationVariables
> = gql`
    mutation AdjustOrderLine($orderLineId: ID!, $quantity: Int!) {
        adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
            ... on Order {
                ...ActiveOrder
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${ACTIVE_ORDER_FRAGMENT}
`;

// Remove Order Line
type RemoveOrderLineResult = ActiveOrder | ErrorResult;

type RemoveOrderLineMutation = {
    removeOrderLine: RemoveOrderLineResult;
};

type RemoveOrderLineMutationVariables = {
    orderLineId: string;
};

export const removeOrderLineMutation: TypedDocumentNode<
    RemoveOrderLineMutation,
    RemoveOrderLineMutationVariables
> = gql`
    mutation RemoveOrderLine($orderLineId: ID!) {
        removeOrderLine(orderLineId: $orderLineId) {
            ... on Order {
                ...ActiveOrder
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${ACTIVE_ORDER_FRAGMENT}
`;
