import { useNode } from '@craftjs/core';
import { useState } from 'react';

import type { OrderSummaryProps } from '@/builder-blocks/compounds/index.js';
import { SettingsTabs, ToggleInput } from '@/vdb/components/builder/common/index.js';

export function OrderSummarySettings() {
    const {
        actions: { setProp },
        props,
    } = useNode(node => ({ props: node.data.props as OrderSummaryProps }));

    const [activeTab, setActiveTab] = useState('general');

    return (
        <SettingsTabs
            tabs={[{ id: 'general', label: 'General' }]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        >
            {activeTab === 'general' && (
                <div className="space-y-4">
                    <ToggleInput
                        label="Show Line Images"
                        value={props.showLineImages}
                        onChange={val =>
                            setProp((p: OrderSummaryProps) => (p.showLineImages = val))
                        }
                    />
                    <ToggleInput
                        label="Show Coupons"
                        value={props.showCoupons}
                        onChange={val =>
                            setProp((p: OrderSummaryProps) => (p.showCoupons = val))
                        }
                    />
                    <ToggleInput
                        label="Compact Mode"
                        value={props.compact}
                        onChange={val =>
                            setProp((p: OrderSummaryProps) => (p.compact = val))
                        }
                    />
                </div>
            )}
        </SettingsTabs>
    );
}
