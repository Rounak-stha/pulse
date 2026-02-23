/* eslint-disable no-console */
import { AssetServerPlugin, configureS3AssetStorage } from '@vendure/asset-server-plugin';
import { ADMIN_API_PATH, API_PORT, SHOP_API_PATH } from '@vendure/common/lib/shared-constants';
import type { DataSourceOptions } from '@vendure/core';
import {
    DefaultLogger,
    DefaultSearchPlugin,
    GoogleAuthPlugin,
    StorefrontCachePlugin,
    codPaymentHandler,
    khaltiPaymentHandler,
    LogLevel,
    SettingsStoreScopes,
    SyncPagesPlugin,
    VendureConfig,
} from '@vendure/core';
import { DashboardPlugin } from '@vendure/dashboard/plugin';
import 'dotenv/config';
import path from 'path';

function getRequiredEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

/**
 * Config settings used during development
 */
export const config: VendureConfig = {
    apiOptions: {
        port: API_PORT,
        adminApiPath: ADMIN_API_PATH,
        adminApiPlayground: {
            settings: {
                'request.credentials': 'include',
            },
        },
        adminApiDebug: true,
        shopApiPath: SHOP_API_PATH,
        shopApiPlayground: {
            settings: {
                'request.credentials': 'include',
            },
        },
        shopApiDebug: true,
    },
    authOptions: {
        disableAuth: false,
        tokenMethod: ['bearer', 'cookie'] as const,
        requireVerification: true,
        customPermissions: [],
        cookieOptions: {
            secret: 'abc',
        },
    },
    dbConnectionOptions: {
        logging: false,
        synchronize: true,
        migrations: [path.join(__dirname, 'migrations/*.ts')],
        ...getDbConfig(),
    },
    paymentOptions: {
        paymentMethodHandlers: [codPaymentHandler, khaltiPaymentHandler],
    },
    settingsStoreFields: {
        MyPlugin: [
            {
                name: 'globalVal',
            },
            {
                name: 'userVal',
                scope: SettingsStoreScopes.user,
            },
        ],
    },
    customFields: {},
    logger: new DefaultLogger({ level: LogLevel.Verbose }),
    importExportOptions: {
        importAssetsDir: path.join(__dirname, 'import-assets'),
    },
    plugins: [
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, 'assets'),
            storageStrategyFactory: configureS3AssetStorage({
                bucket: getRequiredEnv('BUCKET_NAME'),
                credentials: {
                    accessKeyId: getRequiredEnv('BUCKET_ACCESS_KEY_ID'),
                    secretAccessKey: getRequiredEnv('BUCKET_SECRET_ACCESS_KEY'),
                },
                nativeS3Configuration: {
                    endpoint: getRequiredEnv('BUCKET_S3_URL'),
                    forcePathStyle: true,
                    signatureVersion: 'v4',
                    region: 'auto',
                },
            }),
        }),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: false }),
        DashboardPlugin.init({
            route: 'dashboard',
            appDir: path.join(__dirname, '..', '..', 'dashboard', 'build'),
        }),
        GoogleAuthPlugin.init({
            googleClientId: getRequiredEnv('GOOGLE_CLIENT_ID'),
            googleClientSecret: getRequiredEnv('GOOGLE_CLIENT_SECRET'),
        }),
        SyncPagesPlugin,
        StorefrontCachePlugin.init(),
    ],
};

function getDbConfig(): DataSourceOptions {
    return {
        type: 'postgres',
        host: getRequiredEnv('DB_HOST'),
        port: Number(getRequiredEnv('DB_PORT')),
        username: getRequiredEnv('DB_USERNAME'),
        password: getRequiredEnv('DB_PASSWORD'),
        database: getRequiredEnv('DB_NAME'),
        schema: getRequiredEnv('DB_SCHEMA'),
        extra: {
            socketPath: getRequiredEnv('DB_HOST'),
        },
    };
}
