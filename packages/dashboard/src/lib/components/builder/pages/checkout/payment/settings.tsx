import { useNode } from '@craftjs/core';
import { useState } from 'react';

import { SettingsTabs } from '@/vdb/components/builder/common/index.js';

export function PaymentSettings() {
    const { props } = useNode(node => ({ props: node.data.props }));

    const [activeTab, setActiveTab] = useState('general');

    return (
        <SettingsTabs
            tabs={[{ id: 'general', label: 'General' }]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        >
            {activeTab === 'general' && (
                <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                        <p>Displays available payment methods for selection.</p>
                        <p className="mt-2">No additional configuration required.</p>
                    </div>
                </div>
            )}
        </SettingsTabs>
    );
}
