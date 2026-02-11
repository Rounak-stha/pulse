import { useNode } from '@craftjs/core';
import { useState } from 'react';

import { ShopPaginationProps } from '@/builder-blocks/compounds/index.js';
import { SelectInput, SettingsTabs, ToggleInput } from '@/vdb/components/builder/common/index.js';

export function ShopPaginationSettings() {
    const {
        actions: { setProp },
        props,
    } = useNode(node => ({ props: node.data.props }));

    const [activeTab, setActiveTab] = useState('layout');

    return (
        <SettingsTabs
            tabs={[{ id: 'layout', label: 'Layout' }]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        >
            {activeTab === 'layout' && (
                <div className="space-y-4">
                    <SelectInput
                        label="Style"
                        value={props.style}
                        onChange={val =>
                            setProp(
                                (p: ShopPaginationProps) =>
                                    (p.style = val as ShopPaginationProps['style']),
                            )
                        }
                        options={[
                            { value: 'numbered', label: 'Numbered' },
                            { value: 'simple', label: 'Simple' },
                        ]}
                    />

                    <ToggleInput
                        label="Show Page Size"
                        value={props.showPageSize}
                        onChange={val =>
                            setProp((p: ShopPaginationProps) => (p.showPageSize = val))
                        }
                    />
                </div>
            )}
        </SettingsTabs>
    );
}
