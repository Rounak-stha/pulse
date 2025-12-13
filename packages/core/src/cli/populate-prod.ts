import { INestApplicationContext } from '@nestjs/common';

const loggerCtx = 'Populate';

/* eslint-disable no-console */
/**
 * @description
 * Populates the Vendure Prod server with required initial data the first time the server is initialized
 *
 * Internally the `populate()` function does the following:
 *
 * 1. Uses the {@link Populator} to populate the {@link InitialData}.
 *
 * @example
 * ```ts
 * import { bootstrap } from '\@vendure/core';
 * import { populateProd } from '\@vendure/core/cli';
 * import { config } from './vendure-config.ts'
 * import { initialData } from './my-initial-data.ts';
 *
 * populateProd(
 *   () => bootstrap(config),
 *   initialData,
 * )
 * .then(app => app.close())
 * .then(
 *   () => process.exit(0),
 *   err => {
 *     console.log(err);
 *     process.exit(1);
 *   },
 * );
 * ```
 *
 * @docsCategory import-export
 */
export async function populateProd<T extends INestApplicationContext>(
    bootstrapFn: () => Promise<T | undefined>,
    initialDataPathOrObject: string | object,
): Promise<T> {
    const app = await bootstrapFn();
    if (!app) {
        throw new Error('Could not bootstrap the Vendure app');
    }

    const { Logger } = await import('@vendure/core');

    const initialData: import('@vendure/core').InitialDataProd =
        typeof initialDataPathOrObject === 'string'
            ? require(initialDataPathOrObject)
            : initialDataPathOrObject;

    await populateInitialData(app, initialData);
    Logger.info('Done!', loggerCtx);
    return app;
}

async function populateInitialData(
    app: INestApplicationContext,
    initialData: import('@vendure/core').InitialDataProd,
) {
    const { PopulatorProd, Logger } = await import('@vendure/core');
    const populator = app.get(PopulatorProd);
    try {
        // Populate Shop Independent data like Countries, Tax Rates
        await populator.populateInitialData(initialData);
    } catch (err: any) {
        Logger.error(err.message, loggerCtx);
    }
}
