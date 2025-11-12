import { useBuilderPage } from '@/vdb/framework/page/use-builder-page.js';
import { useEditor } from '@craftjs/core';
import {
    EyeIcon,
    MonitorIcon,
    Redo2Icon,
    SaveIcon,
    SmartphoneIcon,
    TabletIcon,
    Undo2Icon,
} from 'lucide-react';
import { useCallback } from 'react';
import { DeviceType } from '../types.js';
import { PageSwitcher } from './page-switcher.js';

interface ToolbarInnerProps {
    device: DeviceType;
    setDevice: (device: DeviceType) => void;
    context: ReturnType<typeof useBuilderPage>;
}

export const Toolbar: React.FC<ToolbarInnerProps> = ({ device, setDevice, context }) => {
    const { actions, enabled } = useEditor(state => ({
        enabled: state.options.enabled,
    }));

    const { createPage, save, page, changePage } = context;

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
                    <span className="text-sm">{enabled ? 'Preview' : 'Edit'}</span>
                </button>

                <button
                    onClick={() => save()}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
                >
                    <SaveIcon className="w-4 h-4 inline mr-2" />
                    Save
                </button>
            </div>
        </div>
    );
};
