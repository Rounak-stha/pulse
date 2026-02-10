import { DefaultCheckoutPageProps } from '@/builder-blocks/compounds/index.js';
import { RootContainer } from '@/vdb/components/builder/blocks/atoms/root-container/index.js';
import { CheckoutPage } from './index.js';

export const CheckoutPageTemplate = () => {
    return (
        <RootContainer>
            <CheckoutPage {...DefaultCheckoutPageProps} />
        </RootContainer>
    );
};
