import { RootContainer as RootContainerPure } from '@/builder-blocks/atoms/root-container/index.js';
import type { RootContainerProps } from '@/builder-blocks/atoms/root-container/types.js';
import { useNode } from '@craftjs/core';

// Specialized RootContainer for global contexts that restricts to one global component
export const GlobalRootContainer: React.FC<RootContainerProps> = props => {
    const {
        connectors: { connect, drag },
    } = useNode();

    return (
        <RootContainerPure
            {...props}
            ref={(ref: HTMLDivElement) => {
                connect(drag(ref));
            }}
        />
    );
};

// Add craft metadata to GlobalRootContainer to define rules for global contexts
(GlobalRootContainer as any).craft = {
    rules: {
        canDrop: (incomingNode: any) => {
            // Check if the incoming node is a global component (has isGlobal in custom metadata)
            const isGlobalComponent = incomingNode.data?.custom?.isGlobal;

            // Return true only if it's a global component
            return isGlobalComponent;
        },
        // Only allow one child in global context
        canMoveIn: (incomingNodes: any[], self: any) => {
            // Get the current node's information to check existing children
            const existingChildren = self.data.nodes || [];

            // Check if there's already a global component among existing children
            for (const nodeId of existingChildren) {
                const node = self.relatedContext.query.node(nodeId).get();
                if (node?.data?.custom?.isGlobal) {
                    return false; // Already has a global component
                }
            }

            // Allow adding if it's a single global component and no other global exists
            return incomingNodes.length === 1 && incomingNodes[0].data?.custom?.isGlobal;
        },
        canMoveOut: () => {
            // Allow moving out (deleting) components
            return true;
        },
    },
};
