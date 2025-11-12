import { DesignSystemConfig } from '../types.js';
import { boldDesignSystem } from './bold.js';
import { spaciousDesignSystem } from './compact.js';
import { defaultDesignSystem } from './default.js';
import { compactDesignSystem } from './spacious.js';

export const DESIGN_SYSTEM_PRESETS: DesignSystemConfig[] = [
    defaultDesignSystem,
    compactDesignSystem,
    spaciousDesignSystem,
    boldDesignSystem,
];

export function getDesignSystemById(id: string): DesignSystemConfig {
    return DESIGN_SYSTEM_PRESETS.find(preset => preset.id === id) || defaultDesignSystem;
}
