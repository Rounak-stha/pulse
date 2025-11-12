import { useEditor } from '@craftjs/core';
import { Trash2Icon } from 'lucide-react';
import { useCallback } from 'react';

export const RightSidebar: React.FC = () => {
    const { selected } = useEditor(state => {
        const [currentNodeId] = state.events.selected;
        return { selected: currentNodeId };
    });

    return (
        <div className="w-80 bg-background border-l border-border overflow-y-auto">
            <div className="p-4">
                {selected ? (
                    <SelectedNodeSettings />
                ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                        Select a component to edit
                    </div>
                )}
            </div>
        </div>
    );
};

const SelectedNodeSettings: React.FC = () => {
    const { actions, selected } = useEditor((state, query) => {
        const [currentNodeId] = state.events.selected;
        const node = currentNodeId && query.node(currentNodeId).get();
        let selected;

        if (node) {
            selected = {
                id: node.id,
                displayName: node.data.displayName,
                SettingsComponent: node.related && node.related.settings,
            };
        }
        return {
            selected,
        };
    });

    const handleDelete = useCallback(() => {
        if (selected?.id) actions.delete(selected.id);
    }, [actions, selected]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{selected?.displayName}</h3>
                <button
                    onClick={handleDelete}
                    className="p-1 hover:bg-destructive/10 rounded text-destructive"
                >
                    <Trash2Icon className="w-4 h-4" />
                </button>
            </div>
            {selected?.SettingsComponent && <selected.SettingsComponent />}
        </div>
    );
};
