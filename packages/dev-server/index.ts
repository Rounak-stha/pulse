import { bootstrap, JobQueueService, runMigrations } from '@vendure/core';
import fs from 'fs';
import path from 'path';

import { devConfig } from './dev-config';

const certPath = path.join(__dirname, 'certs');

const httpsOptions = {
    key: fs.readFileSync(path.join(certPath, 'localtest.com+1-key.pem')),
    cert: fs.readFileSync(path.join(certPath, 'localtest.com+1.pem')),
    ca: fs.readFileSync(path.join('C:\\Users\\ACER\\AppData\\Local\\mkcert', 'rootCA.pem')),
};

/**
 * This bootstraps the dev server, used for testing Vendure during development.
 */
runMigrations(devConfig)
    .then(() => bootstrap(devConfig, { nestApplicationOptions: { httpsOptions } }))
    .then(app => {
        if (process.env.RUN_JOB_QUEUE === '1') {
            return app.get(JobQueueService).start();
        }
    })
    .catch(err => {
        // eslint-disable-next-line
        console.log(err);
        process.exit(1);
    });
