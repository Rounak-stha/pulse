import { RequestContext } from '../../api/common/request-context';
import { BuilderGlobal } from '../../entity/builder-global/builder-global.entity';
import { VendureEvent } from '../vendure-event';

/**
 * @description
 * This event is fired whenever a {@link BuilderGlobal} is published.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class BuilderGlobalPublishEvent extends VendureEvent {
    constructor(
        public ctx: RequestContext,
        public builderGlobal: BuilderGlobal,
    ) {
        super();
    }
}
