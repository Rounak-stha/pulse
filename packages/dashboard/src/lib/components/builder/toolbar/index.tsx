import { useBuilder } from '@/vdb/providers/builder.js';
import { useEditor } from '@craftjs/core';
import {
    EyeIcon,
    MonitorIcon,
    Redo2Icon,
    SaveIcon,
    SendIcon,
    SmartphoneIcon,
    TabletIcon,
    Undo2Icon,
} from 'lucide-react';
import { useCallback } from 'react';
import { Button } from '../../ui/button.js';
import { DeviceType } from '../types.js';
import { PageSwitcher } from './page-switcher.js';

interface ToolbarInnerProps {
    device: DeviceType;
    setDevice: (device: DeviceType) => void;
}

export const Toolbar: React.FC<ToolbarInnerProps> = ({ device, setDevice }) => {
    const builderContext = useBuilder();
    const { actions, enabled } = useEditor(state => ({
        enabled: state.options.enabled,
    }));

    const { createPage, save, page, changePage, mode, changeMode, publish } = builderContext;

    const handleUndo = useCallback(() => {
        if (actions?.history?.undo) {
            actions.history.undo();
        }
    }, [actions]);

    const handleRedo = useCallback(() => {
        if (actions?.history?.redo) {
            actions.history.redo();
        }
    }, [actions]);

    const togglePreview = useCallback(() => {
        if (mode == 'edit') changeMode('preview');
        else changeMode('edit');
        actions.setOptions((opts: any) => {
            opts.enabled = !opts.enabled;
        });
    }, [actions]);

    return (
        <div className="h-14 bg-background border-b border-border flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
                <h1 className="text-sm font-semibold text-foreground">Builder</h1>
                <PageSwitcher currentPage={page} onCreatePage={createPage} onPageChange={changePage} />
            </div>

            <div className="flex flex-1 items-center gap-2">
                <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-2 bg-accent/80 rounded-md p-1">
                        {[
                            { icon: MonitorIcon, value: 'desktop' as DeviceType },
                            { icon: TabletIcon, value: 'tablet' as DeviceType },
                            { icon: SmartphoneIcon, value: 'mobile' as DeviceType },
                        ].map(({ icon: Icon, value }) => (
                            <button
                                key={value}
                                onClick={() => setDevice(value)}
                                className={`p-2 rounded ${device === value ? 'bg-background shadow-sm' : 'hover:bg-background'}`}
                            >
                                <Icon className="w-4 h-4" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-6 w-px bg-border" />

                <button onClick={handleUndo} className="p-2 hover:bg-muted rounded">
                    <Undo2Icon className="w-4 h-4" />
                </button>
                <button onClick={handleRedo} className="p-2 hover:bg-muted rounded">
                    <Redo2Icon className="w-4 h-4" />
                </button>

                <div className="h-6 w-px bg-border" />

                <button
                    onClick={togglePreview}
                    className="px-3 py-2 hover:bg-muted rounded flex items-center gap-2"
                >
                    <EyeIcon className="w-4 h-4" />
                    <span className="text-sm">{mode == 'edit' ? 'Preview' : 'Edit'}</span>
                </button>

                <Button onClick={() => save()} size="sm" variant="outline">
                    <SaveIcon className="w-4 h-4 inline" />
                    Save
                </Button>
                <Button onClick={() => publish()} size="sm">
                    <SendIcon className="w-4 h-4 inline" />
                    Publish
                </Button>
            </div>
        </div>
    );
};
