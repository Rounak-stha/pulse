import React, { createContext, useCallback, useContext, useState } from 'react';
import { getDesignSystemById } from './presets/index.js';
import { DEFAULT_SEMANTIC_MAP, DesignSystemConfig, SemanticSizeMap } from './types.js';

interface DesignSystemContextValue {
    designSystem: DesignSystemConfig;
    semanticMap: SemanticSizeMap;
    setDesignSystemById: (id: string) => void;
    setCustomDesignSystem: (config: DesignSystemConfig) => void;
}

const DesignSystemContext = createContext<DesignSystemContextValue | undefined>(undefined);

interface DesignSystemProviderProps {
    children: React.ReactNode;
    initialPresetId?: string;
    initialConfig?: DesignSystemConfig;
}

export function DesignSystemProvider({
    children,
    initialPresetId = 'default',
    initialConfig,
}: DesignSystemProviderProps) {
    const [designSystem, setDesignSystem] = useState<DesignSystemConfig>(
        initialConfig || getDesignSystemById(initialPresetId),
    );

    const [semanticMap] = useState<SemanticSizeMap>(DEFAULT_SEMANTIC_MAP);

    const setDesignSystemById = useCallback((id: string) => {
        const preset = getDesignSystemById(id);
        setDesignSystem(preset);
    }, []);

    const setCustomDesignSystem = useCallback((config: DesignSystemConfig) => {
        setDesignSystem(config);
    }, []);

    return (
        <DesignSystemContext.Provider
            value={{
                designSystem,
                semanticMap,
                setDesignSystemById,
                setCustomDesignSystem,
            }}
        >
            {children}
        </DesignSystemContext.Provider>
    );
}

export function useDesignSystem() {
    const context = useContext(DesignSystemContext);
    if (!context) {
        throw new Error('useDesignSystem must be used within DesignSystemProvider');
    }
    return context;
}
