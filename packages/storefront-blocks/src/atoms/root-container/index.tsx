import { RootContainerProps } from './types.js';

export function RootContainer({ children, ref, theme }: RootContainerProps) {
    return (
        <div ref={ref} style={theme ? theme : {}} className="w-full h-full min-h-screen" data-text={true}>
            {children}

            {/* Empty state placeholder */}
            {!children && (
                <div className="pt-96 flex items-center justify-center pointer-events-none">
                    <div className="text-center space-y-3">
                        <div className="text-gray-400 text-lg font-medium">Drop components here hahaha</div>
                        <div className="text-gray-300 text-sm">
                            Drag and drop blocks from the builder to start building
                        </div>
                        <div className="flex justify-center gap-2 text-gray-300">
                            <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded" />
                            <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded" />
                            <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
