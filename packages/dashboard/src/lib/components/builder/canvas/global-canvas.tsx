import { useIsMobile } from '@/vdb/hooks/use-mobile.js';
import { CANVAS_ROOT_ID } from '@/vdb/lib/builder.js';
import { Element, Frame } from '@craftjs/core';
import { GlobalRootContainer } from '../blocks/atoms/global-root-container/index.js';
import { DeviceType } from '../types.js';

interface GlobalCanvasProps {
    device: DeviceType;
}

export const GlobalCanvas: React.FC<GlobalCanvasProps> = ({ device }) => {
    const isMobile = useIsMobile();
    const widthMap: Record<DeviceType, string> = {
        desktop: '100%',
        tablet: '768px',
        mobile: '375px',
    };
    return (
        <div className={`flex-1 bg-muted/30 overflow-auto ${isMobile ? 'p-2' : 'p-8'}`}>
            <div
                className="mx-auto ring ring-border rounded-xl overflow-hidden bg-background transition-all"
                style={{ width: isMobile ? '100%' : widthMap[device], minHeight: '100vh' }}
                id={CANVAS_ROOT_ID}
            >
                <Frame>
                    <Element id="RootContainer" is={GlobalRootContainer} canvas>
                        {null}
                    </Element>
                </Frame>
            </div>
        </div>
    );
};
