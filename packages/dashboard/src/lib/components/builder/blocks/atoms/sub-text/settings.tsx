import { SubtextProps } from '@/builder-blocks/atoms/index.js';
import { useNode } from '@craftjs/core';
import { ColorInput, TextInput } from '../../../common/index.js';

export function SubtextSettings() {
    const {
        actions: { setProp },
        props,
    } = useNode(node => ({ props: node.data.props }));

    return (
        <div className="space-y-4">
            <TextInput
                label="Subtext"
                value={props.text}
                onChange={val => setProp((p: SubtextProps) => (p.text = val))}
                rows={3}
            />
            <ColorInput
                label="Text Color"
                value={props.color}
                onChange={val => setProp((p: SubtextProps) => (p.color = val))}
            />
        </div>
    );
}
