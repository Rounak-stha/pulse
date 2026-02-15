import { RootContainer as RootContainerPure } from '@/builder-blocks/atoms/root-container/index.js';
import type { RootContainerProps } from '@/builder-blocks/atoms/root-container/types.js';
import { useNode } from '@craftjs/core';

export const RootContainer: React.FC<RootContainerProps> = props => {
    const {
        connectors: { connect, drag },
    } = useNode(state => ({
        selected: state.events.selected,
    }));

    return (
        <RootContainerPure
            {...props}
            ref={(ref: HTMLDivElement) => {
                connect(drag(ref));
            }}
        />
    );
};
