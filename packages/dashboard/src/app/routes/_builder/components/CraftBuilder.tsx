import { Editor } from '@craftjs/core';
import React, { useState } from 'react';

// import { RootContainer } from '@/vdb/components/builder/atoms/root-container.js';
import { DesignSystemProvider } from '@/builder-blocks/design-system/context.js';
import { Badge } from '@/vdb/components/builder/blocks/atoms/badge/index.js';
import { Button } from '@/vdb/components/builder/blocks/atoms/button/index.js';
import { Headline } from '@/vdb/components/builder/blocks/atoms/headline/index.js';
import { RootContainer } from '@/vdb/components/builder/blocks/atoms/root-container/index.js';
import { SubText } from '@/vdb/components/builder/blocks/atoms/sub-text/index.js';
import { HeroBanner } from '@/vdb/components/builder/blocks/compounds/hero/banner/index.js';
import { Canvas } from '@/vdb/components/builder/cavnas/index.js';
import { LeftSidebar } from '@/vdb/components/builder/sidebar/left.js';
import { RightSidebar } from '@/vdb/components/builder/sidebar/right.js';
import { Toolbar } from '@/vdb/components/builder/toolbar/index.js';
import { DeviceType } from '@/vdb/components/builder/types.js';
import { useBuilderPage } from '@/vdb/framework/page/use-builder-page.js';

interface BuilderEditorProps {
    pageId: string;
}

export const BuilderEditor: React.FC<BuilderEditorProps> = ({ pageId }) => {
    return (
        <div className="h-screen flex flex-col bg-background text-foreground">
            <Editor
                resolver={{
                    RootContainer,
                    HeroBanner,
                    Badge,
                    Headline,
                    SubText,
                    Button,
                }}
                onRender={({ render }) => render}
            >
                <WrappedEditor pageId={pageId} />
            </Editor>
        </div>
    );
};

function WrappedEditor({ pageId }: BuilderEditorProps) {
    const [device, setDevice] = useState<DeviceType>('desktop');
    const pageBuilderContext = useBuilderPage(pageId);

    return (
        <DesignSystemProvider initialPresetId="default">
            <Toolbar device={device} setDevice={setDevice} context={pageBuilderContext} />
            <div className="flex flex-1 overflow-hidden">
                <LeftSidebar />
                <Canvas device={device} />
                <RightSidebar />
            </div>
        </DesignSystemProvider>
    );
}
