import { useNode } from '@craftjs/core';
import { useState } from 'react';

import { ShopFiltersProps } from '@/builder-blocks/compounds/index.js';
import { SelectInput, SettingsTabs, ToggleInput } from '@/vdb/components/builder/common/index.js';

export function ShopFiltersSettings() {
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
                        label="Mode"
                        value={props.mode}
                        onChange={val =>
                            setProp(
                                (p: ShopFiltersProps) =>
                                    (p.mode = val as ShopFiltersProps['mode']),
                            )
                        }
                        options={[
                            { value: 'checkbox', label: 'Checkbox' },
                            { value: 'pill', label: 'Pill' },
                        ]}
                    />

                    <ToggleInput
                        label="Show Counts"
                        value={props.showCounts}
                        onChange={val =>
                            setProp((p: ShopFiltersProps) => (p.showCounts = val))
                        }
                    />

                    <ToggleInput
                        label="Collapsible"
                        value={props.collapsible}
                        onChange={val =>
                            setProp((p: ShopFiltersProps) => (p.collapsible = val))
                        }
                    />
                </div>
            )}
        </SettingsTabs>
    );
}
