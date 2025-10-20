import { useEffect, useMemo, useState } from 'react';

/**
 * Settings Panel Component
 * Displays and edits settings for the selected section
 */
export default function SettingsPanel({ builder, registry }) {
    const [selectedSection, setSelectedSection] = useState(null);
    const [settings, setSettings] = useState({});
    const [activeTab, setActiveTab] = useState('Content');

    useEffect(() => {
        if (!builder) return;

        const handleSelectionChange = () => {
            const section = builder.getSelectedSection();
            setSelectedSection(section);
            if (section) {
                setSettings(section.settings || {});
            }
        };

        builder.on('selectionChanged', handleSelectionChange);
        handleSelectionChange();

        return () => {
            builder.off('selectionChanged', handleSelectionChange);
        };
    }, [builder]);

    const sectionDefinition = useMemo(() => {
        if (!selectedSection || !registry) return null;
        return registry.get(selectedSection.type);
    }, [selectedSection, registry]);

    const schema = useMemo(() => {
        return sectionDefinition?.schema || [];
    }, [sectionDefinition]);

    const categories = useMemo(() => {
        const cats = new Set(schema.map(field => field.category || 'General'));
        return Array.from(cats);
    }, [schema]);

    const fieldsByCategory = useMemo(() => {
        return schema.filter(field => (field.category || 'General') === activeTab);
    }, [schema, activeTab]);

    const handleSettingChange = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);

        if (builder && selectedSection) {
            builder.updateSectionSettings(selectedSection.id, { [key]: value });
        }
    };

    const renderField = field => {
        const value = settings[field.key] ?? field.default;

        switch (field.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={e => handleSettingChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                );

            case 'textarea':
                return (
                    <textarea
                        value={value || ''}
                        onChange={e => handleSettingChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full px-3 py-2 border  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                );

            case 'number':
                return (
                    <input
                        type="number"
                        value={value ?? ''}
                        onChange={e => handleSettingChange(field.key, Number(e.target.value))}
                        min={field.min}
                        max={field.max}
                        className="w-full px-3 py-2 border  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                );

            case 'slider':
                return (
                    <div>
                        <input
                            type="range"
                            value={value ?? field.default ?? field.min}
                            onChange={e => handleSettingChange(field.key, Number(e.target.value))}
                            min={field.min}
                            max={field.max}
                            step={field.step || 1}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{field.min}</span>
                            <span className="font-semibold text-gray-900">
                                {value ?? field.default ?? field.min}
                            </span>
                            <span>{field.max}</span>
                        </div>
                    </div>
                );

            case 'toggle':
            case 'boolean':
                return (
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={value ?? false}
                            onChange={e => handleSettingChange(field.key, e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after: after: after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                );

            case 'select':
                const options = Array.isArray(field.options) ? field.options : [];
                return (
                    <select
                        value={value || ''}
                        onChange={e => handleSettingChange(field.key, e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                    >
                        {options.map(option => {
                            const optionValue = typeof option === 'object' ? option.value : option;
                            const optionLabel = typeof option === 'object' ? option.label : option;
                            return (
                                <option key={optionValue} value={optionValue}>
                                    {optionLabel}
                                </option>
                            );
                        })}
                    </select>
                );

            case 'color':
                return (
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={value || '#000000'}
                            onChange={e => handleSettingChange(field.key, e.target.value)}
                            className="h-10 w-20 border  rounded-lg cursor-pointer"
                        />
                        <input
                            type="text"
                            value={value || '#000000'}
                            onChange={e => handleSettingChange(field.key, e.target.value)}
                            className="flex-1 px-3 py-2 border  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        />
                    </div>
                );

            case 'image':
                return (
                    <div>
                        <input
                            type="text"
                            value={value || ''}
                            onChange={e => handleSettingChange(field.key, e.target.value)}
                            placeholder="Enter image URL"
                            className="w-full px-3 py-2 border  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                        />
                        {value && (
                            <div className="mt-2 rounded-lg overflow-hidden border ">
                                <img src={value} alt="Preview" className="w-full h-32 object-cover" />
                            </div>
                        )}
                    </div>
                );

            default:
                return (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={e => handleSettingChange(field.key, e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                );
        }
    };

    if (!selectedSection) {
        return (
            <div className="w-80 h-full border-l  flex items-center justify-center">
                <div className="text-center px-6 py-8">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Section Selected</h3>
                    <p className="text-sm text-gray-500">
                        Select a section from the canvas to edit its settings
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-80 h-full border-l flex flex-col">
            <div className="p-4 border-b ">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {sectionDefinition?.name || 'Section Settings'}
                    </h2>
                    <button
                        onClick={() => builder?.deselectSection()}
                        className="p-1 rounded transition-colors"
                        title="Close"
                    >
                        <svg
                            className="w-5 h-5 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <p className="text-sm text-gray-500">{sectionDefinition?.category}</p>
            </div>

            {categories.length > 1 && (
                <div className="border-b">
                    <div className="flex overflow-x-auto">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveTab(category)}
                                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === category ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-6">
                    {fieldsByCategory.map(field => (
                        <div key={field.key}>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {renderField(field)}
                            {field.help && <p className="mt-1 text-xs text-gray-500">{field.help}</p>}
                        </div>
                    ))}
                    {fieldsByCategory.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <p>No settings in this category</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 border-t  space-y-2">
                <button
                    onClick={() => {
                        if (builder && confirm('Duplicate this section?')) {
                            builder.duplicateSection(selectedSection.id);
                        }
                    }}
                    className="w-full px-4 py-2 text-muted-foreground rounded-lg hover:font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                    </svg>
                    Duplicate Section
                </button>
                <button
                    onClick={() => {
                        if (builder && confirm('Delete this section?')) {
                            builder.deleteSection(selectedSection.id);
                        }
                    }}
                    className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                    Delete Section
                </button>
            </div>
        </div>
    );
}
