import { useNode } from '@craftjs/core';
import { useState } from 'react';

import { ProductPageBuilderProps } from '@/builder-blocks/compounds/index.js';
import {
    ProductSearchInput,
    SelectInput,
    SettingsTabs,
    ToggleInput,
} from '@/vdb/components/builder/common/index.js';

export function ProductPageSettings() {
    const {
        actions: { setProp },
        props,
    } = useNode(node => ({ props: node.data.props }));

    const [activeTab, setActiveTab] = useState('product');

    return (
        <SettingsTabs
            tabs={[
                { id: 'product', label: 'Product' },
                { id: 'layout', label: 'Layout' },
                { id: 'appearance', label: 'Appearance' },
                { id: 'advanced', label: 'Advanced' },
            ]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        >
            {activeTab === 'product' && (
                <div className="space-y-4">
                    <ProductSearchInput
                        label="Select Product"
                        onProductSelect={product =>
                            setProp((p: ProductPageBuilderProps) => (p.productId = product.id))
                        }
                    />
                </div>
            )}

            {activeTab === 'layout' && (
                <div className="space-y-4">
                    <SelectInput
                        label="Layout Style"
                        value={props.layout || 'default'}
                        onChange={val =>
                            setProp(
                                (p: ProductPageBuilderProps) =>
                                    (p.layout = val as ProductPageBuilderProps['layout']),
                            )
                        }
                        options={
                            [
                                { value: 'default', label: 'Default (50/50)' },
                                { value: 'wide', label: 'Wide Gallery' },
                                { value: 'sidebar', label: 'Sidebar Layout' },
                            ] as { value: ProductPageBuilderProps['layout']; label: string }[]
                        }
                    />

                    <SelectInput
                        label="Gallery Position"
                        value={props.galleryPosition || 'left'}
                        onChange={val =>
                            setProp(
                                (p: ProductPageBuilderProps) =>
                                    (p.galleryPosition = val as ProductPageBuilderProps['galleryPosition']),
                            )
                        }
                        options={
                            [
                                { value: 'left', label: '⬅️ Left' },
                                { value: 'right', label: '➡️ Right' },
                            ] as { value: ProductPageBuilderProps['galleryPosition']; label: string }[]
                        }
                    />

                    <SelectInput
                        label="Container Size"
                        value={props.containerSize || 'default'}
                        onChange={val =>
                            setProp(
                                (p: ProductPageBuilderProps) =>
                                    (p.containerSize = val as ProductPageBuilderProps['containerSize']),
                            )
                        }
                        options={
                            [
                                { value: 'default', label: 'Default (7xl)' },
                                { value: 'wide', label: 'Wide (2xl)' },
                                { value: 'full', label: 'Full Width' },
                            ] as { value: ProductPageBuilderProps['containerSize']; label: string }[]
                        }
                    />

                    <SelectInput
                        label="Spacing"
                        value={props.spacing || 'normal'}
                        onChange={val =>
                            setProp(
                                (p: ProductPageBuilderProps) =>
                                    (p.spacing = val as ProductPageBuilderProps['spacing']),
                            )
                        }
                        options={
                            [
                                { value: 'compact', label: 'Compact' },
                                { value: 'normal', label: 'Normal' },
                                { value: 'comfortable', label: 'Comfortable' },
                            ] as { value: ProductPageBuilderProps['spacing']; label: string }[]
                        }
                    />

                    <SelectInput
                        label="Content Alignment"
                        value={props.contentAlignment || 'start'}
                        onChange={val =>
                            setProp(
                                (p: ProductPageBuilderProps) =>
                                    (p.contentAlignment = val as ProductPageBuilderProps['contentAlignment']),
                            )
                        }
                        options={
                            [
                                { value: 'start', label: 'Start' },
                                { value: 'center', label: 'Center' },
                            ] as { value: ProductPageBuilderProps['contentAlignment']; label: string }[]
                        }
                    />

                    <ToggleInput
                        label="Sticky Gallery"
                        value={props.stickyGallery || false}
                        onChange={val => setProp((p: ProductPageBuilderProps) => (p.stickyGallery = val))}
                    />
                </div>
            )}

            {activeTab === 'appearance' && (
                <div className="space-y-4">
                    <SelectInput
                        label="Background Color"
                        value={props.backgroundColor || 'default'}
                        onChange={val =>
                            setProp(
                                (p: ProductPageBuilderProps) =>
                                    (p.backgroundColor = val as ProductPageBuilderProps['backgroundColor']),
                            )
                        }
                        options={
                            [
                                { value: 'default', label: 'Default' },
                                { value: 'muted', label: 'Muted' },
                                { value: 'accent', label: 'Accent' },
                            ] as { value: ProductPageBuilderProps['backgroundColor']; label: string }[]
                        }
                    />

                    <SelectInput
                        label="Border Style"
                        value={props.borderStyle || 'none'}
                        onChange={val =>
                            setProp(
                                (p: ProductPageBuilderProps) =>
                                    (p.borderStyle = val as ProductPageBuilderProps['borderStyle']),
                            )
                        }
                        options={
                            [
                                { value: 'none', label: 'None' },
                                { value: 'subtle', label: 'Subtle' },
                                { value: 'bold', label: 'Bold' },
                            ] as { value: ProductPageBuilderProps['borderStyle']; label: string }[]
                        }
                    />
                </div>
            )}

            {activeTab === 'advanced' && (
                <div className="space-y-4">
                    <div className="text-sm text-muted-foreground space-y-2">
                        <p className="font-medium">Slot Configuration</p>
                        <p>This component uses the following slots:</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>ProductGallerySlot - Image gallery</li>
                            <li>ProductInfoSlot - Product details</li>
                            <li>AddToCartSlot - Purchase controls</li>
                            <li>SlotFlexibleZone - Additional content</li>
                        </ul>
                        <p className="mt-4">
                            Configure individual slots by selecting their respective components in the editor.
                        </p>
                    </div>
                </div>
            )}
        </SettingsTabs>
    );
}
