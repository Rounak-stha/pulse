import {
    FeaturedCollectionsBaseProps,
    FeaturedCollectionsBuilderProps,
    FeaturedCollectionsRuntimeProps,
} from '../types.js';

const DefaultFeaturedCollectionsBaseProps: FeaturedCollectionsBaseProps = {
    title: 'Shop by Collection',
    subtitle: 'Discover our curated selections',
    variant: 'bold',
    columns: 3,
    showTitle: true,
    showSubtitle: true,
    showDescription: true,
    showProductCount: true,
    backgroundColor: '#ffffff',
    textColor: '#000000',
    spacing: 'normal',
    cardStyle: 'classic',
    layout: 'grid',
};

export const DefaultFeaturedCollectionRuntimeProps: FeaturedCollectionsRuntimeProps = {
    ...DefaultFeaturedCollectionsBaseProps,
    collections: [],
};

export const DefaultFeaturedCollectionBuilderProps: FeaturedCollectionsBuilderProps = {
    ...DefaultFeaturedCollectionsBaseProps,
    collectionIds: [],
};
