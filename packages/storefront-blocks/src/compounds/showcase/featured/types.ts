export interface Collection {
    id: string;
    name: string;
    description?: string;
    image?: string;
    productCount?: number;
    slug?: string;
}

export interface FeaturedCollectionsBaseProps {
    title?: string;
    subtitle?: string;
    layout: 'grid' | 'carousel' | 'masonry';
    columns: 2 | 3 | 4;
    cardStyle: 'overlay' | 'classic' | 'minimal';
    variant: 'bold' | 'elegant' | 'minimal';
    showTitle: boolean;
    showSubtitle?: boolean;
    showDescription: boolean;
    showProductCount: boolean;
    backgroundColor?: string;
    textColor: string;
    spacing: 'compact' | 'normal' | 'relaxed';
    onCollectionClick?: (collection: Collection) => void;
    ref?: React.Ref<HTMLElement>;
    selected?: boolean;
}

export interface FeaturedCollectionsRuntimeProps extends FeaturedCollectionsBaseProps {
    collections: Collection[];
}

export interface FeaturedCollectionsBuilderProps extends FeaturedCollectionsBaseProps {
    collectionIds: string[];
}
