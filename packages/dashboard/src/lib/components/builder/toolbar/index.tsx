import { useBuilder } from '@/vdb/providers/builder.js';
import { useEditor } from '@craftjs/core';
import {
    ArrowLeftIcon,
    EyeIcon,
    MonitorIcon,
    Redo2Icon,
    SaveIcon,
    SendIcon,
    SmartphoneIcon,
    TabletIcon,
    Undo2Icon,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from '../../ui/button.js';
import { DeviceType } from '../types.js';
import { CreatePageDialog } from './create-page-dialog.js';
import { PageSwitcher } from './page-switcher.js';
import { useNavigate } from '@tanstack/react-router';

interface ToolbarInnerProps {
    device: DeviceType;
    setDevice: (device: DeviceType) => void;
    onOpenLeftSidebar?: () => void;
    onOpenRightSidebar?: () => void;
}

const REGION_LABELS: Record<string, string> = {
    header: 'Header',
    footer: 'Footer',
};

export const Toolbar: React.FC<ToolbarInnerProps> = ({
    device,
    setDevice,
    onOpenLeftSidebar,
    onOpenRightSidebar,
}) => {
    const [newPageDialogOpen, setNewPageDialogOpen] = useState(false);
    const navigate = useNavigate();
    const builderContext = useBuilder();
    const { actions, enabled } = useEditor(state => ({
        enabled: state.options.enabled,
    }));

    const { createPage, save, page, changePage, mode, changeMode, publish, isGlobal, region } = builderContext;
    const { selected } = useEditor(state => {
        const [currentNodeId] = state.events.selected;
        return { selected: currentNodeId };
    });

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
    }, [actions, mode, changeMode]);

    const handleCreatePage = async (input: { name: string; slug: string; description?: string }) => {
        await createPage(input); // navigate if page exists else no
        setNewPageDialogOpen(false);
    };

    const handleSave = async () => {
        if (!page) setNewPageDialogOpen(true);
        else save();
    };

    const handlePublish = async () => {
        if (!page) setNewPageDialogOpen(true);
        else publish();
    };

    // For global context, use different navigation and labels
    const isGlobalContext = isGlobal;
    const regionLabel = isGlobalContext && region ? REGION_LABELS[region] || region : null;

    return (
        <div className="h-14 bg-background border-b border-border flex items-center justify-between px-4 gap-4">
            <div className="flex items-center gap-4">
                {/* Mobile Left Sidebar Toggle */}
                <button
                    onClick={onOpenLeftSidebar}
                    className="md:hidden p-2 hover:bg-muted rounded"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5"
                    >
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <line x1="9" y1="3" x2="9" y2="21" />
                    </svg>
                </button>

                {isGlobalContext ? (
                    <>
                        <button
                            onClick={() => navigate({ to: '/dashboard/builder' })}
                            className="p-2 hover:bg-muted rounded"
                            title="Back to pages"
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground uppercase">Global</span>
                            <span className="text-sm font-semibold">{regionLabel}</span>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-sm font-semibold text-foreground hidden sm:block">Builder</h1>
                        <PageSwitcher
                            currentPage={page}
                            onPageChange={changePage}
                            openCreatePageDialog={() => setNewPageDialogOpen(true)}
                        />
                    </>
                )}
            </div>

            <div className="flex flex-1 items-center justify-end gap-2">
                <div className="flex-1 justify-center hidden md:flex">
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

                <div className="h-6 w-px bg-border hidden md:block" />

                <div className="hidden md:flex items-center gap-1">
                    <button onClick={handleUndo} className="p-2 hover:bg-muted rounded">
                        <Undo2Icon className="w-4 h-4" />
                    </button>
                    <button onClick={handleRedo} className="p-2 hover:bg-muted rounded">
                        <Redo2Icon className="w-4 h-4" />
                    </button>
                </div>

                <div className="h-6 w-px bg-border hidden md:block" />

                <button
                    onClick={togglePreview}
                    className="px-3 py-2 hover:bg-muted rounded hidden md:flex items-center gap-2"
                >
                    <EyeIcon className="w-4 h-4" />
                    <span className="text-sm">{mode == 'edit' ? 'Preview' : 'Edit'}</span>
                </button>

                <div className="flex items-center gap-2">
                    <Button onClick={save} size="sm" variant="outline" className="hidden sm:flex">
                        <SaveIcon className="w-4 h-4 inline sm:mr-2" />
                        <span className="hidden sm:inline">Save</span>
                    </Button>
                    <Button onClick={publish} size="sm" className="hidden sm:flex">
                        <SendIcon className="w-4 h-4 inline sm:mr-2" />
                        <span className="hidden sm:inline">Publish</span>
                    </Button>
                     {/* Mobile Save/Publish (Simplified or just Icons if space is tight) */}
                     <Button onClick={save} size="icon" variant="ghost" className="sm:hidden">
                        <SaveIcon className="w-4 h-4" />
                    </Button>
                </div>

                 {/* Mobile Right Sidebar Toggle (Only if something is selected) */}
                 {selected && (
                    <button
                        onClick={onOpenRightSidebar}
                        className="md:hidden p-2 hover:bg-muted rounded ml-2"
                    >
                         <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                        >
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                            <line x1="15" y1="3" x2="15" y2="21" />
                        </svg>
                    </button>
                 )}
            </div>
            
            {!isGlobalContext && (
                <CreatePageDialog
                    open={newPageDialogOpen}
                    onOpenChange={setNewPageDialogOpen}
                    onSubmit={handleCreatePage}
                />
            )}
        </div>
    );
};
