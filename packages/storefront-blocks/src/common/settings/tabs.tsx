interface SettingsTabsProps {
    tabs: Array<{ id: string; label: string }>;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    children: React.ReactNode;
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({ tabs, activeTab, setActiveTab, children }) => (
    <div>
        <div className="flex border-b border-border mb-4">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
        {children}
    </div>
);
