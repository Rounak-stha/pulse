import { useNode } from '@craftjs/core';
import { useState } from 'react';

import { CheckoutPageBuilderProps } from '@/builder-blocks/compounds/index.js';
import { SelectInput, SettingsTabs } from '@/vdb/components/builder/common/index.js';

export function CheckoutPageSettings() {
    const {
        actions: { setProp },
        props,
    } = useNode(node => ({ props: node.data.props }));

    const [activeTab, setActiveTab] = useState('layout');

    return (
        <SettingsTabs
            tabs={[
                { id: 'layout', label: 'Layout' },
                { id: 'appearance', label: 'Appearance' },
                { id: 'advanced', label: 'Advanced' },
            ]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        >
            {activeTab === 'layout' && (
                <div className="space-y-4">
                    <SelectInput
                        label="Layout Style"
                        value={props.layout || 'with-sidebar'}
                        onChange={val =>
                            setProp(
                                (p: CheckoutPageBuilderProps) =>
                                    (p.layout = val as CheckoutPageBuilderProps['layout']),
                            )
                        }
                        options={
                            [
                                { value: 'with-sidebar', label: 'With Sidebar Summary' },
                                { value: 'single-column', label: 'Single Column' },
                            ] as { value: CheckoutPageBuilderProps['layout']; label: string }[]
                        }
                    />

                    <SelectInput
                        label="Container Size"
                        value={props.containerSize || 'default'}
                        onChange={val =>
                            setProp(
                                (p: CheckoutPageBuilderProps) =>
                                    (p.containerSize =
                                        val as CheckoutPageBuilderProps['containerSize']),
                            )
                        }
                        options={
                            [
                                { value: 'default', label: 'Default (4xl)' },
                                { value: 'wide', label: 'Wide (6xl)' },
                                { value: 'full', label: 'Full Width' },
                            ] as { value: CheckoutPageBuilderProps['containerSize']; label: string }[]
                        }
                    />

                    <SelectInput
                        label="Spacing"
                        value={props.spacing || 'comfortable'}
                        onChange={val =>
                            setProp(
                                (p: CheckoutPageBuilderProps) =>
                                    (p.spacing = val as CheckoutPageBuilderProps['spacing']),
                            )
                        }
                        options={
                            [
                                { value: 'compact', label: 'Compact' },
                                { value: 'normal', label: 'Normal' },
                                { value: 'comfortable', label: 'Comfortable' },
                            ] as { value: CheckoutPageBuilderProps['spacing']; label: string }[]
                        }
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
                                (p: CheckoutPageBuilderProps) =>
                                    (p.backgroundColor =
                                        val as CheckoutPageBuilderProps['backgroundColor']),
                            )
                        }
                        options={
                            [
                                { value: 'default', label: 'Default' },
                                { value: 'muted', label: 'Muted' },
                            ] as {
                                value: CheckoutPageBuilderProps['backgroundColor'];
                                label: string;
                            }[]
                        }
                    />

                    <SelectInput
                        label="Border Style"
                        value={props.borderStyle || 'subtle'}
                        onChange={val =>
                            setProp(
                                (p: CheckoutPageBuilderProps) =>
                                    (p.borderStyle = val as CheckoutPageBuilderProps['borderStyle']),
                            )
                        }
                        options={
                            [
                                { value: 'none', label: 'None' },
                                { value: 'subtle', label: 'Subtle' },
                                { value: 'bold', label: 'Bold' },
                            ] as { value: CheckoutPageBuilderProps['borderStyle']; label: string }[]
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
                            <li>OrderSummarySlot - Cart & order totals</li>
                            <li>CustomerInfoSlot - Contact details</li>
                            <li>ShippingAddressSlot - Delivery address</li>
                            <li>ShippingMethodSlot - Shipping options</li>
                            <li>PaymentSlot - Payment method</li>
                            <li>ConfirmationSlot - Order confirmation</li>
                            <li>SlotFlexibleZone - Additional content</li>
                        </ul>
                        <p className="mt-4">
                            Configure individual slots by selecting their respective components in
                            the editor.
                        </p>
                    </div>
                </div>
            )}
        </SettingsTabs>
    );
}
