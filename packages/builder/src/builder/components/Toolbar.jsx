import { useEffect, useState } from 'react';

/**
 * Toolbar Component
 * Top toolbar with undo/redo, preview, save actions
 */
export default function Toolbar({ builder }) {
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [mode, setMode] = useState('edit');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!builder) return;

        // Update undo/redo state
        const updateUndoRedo = () => {
            setCanUndo(builder.canUndo());
            setCanRedo(builder.canRedo());
        };

        // Listen for state changes
        const unsubscribe = builder.store.subscribe(() => {
            updateUndoRedo();
        });

        // Listen for mode changes
        const handleModeChange = ({ mode: newMode }) => {
            setMode(newMode);
        };

        builder.on('modeChanged', handleModeChange);

        // Initial state
        updateUndoRedo();
        setMode(builder.getMode());

        return () => {
            unsubscribe();
            builder.off('modeChanged', handleModeChange);
        };
    }, [builder]);

    const handleUndo = () => {
        if (builder && canUndo) {
            builder.undo();
        }
    };

    const handleRedo = () => {
        if (builder && canRedo) {
            builder.redo();
        }
    };

    const handleTogglePreview = () => {
        if (builder) {
            builder.toggleMode();
        }
    };

    const handleSave = async () => {
        if (!builder || isSaving) return;

        setIsSaving(true);
        try {
            const data = builder.save();
            // In a real app, send to backend
            console.log('Saved:', data);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Show success message (you'd use a toast library in production)
            alert('Page saved successfully!');
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save page');
        } finally {
            setIsSaving(false);
        }
    };

    const handleClear = () => {
        if (builder && confirm('Are you sure you want to clear all sections?')) {
            builder.clearSections();
        }
    };

    const handleExport = () => {
        if (builder) {
            const data = builder.export();
            console.log('Export:', data);

            // Download as JSON
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `page-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const getKeyboardShortcut = () => {
        const isMac = navigator.platform.includes('Mac');
        return isMac ? '⌘' : 'Ctrl';
    };

    return (
        <div className="h-16  border-b  flex items-center justify-between px-6">
            {/* Left Section - Logo */}
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-muted-foreground">Page Builder</h1>
                <div className="h-6 w-px bg-gray-300" />
                <span className="text-sm text-muted-foreground">Untitled Page</span>
            </div>

            {/* Center Section - Actions */}
            <div className="flex items-center gap-2">
                {/* Undo */}
                <button
                    onClick={handleUndo}
                    disabled={!canUndo}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title={`Undo (${getKeyboardShortcut()}+Z)`}
                >
                    <svg
                        className="w-5 h-5 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                        />
                    </svg>
                </button>

                {/* Redo */}
                <button
                    onClick={handleRedo}
                    disabled={!canRedo}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title={`Redo (${getKeyboardShortcut()}+Shift+Z)`}
                >
                    <svg
                        className="w-5 h-5 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
                        />
                    </svg>
                </button>

                <div className="h-6 w-px bg-gray-300 mx-2" />

                {/* Preview Mode Toggle */}
                <button
                    onClick={handleTogglePreview}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        mode === 'preview'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-muted-foreground hover:bg-gray-200'
                    }`}
                    title={`Toggle Preview (${getKeyboardShortcut()}+P)`}
                >
                    {mode === 'preview' ? (
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                            <span>Preview</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                            <span>Edit</span>
                        </div>
                    )}
                </button>

                <div className="h-6 w-px bg-gray-300 mx-2" />

                {/* Clear */}
                <button
                    onClick={handleClear}
                    className="px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors"
                    title="Clear all sections"
                >
                    Clear All
                </button>

                {/* Export */}
                <button
                    onClick={handleExport}
                    className="px-4 py-2 rounded-lg text-muted-foreground hover:bg-gray-100 font-medium transition-colors"
                    title="Export as JSON"
                >
                    Export
                </button>
            </div>

            {/* Right Section - Save */}
            <div className="flex items-center gap-3">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSaving ? (
                        <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                                />
                            </svg>
                            <span>Save</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
