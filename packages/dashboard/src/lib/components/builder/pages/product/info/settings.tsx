import type { ProductInfoProps } from '@/builder-blocks/compounds/product/index.js';
import { Checkbox } from '@/vdb/components/ui/checkbox.js';
import { Label } from '@/vdb/components/ui/label.js';
import { useNode } from '@craftjs/core';
import { SelectInput } from '../../../common/index.js';

export function ProductInfoSettings() {
    const {
        actions: { setProp },
        props,
    } = useNode(node => ({ props: node.data.props }));

    return (
        <div>
            <div className="border-t pt-4 space-y-4">
                <label className="text-sm font-medium block">Display Options</label>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        checked={Boolean(props.showSKU)}
                        onCheckedChange={e => setProp((p: ProductInfoProps) => (p.showSKU = Boolean(e)))}
                        className="rounded"
                        id="product-info-settings-show-sku"
                    />
                    <Label htmlFor="product-info-settings-show-sku">Show SKU</Label>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        checked={props.showStock}
                        onCheckedChange={e => setProp((p: ProductInfoProps) => (p.showStock = Boolean(e)))}
                        className="rounded"
                        id="product-info-settings-show-stock"
                    />
                    <Label htmlFor="product-info-settings-show-stock">Show Stock</Label>
                </div>

                <SelectInput
                    label="Price Size"
                    value={props.priceSize}
                    onChange={val => setProp((p: ProductInfoProps) => (p.priceSize = val as any))}
                    options={[
                        { value: 'small', label: 'Small' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'large', label: 'Large' },
                    ]}
                />
            </div>
        </div>
    );
}
