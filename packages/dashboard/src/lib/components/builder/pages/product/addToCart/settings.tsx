import { useNode } from '@craftjs/core';
import { useState } from 'react';

import type { AddToCartProps } from '@/builder-blocks/compounds/index.js';
import { SelectInput, SettingsTabs, ToggleInput } from '@/vdb/components/builder/common/index.js';

export function AddToCartSettings() {
    const {
        actions: { setProp },
        props,
    } = useNode((node) => ({ props: node.data.props as AddToCartProps }));

    const [activeTab, setActiveTab] = useState<string>('general');

    return (
        <SettingsTabs
            tabs={[
                { id: 'general', label: 'General' },
                { id: 'features', label: 'Features' },
            ]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        >
            {activeTab === 'general' && (
                <div className="space-y-4">
                    <SelectInput
                        label="Button Size"
                        value={props.buttonSize}
                        onChange={(val) => setProp((p: AddToCartProps) => (p.buttonSize = val as 'small' | 'medium' | 'large'))}
                        options={[
                            { value: 'small', label: 'Small' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'large', label: 'Large' },
                        ]}
                    />
                </div>
            )}

            {activeTab === 'features' && (
                <div className="space-y-4">
                    <ToggleInput
                        label="Show Quantity Selector"
                        value={props.showQuantitySelector}
                        onChange={(val) => setProp((p: AddToCartProps) => (p.showQuantitySelector = val))}
                    />

                    <ToggleInput
                        label="Show Wishlist"
                        value={props.showWishlist}
                        onChange={(val) => setProp((p: AddToCartProps) => (p.showWishlist = val))}
                    />

                    <ToggleInput
                        label="Show Compare"
                        value={props.showCompare}
                        onChange={(val) => setProp((p: AddToCartProps) => (p.showCompare = val))}
                    />
                </div>
            )}
        </SettingsTabs>
    );
}