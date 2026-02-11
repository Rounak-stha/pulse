import { useNode } from '@craftjs/core';
import { useState } from 'react';

import { ProductGridProps } from '@/builder-blocks/compounds/index.js';
import { SelectInput, SettingsTabs, ToggleInput } from '@/vdb/components/builder/common/index.js';

export function ProductGridSettings() {
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
                        label="View"
                        value={props.view}
                        onChange={val =>
                            setProp((p: ProductGridProps) => (p.view = val as ProductGridProps['view']))
                        }
                        options={[
                            { value: 'grid', label: 'Grid' },
                            { value: 'list', label: 'List' },
                        ]}
                    />

                    <SelectInput
                        label="Columns"
                        value={String(props.columns)}
                        onChange={val =>
                            setProp(
                                (p: ProductGridProps) =>
                                    (p.columns = Number(val) as ProductGridProps['columns']),
                            )
                        }
                        options={[
                            { value: '2', label: '2 Columns' },
                            { value: '3', label: '3 Columns' },
                            { value: '4', label: '4 Columns' },
                        ]}
                    />

                    <SelectInput
                        label="Gap"
                        value={props.gap}
                        onChange={val =>
                            setProp((p: ProductGridProps) => (p.gap = val as ProductGridProps['gap']))
                        }
                        options={[
                            { value: 'compact', label: 'Compact' },
                            { value: 'normal', label: 'Normal' },
                            { value: 'relaxed', label: 'Relaxed' },
                        ]}
                    />

                    <SelectInput
                        label="Card Style"
                        value={props.cardStyle}
                        onChange={val =>
                            setProp(
                                (p: ProductGridProps) =>
                                    (p.cardStyle = val as ProductGridProps['cardStyle']),
                            )
                        }
                        options={[
                            { value: 'standard', label: 'Standard' },
                            { value: 'minimal', label: 'Minimal' },
                            { value: 'detailed', label: 'Detailed' },
                        ]}
                    />

                    <SelectInput
                        label="Image Aspect Ratio"
                        value={props.imageAspectRatio}
                        onChange={val =>
                            setProp(
                                (p: ProductGridProps) =>
                                    (p.imageAspectRatio = val as ProductGridProps['imageAspectRatio']),
                            )
                        }
                        options={[
                            { value: '1:1', label: '1:1 Square' },
                            { value: '4:3', label: '4:3 Standard' },
                            { value: '3:4', label: '3:4 Portrait' },
                        ]}
                    />
                </div>
            )}

            {activeTab === 'features' && (
                <div className="space-y-4">
                    <ToggleInput
                        label="Show Description"
                        value={props.showDescription}
                        onChange={val =>
                            setProp((p: ProductGridProps) => (p.showDescription = val))
                        }
                    />

                    <ToggleInput
                        label="Show Price"
                        value={props.showPrice}
                        onChange={val =>
                            setProp((p: ProductGridProps) => (p.showPrice = val))
                        }
                    />
                </div>
            )}
        </SettingsTabs>
    );
}
