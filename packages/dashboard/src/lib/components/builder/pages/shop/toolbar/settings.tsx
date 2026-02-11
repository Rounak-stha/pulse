import { useNode } from '@craftjs/core';
import { useState } from 'react';

import { ShopToolbarProps } from '@/builder-blocks/compounds/index.js';
import { SettingsTabs, ToggleInput } from '@/vdb/components/builder/common/index.js';

export function ShopToolbarSettings() {
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
                    <ToggleInput
                        label="Show Result Count"
                        value={props.showResultCount}
                        onChange={val =>
                            setProp((p: ShopToolbarProps) => (p.showResultCount = val))
                        }
                    />

                    <ToggleInput
                        label="Show Sort"
                        value={props.showSort}
                        onChange={val =>
                            setProp((p: ShopToolbarProps) => (p.showSort = val))
                        }
                    />

                    <ToggleInput
                        label="Show View Toggle"
                        value={props.showViewToggle}
                        onChange={val =>
                            setProp((p: ShopToolbarProps) => (p.showViewToggle = val))
                        }
                    />
                </div>
            )}
        </SettingsTabs>
    );
}
