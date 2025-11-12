import { RootContainer } from '@/vdb/components/builder/blocks/atoms/root-container/index.js';
import { Element, Frame } from '@craftjs/core';
import { DeviceType } from '../types.js';

interface CanvasProps {
    device: DeviceType;
}

export const Canvas: React.FC<CanvasProps> = ({ device }) => {
    const widthMap: Record<DeviceType, string> = {
        desktop: '100%',
        tablet: '768px',
        mobile: '375px',
    };

    return (
        <div className="flex-1 bg-muted/30 overflow-auto p-8">
            <div
                className="mx-auto bg-background transition-all"
                style={{ width: widthMap[device], minHeight: '100vh' }}
            >
                {/* Wrap Frame with DesignSystemProvider */}

                <Frame>
                    <Element id="canvas-root" is={RootContainer} canvas></Element>
                </Frame>
            </div>
        </div>
    );
};
