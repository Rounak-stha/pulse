import { bootstrap, JobQueueService, runMigrations } from '@vendure/core';
import { populateOnFirstRun } from './populate';
import { config } from './prod-config';

populateOnFirstRun(config)
    .then(() => runMigrations(config))
    .then(() => bootstrap(config))
    .then(app => {
        // For "lite" deployments with limited resources, we can run the job queue
        if (process.env.RUN_JOB_QUEUE_FROM_SERVER?.toLowerCase() === 'true') {
            return app.get(JobQueueService).start();
        }
    })
    .catch(err => {
        console.log(err);
    });
