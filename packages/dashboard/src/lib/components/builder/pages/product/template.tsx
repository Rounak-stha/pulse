/**
 * Initial Template for product page
 */

import {
    RootContainer,
} from '@/vdb/components/builder/blocks/atoms/root-container/index.js';
import { ProductPage } from './index.js';
import { DefaultProductPageProps } from '@/builder-blocks/compounds/index.js';
export const ProductPageTemplate = () => {
    
    return (
        <RootContainer>
            <ProductPage productId='' {...DefaultProductPageProps} />
        </RootContainer>
    )
};