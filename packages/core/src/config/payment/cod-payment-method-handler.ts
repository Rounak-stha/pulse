import { LanguageCode } from '@vendure/common/lib/generated-types';

import { PaymentMethodHandler } from './payment-method-handler';

/**
 * @description
 * A payment method handler for Cash on Delivery (COD). This handler immediately
 * settles the payment since no online transaction is needed — the customer pays
 * upon delivery.
 *
 * This handler is included as a default so that shops have a working payment
 * method out of the box. It can be disabled via the Admin UI if other payment
 * methods are configured.
 *
 * @docsCategory payment
 */
export const codPaymentHandler = new PaymentMethodHandler({
    code: 'cash-on-delivery',
    description: [
        {
            languageCode: LanguageCode.en,
            value: 'Cash on Delivery',
        },
    ],
    args: {},
    createPayment: async (ctx, order, amount) => {
        return {
            amount,
            state: 'Settled' as const,
            metadata: {
                public: {
                    method: 'cash-on-delivery',
                },
            },
        };
    },
    settlePayment: async () => {
        return { success: true };
    },
});
