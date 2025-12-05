import { bootstrap, VendureConfig } from '@vendure/core';
import { populateProd } from '@vendure/core/cli';
import { DataSource } from 'typeorm';

import { getRequiredEnv } from './utils';

import { initialData } from '../../core/prod-data/data-sources/initial-data';

const DB_SCHEMA = getRequiredEnv('DB_SCHEMA');
/**
 * @description
 * This function is responsible for populating the DB with test data on the first run. It
 * first checks to see if the configured DB has any tables, and if not, runs the `populate()`
 * function using data from the @vendure/create package.
 */
export async function populateOnFirstRun(config: VendureConfig) {
    const dbTablesAlreadyExist = await tablesExist(config);
    if (!dbTablesAlreadyExist) {
        console.log(`No Vendure tables found in DB. Populating database...`);
        return populateProd(
            () =>
                bootstrap({
                    ...config,
                    dbConnectionOptions: { ...config.dbConnectionOptions, synchronize: true },
                }),
            initialData,
        ).then(app => app.close());
    } else {
        return;
    }
}

async function tablesExist(config: VendureConfig) {
    const datasource = new DataSource(config.dbConnectionOptions);
    await datasource.initialize();

    const result = await datasource.query(`
        select n.nspname as table_schema,
               c.relname as table_name,
               c.reltuples as rows
        from pg_class c
        join pg_namespace n on n.oid = c.relnamespace
        where c.relkind = 'r'
              and n.nspname = '${DB_SCHEMA}'
        order by c.reltuples desc;`);
    await datasource.destroy();
    return result.length > 0;
}
