import { VendureConfig, GoogleAuthPlugin } from '@vendure/core';

export const config: VendureConfig = {
    apiOptions: {
        port: 3000,
    },
    authOptions: {
        tokenMethod: 'bearer',
    },
    dbConnectionOptions: {
        type: 'postgres',
    },
    paymentOptions: {
        paymentMethodHandlers: [],
    },
    plugins: [GoogleAuthPlugin.init({ googleClientId: '', googleClientSecret: '' })],
};
