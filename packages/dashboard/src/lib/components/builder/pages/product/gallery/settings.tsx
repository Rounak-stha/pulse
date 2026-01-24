import { useNode } from '@craftjs/core';
import { useState } from 'react';

import { ProductGalleryProps } from '@/builder-blocks/compounds/index.js';
import { SelectInput, SettingsTabs, ToggleInput } from '@/vdb/components/builder/common/index.js';

export function ProductGallerySettings() {
    const {
        actions: { setProp },
        props,
    } = useNode(node => ({ props: node.data.props }));

    const [activeTab, setActiveTab] = useState('layout');

    return (
        <SettingsTabs
            tabs={[
                { id: 'layout', label: 'Layout' },
                { id: 'features', label: 'Features' },
            ]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        >
            {activeTab === 'layout' && (
                <div className="space-y-4">
                    <SelectInput
                        label="Layout Type"
                        value={props.layout}
                        onChange={val => setProp((p: ProductGalleryProps) => (p.layout = val as any))}
                        options={[
                            { value: 'grid', label: 'Grid' },
                            { value: 'carousel', label: 'Carousel' },
                        ]}
                    />

                    <SelectInput
                        label="Thumbnail Position"
                        value={props.thumbnailPosition}
                        onChange={val =>
                            setProp((p: ProductGalleryProps) => (p.thumbnailPosition = val as any))
                        }
                        options={[
                            { value: 'bottom', label: '⬇️ Bottom' },
                            { value: 'top', label: '⬆️ Top' },
                            { value: 'left', label: '⬅️ Left' },
                            { value: 'right', label: '➡️ Right' },
                        ]}
                    />

                    <SelectInput
                        label="Aspect Ratio"
                        value={props.aspectRatio}
                        onChange={val => setProp((p: ProductGalleryProps) => (p.aspectRatio = val as any))}
                        options={[
                            { value: '1:1', label: '1:1 Square' },
                            { value: '4:3', label: '4:3 Standard' },
                            { value: '16:9', label: '16:9 Wide' },
                            { value: '3:4', label: '3:4 Portrait' },
                        ]}
                    />
                </div>
            )}

            {activeTab === 'features' && (
                <div className="space-y-4">
                    <ToggleInput
                        label="Enable Zoom"
                        value={props.zoom}
                        onChange={val => setProp((p: ProductGalleryProps) => (p.zoom = val))}
                    />
                </div>
            )}
        </SettingsTabs>
    );
}
