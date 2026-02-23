import { RequestContext } from '../../api/common/request-context';
import { Page } from '../../entity';
import { VendureEvent } from '../vendure-event';

/**
 * @description
 * This event is fired whenever a {@link Page} is published.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class PagePublishEvent extends VendureEvent {
    constructor(
        public ctx: RequestContext,
        public page: Page,
    ) {
        super();
    }
}
