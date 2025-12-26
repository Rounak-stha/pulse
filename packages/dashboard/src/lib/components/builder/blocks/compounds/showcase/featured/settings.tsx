import { useNode } from '@craftjs/core';
import { FC, useState } from 'react';

import { ColorInput, SelectInput, SettingsTabs, ToggleInput } from '../../../../common/index.js';

import {
    Collection,
    FeaturedCollectionsBuilderProps,
    FeaturedCollectionsRuntimeProps,
} from '@/builder-blocks/compounds/showcase/featured/types.js';
import { Input } from '@/vdb/components/ui/input.js';
import { api } from '@/vdb/graphql/api.js';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import { SearchIcon, XIcon } from 'lucide-react';
import { collectionListForFeaturedCollectionBuilderComponent } from './featured.graphql.js';

const Tabs = [
    { id: 'content', label: 'Content' },
    { id: 'collections', label: 'Collections' },
    { id: 'layout', label: 'Layout' },
    { id: 'style', label: 'Style' },
];

const VariantOptions = [
    { value: 'minimal', label: 'Minimal - Clean & Professional' },
    { value: 'bold', label: 'Bold - Dark & Dramatic' },
    { value: 'elegant', label: 'Elegant - Sophisticated' },
];

const ColumnOptions = [
    { value: '2', label: '2 Columns' },
    { value: '3', label: '3 Columns' },
    { value: '4', label: '4 Columns' },
];

const SpacingOptions = [
    { value: 'compact', label: 'Compact' },
    { value: 'normal', label: 'Normal' },
    { value: 'relaxed', label: 'Relaxed' },
];

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}

export function FeaturedCollectionsSettings() {
    const {
        actions: { setProp },
        props,
    } = useNode(node => ({ props: node.data.props }));

    const [activeTab, setActiveTab] = useState('content');

    const collections: Collection[] = [];

    const toggleCollection = (collectionId: string) => {
        setProp((p: FeaturedCollectionsBuilderProps) => {
            const current = p.collectionIds || [];
            if (current.includes(collectionId)) {
                p.collectionIds = current.filter(id => id !== collectionId);
            } else {
                p.collectionIds = [...current, collectionId];
            }
        });
    };

    const isSelected = (collectionId: string) => {
        return (props.collectionIds || []).includes(collectionId);
    };

    const moveCollection = (collectionId: string, direction: 'up' | 'down') => {
        setProp((p: FeaturedCollectionsBuilderProps) => {
            const current = [...(p.collectionIds || [])];
            const index = current.indexOf(collectionId);
            if (index === -1) return;

            if (direction === 'up' && index > 0) {
                [current[index], current[index - 1]] = [current[index - 1], current[index]];
            } else if (direction === 'down' && index < current.length - 1) {
                [current[index], current[index + 1]] = [current[index + 1], current[index]];
            }

            p.collectionIds = current;
        });
    };

    return (
        <SettingsTabs tabs={Tabs} activeTab={activeTab} setActiveTab={setActiveTab}>
            {activeTab === 'content' && (
                <div className="space-y-6">
                    <div className="space-y-4">
                        <ToggleInput
                            label="Show Section Title"
                            value={props.showTitle ?? true}
                            onChange={val =>
                                setProp((p: FeaturedCollectionsBuilderProps) => (p.showTitle = val))
                            }
                        />

                        {props.showTitle && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Section Title</label>
                                <input
                                    type="text"
                                    value={props.title || 'Shop by Collection'}
                                    onChange={e =>
                                        setProp(
                                            (p: FeaturedCollectionsBuilderProps) =>
                                                (p.title = e.target.value),
                                        )
                                    }
                                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Shop by Collection"
                                />
                            </div>
                        )}

                        <ToggleInput
                            label="Show Subtitle"
                            value={props.showSubtitle ?? true}
                            onChange={val =>
                                setProp((p: FeaturedCollectionsBuilderProps) => (p.showSubtitle = val))
                            }
                        />

                        {props.showSubtitle && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Subtitle</label>
                                <input
                                    type="text"
                                    value={props.subtitle || 'Discover our curated selections'}
                                    onChange={e =>
                                        setProp(
                                            (p: FeaturedCollectionsBuilderProps) =>
                                                (p.subtitle = e.target.value),
                                        )
                                    }
                                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Discover our curated selections"
                                />
                            </div>
                        )}
                    </div>

                    <div className="border-t pt-4 space-y-4">
                        <div className="text-sm font-medium">Card Content</div>

                        <ToggleInput
                            label="Show Descriptions"
                            value={props.showDescription ?? true}
                            onChange={val =>
                                setProp((p: FeaturedCollectionsBuilderProps) => (p.showDescription = val))
                            }
                        />

                        <ToggleInput
                            label="Show Product Count"
                            value={props.showProductCount ?? true}
                            onChange={val =>
                                setProp((p: FeaturedCollectionsBuilderProps) => (p.showProductCount = val))
                            }
                        />
                    </div>
                </div>
            )}

            {activeTab === 'collections' && <CollectionSettings props={props} setProp={setProp} />}

            {activeTab === 'layout' && (
                <div className="space-y-6">
                    <SelectInput
                        label="Design Variant"
                        value={props.variant || 'bold'}
                        onChange={val =>
                            setProp((p: FeaturedCollectionsBuilderProps) => (p.variant = val as any))
                        }
                        options={VariantOptions}
                    />

                    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <div className="text-xs font-medium text-gray-700 mb-2">Variant Preview:</div>
                        <div className="space-y-2 text-xs text-gray-600">
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                                <div>
                                    <span className="font-semibold">Minimal:</span> Clean white cards with
                                    subtle borders, professional appearance
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1 flex-shrink-0" />
                                <div>
                                    <span className="font-semibold">Bold:</span> Dark dramatic overlay with
                                    gradient backgrounds, eye-catching
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-pink-500 mt-1 flex-shrink-0" />
                                <div>
                                    <span className="font-semibold">Elegant:</span> Sophisticated design with
                                    soft gradients and elevated feel
                                </div>
                            </div>
                        </div>
                    </div>

                    <SelectInput
                        label="Number of Columns"
                        value={props.columns || 3}
                        onChange={val =>
                            setProp((p: FeaturedCollectionsBuilderProps) => (p.columns = Number(val) as any))
                        }
                        options={ColumnOptions}
                    />

                    <SelectInput
                        label="Section Spacing"
                        value={props.spacing || 'normal'}
                        onChange={val =>
                            setProp((p: FeaturedCollectionsBuilderProps) => (p.spacing = val as any))
                        }
                        options={SpacingOptions}
                    />

                    <div className="text-xs text-gray-600 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                        <div className="flex items-start gap-2">
                            <svg
                                className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                />
                            </svg>
                            <div>
                                <div className="font-medium text-amber-900 mb-1">Layout Tips</div>
                                <div className="text-amber-700">
                                    The layout automatically adjusts for mobile devices. Bold variant works
                                    best with 3 columns.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'style' && (
                <div className="space-y-6">
                    <ColorInput
                        label="Background Color"
                        value={props.backgroundColor || '#ffffff'}
                        onChange={val =>
                            setProp((p: FeaturedCollectionsBuilderProps) => (p.backgroundColor = val))
                        }
                    />

                    <ColorInput
                        label="Text Color"
                        value={props.textColor || '#000000'}
                        onChange={val => setProp((p: FeaturedCollectionsBuilderProps) => (p.textColor = val))}
                    />

                    <div className="border-t pt-4">
                        <div className="text-xs font-medium text-gray-700 mb-3">Color Usage</div>
                        <div className="space-y-3 text-xs text-gray-600">
                            <div className="flex items-start gap-2">
                                <div
                                    className="w-6 h-6 rounded border border-gray-300 flex-shrink-0"
                                    style={{ backgroundColor: props.backgroundColor || '#ffffff' }}
                                />
                                <div>
                                    <div className="font-medium text-gray-900">Background Color</div>
                                    <div>Applied to the entire section background</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div
                                    className="w-6 h-6 rounded border border-gray-300 flex-shrink-0 flex items-center justify-center"
                                    style={{ backgroundColor: props.backgroundColor || '#ffffff' }}
                                >
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: props.textColor || '#000000' }}
                                    />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">Text Color</div>
                                    <div>Applied to section title, subtitle, and collection names</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-gray-600 p-3 bg-purple-50 border border-purple-100 rounded-lg">
                        <div className="flex items-start gap-2">
                            <svg
                                className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                                />
                            </svg>
                            <div>
                                <div className="font-medium text-purple-900 mb-1">Color Best Practices</div>
                                <div className="text-purple-700">
                                    Ensure sufficient contrast between background and text colors for
                                    readability. Consider your brand colors.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </SettingsTabs>
    );
}

type UseNodeReturn = ReturnType<
    typeof useNode<{
        props: Record<string, any>;
    }>
>;

type CollectionSettingsProps = {
    props: UseNodeReturn['props'];
    setProp: UseNodeReturn['setProp'];
};

const CollectionSearch: FC<CollectionSettingsProps> = ({ props, setProp }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const addCollection = (id: string) => {
        const existingCollectionIds = new Set(props.collectionIds || []);
        existingCollectionIds.add(id);
        setProp(p => (p.collectionIds = Array.from(existingCollectionIds)));
    };

    const { data: collectionsData, isLoading } = useQuery({
        queryKey: ['searchCollectionsForFeaturedCollectionComponent', debouncedSearchTerm],
        queryFn: () =>
            api.query(collectionListForFeaturedCollectionBuilderComponent, {
                options: {
                    take: 10,
                    topLevelOnly: !debouncedSearchTerm,
                    ...(debouncedSearchTerm && {
                        filter: {
                            name: { contains: debouncedSearchTerm },
                        },
                    }),
                },
            }),
        staleTime: 1000 * 60 * 5,
        enabled: !!debouncedSearchTerm,
    });

    const collections: FeaturedCollectionsRuntimeProps['collections'] =
        collectionsData?.collections.items.map(c => ({
            id: c.id,
            name: c.name,
            description: c.description,
            image: c.featuredAsset?.source,
            slug: c.slug,
        })) || [];

    return (
        <div className="relative mb-3">
            <SearchIcon className="absolute left-3 top-5 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search Collection"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
            />
            {collections.map(collection => (
                <div
                    key={collection.id}
                    className="mt-2 p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-muted"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{collection.name}</div>
                            <div className="text-xs text-gray-500 truncate">{collection.description}</div>
                        </div>
                        <div
                            className="w-5 h-5 rounded border-2 flex items-center justify-center ml-2 flex-shrink-0"
                            onClick={() => addCollection(collection.id)}
                        >
                            <svg
                                className="w-3 h-3 text-muted-foreground"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const CollectionSettings: FC<CollectionSettingsProps> = ({ props, setProp }) => {
    const collectionIds = props.collectionIds || [];

    const removeCollection = (id: string) => {
        const existingCollectionIds = new Set(props.collectionIds || []);
        existingCollectionIds.delete(id);
        setProp(p => (p.collectionIds = Array.from(existingCollectionIds)));
    };

    const { data: collectionsData, isLoading } = useQuery({
        queryKey: ['collectionsForFeaturedCollectionComponentBtIds', collectionIds],
        queryFn: () =>
            api.query(collectionListForFeaturedCollectionBuilderComponent, {
                options: {
                    take: 10,
                    filter: {
                        id: { in: collectionIds },
                    },
                },
            }),
        staleTime: 1000 * 60 * 5,
        enabled: true,
    });

    const collections = collectionsData?.collections.items || [];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium">Select Collections</div>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {(props.collectionIds || []).length} selected
                </div>
            </div>

            <div className="text-xs font-medium text-gray-600 mb-2">Available Collections:</div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {collections.map(collection => (
                    <div
                        key={collection.id}
                        className="p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-muted"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{collection.name}</div>
                                <div className="text-xs text-muted-foreground truncate">
                                    {collection.description}
                                </div>
                            </div>
                            <div
                                className="w-5 h-5 rounded border-2 flex items-center justify-center ml-2 flex-shrink-0"
                                onClick={() => removeCollection(collection.id)}
                            >
                                <XIcon size={10} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {collections.length === 0 && (
                <div className="text-center p-8 border-2 border-dashed rounded-lg">
                    <svg
                        className="w-12 h-12 mx-auto text-muted-foreground mb-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                    </svg>
                    <p className="text-sm text-muted-foreground font-medium">No collections selected</p>
                    <p className="text-xs text-muted-foreground/80 mt-1">
                        Collections will appear here once created
                    </p>
                </div>
            )}

            <CollectionSearch props={props} setProp={setProp} />
        </div>
    );
};
