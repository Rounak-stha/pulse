import type { BadgeProps } from '@/builder-blocks/atoms/badge/types.js';
import { useNode } from '@craftjs/core';
import { ColorInput, TextInput } from '../../../common/index.js';

export function BadgeSettings() {
    const {
        actions: { setProp },
        props,
    } = useNode(node => ({ props: node.data.props }));

    return (
        <div className="space-y-4">
            <TextInput
                label="Badge Text"
                value={props.text}
                onChange={val => setProp((p: BadgeProps) => (p.text = val))}
            />
            <ColorInput
                label="Background Color"
                value={props.backgroundColor}
                onChange={val => setProp((p: BadgeProps) => (p.backgroundColor = val))}
            />
            <ColorInput
                label="Text Color"
                value={props.textColor}
                onChange={val => setProp((p: BadgeProps) => (p.textColor = val))}
            />
        </div>
    );
}
