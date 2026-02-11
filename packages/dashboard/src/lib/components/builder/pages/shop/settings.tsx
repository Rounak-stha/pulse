import { useNode } from '@craftjs/core';
import { useState } from 'react';

import { ShopPageBuilderProps } from '@/builder-blocks/compounds/index.js';
import {
    CollectionSearchInput,
    SelectInput,
    SettingsTabs,
    ToggleInput,
} from '@/vdb/components/builder/common/index.js';

export function ShopPageSettings() {
    const {
        actions: { setProp },
        props,
    } = useNode(node => ({ props: node.data.props }));

    const [activeTab, setActiveTab] = useState('collection');

    return (
        <SettingsTabs
            tabs={[
                { id: 'collection', label: 'Collection' },
                { id: 'layout', label: 'Layout' },
            ]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        >
            {activeTab === 'collection' && (
                <div className="space-y-4">
                    <CollectionSearchInput
                        label="Filter by Collection"
                        selectedSlug={props.collectionSlug}
                        onCollectionSelect={collection =>
                            setProp((p: ShopPageBuilderProps) => (p.collectionSlug = collection.slug))
                        }
                        onClear={() =>
                            setProp((p: ShopPageBuilderProps) => (p.collectionSlug = undefined))
                        }
                    />
                    <p className="text-xs text-muted-foreground">
                        Select a collection to show only its products. Leave empty to show all products.
                    </p>
                </div>
            )}

            {activeTab === 'layout' && (
                <div className="space-y-4">
                    <SelectInput
                        label="Layout Style"
                        value={props.layout || 'sidebar-left'}
                        onChange={val =>
                            setProp(
                                (p: ShopPageBuilderProps) =>
                                    (p.layout = val as ShopPageBuilderProps['layout']),
                            )
                        }
                        options={
                            [
                                { value: 'sidebar-left', label: 'Sidebar Left' },
                                { value: 'sidebar-right', label: 'Sidebar Right' },
                                { value: 'top-filters', label: 'Top Filters' },
                            ] as { value: ShopPageBuilderProps['layout']; label: string }[]
                        }
                    />

                    <SelectInput
                        label="Container Size"
                        value={props.containerSize || 'default'}
                        onChange={val =>
                            setProp(
                                (p: ShopPageBuilderProps) =>
                                    (p.containerSize = val as ShopPageBuilderProps['containerSize']),
                            )
                        }
                        options={
                            [
                                { value: 'default', label: 'Default' },
                                { value: 'wide', label: 'Wide' },
                                { value: 'full', label: 'Full Width' },
                            ] as { value: ShopPageBuilderProps['containerSize']; label: string }[]
                        }
                    />

                    <SelectInput
                        label="Sidebar Width"
                        value={props.sidebarWidth || 'default'}
                        onChange={val =>
                            setProp(
                                (p: ShopPageBuilderProps) =>
                                    (p.sidebarWidth = val as ShopPageBuilderProps['sidebarWidth']),
                            )
                        }
                        options={
                            [
                                { value: 'narrow', label: 'Narrow' },
                                { value: 'default', label: 'Default' },
                                { value: 'wide', label: 'Wide' },
                            ] as { value: ShopPageBuilderProps['sidebarWidth']; label: string }[]
                        }
                    />

                    <SelectInput
                        label="Spacing"
                        value={props.spacing || 'normal'}
                        onChange={val =>
                            setProp(
                                (p: ShopPageBuilderProps) =>
                                    (p.spacing = val as ShopPageBuilderProps['spacing']),
                            )
                        }
                        options={
                            [
                                { value: 'compact', label: 'Compact' },
                                { value: 'normal', label: 'Normal' },
                                { value: 'comfortable', label: 'Comfortable' },
                            ] as { value: ShopPageBuilderProps['spacing']; label: string }[]
                        }
                    />

                    <ToggleInput
                        label="Sticky Sidebar"
                        value={props.stickySidebar || false}
                        onChange={val =>
                            setProp((p: ShopPageBuilderProps) => (p.stickySidebar = val))
                        }
                    />

                    <ToggleInput
                        label="Show Filters"
                        value={props.showFilters ?? true}
                        onChange={val =>
                            setProp((p: ShopPageBuilderProps) => (p.showFilters = val))
                        }
                    />
                </div>
            )}
        </SettingsTabs>
    );
}
