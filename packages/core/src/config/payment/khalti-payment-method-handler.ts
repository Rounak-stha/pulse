// khalti-payment.handler.ts
import { LanguageCode } from '@vendure/common/lib/generated-types';
import fetch from 'node-fetch';

import { CreatePaymentResult, PaymentMethodHandler } from './payment-method-handler';

const KHALTI_BASE_URL = 'https://dev.khalti.com/api/v2';

type KhaltiPaymentInitiateResponse = {
    pidx: string;
    payment_url: string;
};

type KhaltiPaymentLookupResponse = {
    pidx: string;
    total_amount: number;
    status: 'Completed' | 'Pending' | 'Initiated' | 'Refunded' | 'Expired' | 'User canceled';
    transaction_id: string;
    fee: number;
    refunded: boolean;
};

export const khaltiPaymentHandler = new PaymentMethodHandler({
    code: 'khalti',
    description: [{ languageCode: LanguageCode.en, value: 'Khalti Payment Method' }],

    args: {
        'Live Secret Key': { type: 'string', required: true },
        'Live Public Key': { type: 'string', required: true },
    },

    async createPayment(ctx, order, amount, args): Promise<CreatePaymentResult> {
        const shop = ctx.shop;
        try {
            const res = await fetch(`${KHALTI_BASE_URL}/epayment/initiate/`, {
                method: 'POST',
                headers: {
                    Authorization: `Key ${args['Live Secret Key']}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    return_url: `${shop.code}.tdata.app/order/confirm`,
                    website_url: `${shop.code}.tdata.app`,
                    amount,
                    purchase_order_id: order.code,
                    purchase_order_name: `Order ${order.code}`,
                }),
            });

            const data = (await res.json()) as KhaltiPaymentInitiateResponse;

            if (!data.pidx) {
                return { state: 'Declined', amount, metadata: data };
            }

            return {
                amount,
                state: 'Authorized',
                transactionId: data.pidx,
                metadata: {
                    paymentUrl: data.payment_url,
                },
            };
        } catch (e) {
            return {
                amount,
                state: 'Declined',
            };
        }
    },

    async settlePayment(ctx, order, payment, args, method) {
        const res = await fetch(`${KHALTI_BASE_URL}/epayment/lookup/`, {
            method: 'POST',
            headers: {
                Authorization: `Key ${args['Live Secret Key']}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pidx: payment.transactionId }),
        });

        const data = (await res.json()) as KhaltiPaymentLookupResponse;

        if (data.status === 'Completed') {
            return { success: true };
        }

        return {
            success: false,
        };
    },
});
