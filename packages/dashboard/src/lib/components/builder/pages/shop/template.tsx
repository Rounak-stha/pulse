import { DefaultShopPageProps } from '@/builder-blocks/compounds/index.js';
import { RootContainer } from '@/vdb/components/builder/blocks/atoms/root-container/index.js';
import { ShopPage } from './index.js';

export const ShopPageTemplate = () => {
    return (
        <RootContainer>
            <ShopPage {...DefaultShopPageProps} />
        </RootContainer>
    );
};
