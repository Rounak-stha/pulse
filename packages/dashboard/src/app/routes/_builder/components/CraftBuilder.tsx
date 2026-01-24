import { Canvas } from '@/vdb/components/builder/cavnas/index.js';
import { Editor } from '@craftjs/core';
import React, { useState } from 'react';

import { DesignSystemProvider } from '@/builder-blocks/design-system/context.js';
import { BuilderComponents } from '@/vdb/components/builder/index.js';
import { LeftSidebar } from '@/vdb/components/builder/sidebar/left.js';
import { RightSidebar } from '@/vdb/components/builder/sidebar/right.js';
import { Toolbar } from '@/vdb/components/builder/toolbar/index.js';
import { DeviceType } from '@/vdb/components/builder/types.js';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/vdb/components/ui/sheet.js';
import { useIsMobile } from '@/vdb/hooks/use-mobile.js';
import { BuilderProvider, useBuilder } from '@/vdb/providers/builder.js';

interface BuilderEditorProps {
    pageId: string;
}

export const BuilderEditor: React.FC<BuilderEditorProps> = ({ pageId }) => {
    return (
        <div className="h-screen flex flex-col bg-background text-foreground">
            <Editor resolver={BuilderComponents} onRender={({ render }) => render}>
                <WrappedEditor pageId={pageId} />
            </Editor>
        </div>
    );
};

function WrappedEditor({ pageId }: BuilderEditorProps) {
    return (
        <BuilderProvider pageId={pageId}>
            <DesignSystemProvider initialPresetId="default">
                <InnerBuilderWrapper />
            </DesignSystemProvider>
        </BuilderProvider>
    );
}

function InnerBuilderWrapper() {
    const [device, setDevice] = useState<DeviceType>('desktop');
    const { mode } = useBuilder();
    const isMobile = useIsMobile();
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

    // Auto-switch device preview on mobile
    React.useEffect(() => {
        if (isMobile) {
            setDevice('mobile');
        }
    }, [isMobile]);

    return (
        <>
            <Toolbar
                device={device}
                setDevice={setDevice}
                onOpenLeftSidebar={() => setLeftSidebarOpen(true)}
                onOpenRightSidebar={() => setRightSidebarOpen(true)}
            />
            <div className="flex flex-1 overflow-hidden relative">
                {isMobile ? (
                    <>
                        <Sheet open={leftSidebarOpen} onOpenChange={setLeftSidebarOpen}>
                            <SheetContent side="left" className="p-0 w-[80vw] sm:w-[380px] gap-0">
                                <SheetHeader>
                                    <SheetTitle className="sr-only">Left Sidebar</SheetTitle>
                                    <SheetDescription className="sr-only">
                                        Contains components and settings for the builder.
                                    </SheetDescription>
                                </SheetHeader>
                                <LeftSidebar onClose={() => setLeftSidebarOpen(false)} />
                            </SheetContent>
                        </Sheet>
                        <Canvas device={device} />
                        <Sheet open={rightSidebarOpen} onOpenChange={setRightSidebarOpen}>
                            <SheetContent
                                side="right"
                                className="p-0 w-[80vw] sm:w-[380px] sm:max-w-none gap-0"
                            >
                                <SheetHeader>
                                    <SheetTitle className="sr-only">Right Sidebar</SheetTitle>
                                    <SheetDescription className="sr-only">
                                        Settings for the selected component.
                                    </SheetDescription>
                                </SheetHeader>
                                <RightSidebar />
                            </SheetContent>
                        </Sheet>
                    </>
                ) : (
                    <>
                        {mode == 'edit' && <LeftSidebar />}
                        <Canvas device={device} />
                        {mode == 'edit' && <RightSidebar />}
                    </>
                )}
            </div>
        </>
    );
}
