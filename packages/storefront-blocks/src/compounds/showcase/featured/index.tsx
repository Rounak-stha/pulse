'use client';
import React from 'react';
import { cn } from '../../../lib/utils.js';
import { DefaultFeaturedCollectionRuntimeProps } from './constants/props.js';
import { Collection, FeaturedCollectionsRuntimeProps } from './types.js';

const spacingClasses = {
    compact: 'py-4 md:py-6',
    normal: 'py-6 md:py-10',
    relaxed: 'py-8 md:py-14',
} as const;

interface CollectionCardProps {
    collection: Collection;
    variant: 'minimal' | 'bold' | 'elegant';
    showDescription: boolean;
    showProductCount: boolean;
    textColor: string;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
    collection,
    variant,
    showDescription,
    showProductCount,
    textColor,
}) => {
    if (variant === 'minimal') {
        return (
            <a className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-xl cursor-pointer">
                <div className="aspect-[16/9] bg-slate-100 relative overflow-hidden">
                    {collection.image ? (
                        <img
                            src={collection.image}
                            alt={collection.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>

                <div className="p-6">
                    <h3 className="text-xl font-bold mb-2" style={{ color: textColor }}>
                        {collection.name}
                    </h3>
                    {showDescription && collection.description && (
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{collection.description}</p>
                    )}
                    {showProductCount && (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                            <span className="font-medium">{collection.productCount || 0} Products</span>
                        </div>
                    )}
                </div>
            </a>
        );
    }

    if (variant === 'bold') {
        return (
            <a
                className="group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                style={{ paddingBottom: '133.33%' }}
            >
                <div className="absolute inset-0">
                    {collection.image ? (
                        <img
                            src={collection.image}
                            alt={collection.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/0" />

                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <h3 className="text-xl md:text-3xl font-bold mb-3">{collection.name}</h3>
                        {showDescription && collection.description && (
                            <p className="text-sm text-white/90 mb-4 line-clamp-2">
                                {collection.description}
                            </p>
                        )}
                        {showProductCount && (
                            <div className="flex items-center gap-2 text-sm">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                </svg>
                                <span>{collection.productCount || 0} Products</span>
                            </div>
                        )}
                    </div>
                </div>
            </a>
        );
    }

    // elegant variant
    return (
        <a className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
            <div className="aspect-[3/4] bg-slate-100 relative overflow-hidden">
                {collection.image ? (
                    <img
                        src={collection.image}
                        alt={collection.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
                )}
            </div>

            <div className="p-8">
                <h3 className="text-2xl font-bold mb-2" style={{ color: textColor }}>
                    {collection.name}
                </h3>
                {showDescription && collection.description && (
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{collection.description}</p>
                )}
                {showProductCount && (
                    <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                        </div>
                        <span className="text-sm font-semibold text-slate-700">
                            {collection.productCount || 0} Products
                        </span>
                    </div>
                )}
            </div>
        </a>
    );
};

export const FeaturedCollections: React.FC<FeaturedCollectionsRuntimeProps> = ({
    title = DefaultFeaturedCollectionRuntimeProps.title,
    subtitle = DefaultFeaturedCollectionRuntimeProps.subtitle,
    collections = DefaultFeaturedCollectionRuntimeProps.collections,
    variant = DefaultFeaturedCollectionRuntimeProps.variant,
    columns = DefaultFeaturedCollectionRuntimeProps.columns,
    showTitle = DefaultFeaturedCollectionRuntimeProps.showTitle,
    showSubtitle = DefaultFeaturedCollectionRuntimeProps.showSubtitle,
    showDescription = DefaultFeaturedCollectionRuntimeProps.showDescription,
    showProductCount = DefaultFeaturedCollectionRuntimeProps.showProductCount,
    backgroundColor = DefaultFeaturedCollectionRuntimeProps.backgroundColor,
    textColor = DefaultFeaturedCollectionRuntimeProps.textColor,
    spacing = DefaultFeaturedCollectionRuntimeProps.spacing,
    onCollectionClick,
    ref,
    selected,
}) => {
    const columnClasses = {
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    } as const;

    return (
        <section
            ref={ref}
            className={cn('w-full', spacingClasses[spacing], selected && 'ring-2 ring-blue-500 ring-inset')}
            style={{ backgroundColor, color: textColor }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {(showTitle || showSubtitle) && (
                    <div className="text-center mb-16 space-y-4 max-w-3xl mx-auto">
                        {showTitle && (
                            <h2 className="text-4xl md:text-5xl font-bold" style={{ color: textColor }}>
                                {title}
                            </h2>
                        )}
                        {showSubtitle && <p className="text-lg text-slate-600">{subtitle}</p>}
                    </div>
                )}

                <div className={cn('grid', columnClasses[columns], 'gap-8')}>
                    {collections && collections.length > 0 ? (
                        collections.map(collection => (
                            <CollectionCard
                                key={collection.id}
                                collection={collection}
                                variant={variant}
                                showDescription={showDescription}
                                showProductCount={showProductCount}
                                textColor={textColor}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16">
                            <p className="text-slate-500 text-lg">No collections to display</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
