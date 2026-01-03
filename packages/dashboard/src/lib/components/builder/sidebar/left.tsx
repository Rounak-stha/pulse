import { LayersIcon, LayoutIcon, PaletteIcon, SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import { BlocksPanel } from './blocks/index.js';
import { ThemePanel } from './theme/index.js';

type TabType = 'blocks' | 'theme' | 'pages' | 'settings';

const tabs: Array<{ id: TabType; icon: any; label: string }> = [
    { id: 'blocks', icon: LayoutIcon, label: 'Blocks' },
    { id: 'theme', icon: PaletteIcon, label: 'Theme' },
    { id: 'pages', icon: LayersIcon, label: 'Pages' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
];

export const LeftSidebar: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<TabType>('blocks');

    return (
        <div className="flex h-full bg-background border-r border-border">
            <div className="w-14 bg-muted/50 border-r border-border flex flex-col">
                {tabs.map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`p-4 hover:bg-muted ${activeTab === id ? 'bg-background border-r-2 border-primary' : ''}`}
                        title={label}
                    >
                        <Icon className="w-5 h-5" />
                    </button>
                ))}
            </div>

            <div className="w-72 p-4 overflow-y-auto">
                {activeTab === 'blocks' && <BlocksPanel onBlockAdd={onClose} />}

                {activeTab === 'theme' && <ThemePanel />}

                {activeTab === 'pages' && (
                    <div>
                        <h3 className="font-semibold text-sm text-foreground mb-3">Pages</h3>
                        <div className="space-y-1">
                            <div className="p-2 bg-accent rounded text-sm">Home</div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div>
                        <h3 className="font-semibold text-sm text-foreground mb-3">Builder Settings</h3>
                        <p className="text-xs text-muted-foreground">Global builder configuration</p>
                    </div>
                )}
            </div>
        </div>
    );
};
