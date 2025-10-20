import { useEffect, useRef, useState } from 'react';

import Builder from '../core/Builder.js';
import DataProvider from '../core/DataProvider.js';
import SectionRegistry from '../core/SectionRegistry.js';
import DragDropManager from '../interactions/DragDropManager.js';
import KeyboardManager from '../interactions/KeyboardManager.js';
import SelectionManager from '../interactions/SelectionManager.js';

import '../styles/builder.css';

// Import sections
import heroSection from '../sections/hero.js';
import productGridSection from '../sections/productGrid.js';

// Import components
import SettingsPanel from './SettingsPanel';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';

// Register sections
SectionRegistry.register(heroSection);
SectionRegistry.register(productGridSection);

/**
 * Builder Page Component
 * Main page that orchestrates the entire builder
 */
export default function BuilderPage() {
    const canvasRef = useRef(null);
    const builderRef = useRef(null);
    const selectionManagerRef = useRef(null);
    const keyboardManagerRef = useRef(null);
    const dragDropManagerRef = useRef(null);
    const dataProviderRef = useRef(null);

    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState(null);

    // Ref to handle effect call on strict mode (builder.init is async so ref is not populated with vaue to be destroyed in the cleanup)
    const initialEffectCallRef = useRef(true);

    useEffect(() => {
        if (!initialEffectCallRef.current) return;

        initialEffectCallRef.current = false;

        const initBuilder = async () => {
            try {
                console.log('Initializing builder...');

                // 1. Create data provider
                const dataProvider = new DataProvider({
                    useMockData: true,
                    vendureEndpoint: '/shop-api',
                });
                dataProviderRef.current = dataProvider;

                // 2. Create builder instance
                const builder = new Builder(canvasRef.current, {
                    reactivityAdapter: 'petite-vue',
                    autoSave: false,
                });

                // Set data provider on builder
                builder.dataProvider = dataProvider;

                // 3. Initialize builder
                await builder.init();
                builderRef.current = builder;

                // 4. Create interaction managers
                const selectionManager = new SelectionManager(canvasRef.current, builder.store);
                selectionManagerRef.current = selectionManager;

                const keyboardManager = new KeyboardManager(builder.store, builder);
                keyboardManagerRef.current = keyboardManager;

                const dragDropManager = new DragDropManager(canvasRef.current, builder.store, builder);
                dragDropManagerRef.current = dragDropManager;

                // 5. Enable interactions
                selectionManager.enable();
                keyboardManager.enable();
                dragDropManager.enable();

                // 6. Set up event listeners
                setupEventListeners(builder, selectionManager, dragDropManager);

                // 7. Load saved state if exists
                const savedState = localStorage.getItem('builder-state');
                if (savedState) {
                    try {
                        const data = JSON.parse(savedState);
                        builder.load(data);
                        console.log('Loaded saved state');
                    } catch (err) {
                        console.error('Failed to load saved state:', err);
                    }
                } else {
                    // Add default sections if no saved state
                    builder.addSection('hero', {
                        headline: 'Welcome to Your Store',
                        subtext: 'Start building your amazing storefront',
                        ctaText: 'Get Started',
                    });
                    builder.addSection('product-grid', {
                        title: 'Featured Products',
                        columns: 4,
                    });
                    console.log('Added default sections');
                }

                // 8. Expose to window for debugging
                if (process.env.NODE_ENV === 'development') {
                    window.builder = builder;
                    window.selectionManager = selectionManager;
                    window.keyboardManager = keyboardManager;
                    window.dragDropManager = dragDropManager;
                    window.dataProvider = dataProvider;
                    window.SectionRegistry = SectionRegistry;
                }

                setIsInitialized(true);
                console.log('Builder initialized successfully');
            } catch (err) {
                console.error('Failed to initialize builder:', err);
                setError(err.message);
            }
        };

        initBuilder();

        // Cleanup
        return () => {
            console.log('Cleaning up builder...');

            if (keyboardManagerRef.current) {
                console.log('Destroying Keyboard');
                keyboardManagerRef.current.destroy();
            }
            if (dragDropManagerRef.current) {
                console.log('Destroying DropManager');
                dragDropManagerRef.current.destroy();
            }
            if (selectionManagerRef.current) {
                console.log('Destroying SelectionManager');
                selectionManagerRef.current.destroy();
            }
            if (builderRef.current) {
                console.log('Destroying Builder');
                builderRef.current.destroy();
            }
        };
    }, []);

    const setupEventListeners = (builder, selectionManager, dragDropManager) => {
        // Auto-save on changes (debounced)
        let saveTimeout;
        builder.on('sectionAdded', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                const data = builder.save();
                localStorage.setItem('builder-state', JSON.stringify(data));
            }, 1000);
        });

        builder.on('sectionUpdated', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                const data = builder.save();
                localStorage.setItem('builder-state', JSON.stringify(data));
            }, 1000);
        });

        // Log events in development
        if (process.env.NODE_ENV === 'development') {
            builder.on('sectionAdded', ({ section }) => {
                console.log('Section added:', section.type);
            });

            builder.on('sectionRemoved', ({ section }) => {
                console.log('Section removed:', section.type);
            });

            dragDropManager.on('drop', ({ sourceSectionId, targetSectionId }) => {
                console.log('Section dropped:', sourceSectionId, '->', targetSectionId);
            });
        }
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Initialize Builder</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Toolbar */}
            <Toolbar builder={builderRef.current} />

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <Sidebar builder={builderRef.current} registry={SectionRegistry} />

                {/* Canvas */}
                <div className="flex-1 overflow-auto p-4">
                    <div ref={canvasRef} id="builder-canvas" className="min-h-full" />
                </div>

                {/* Settings Panel */}
                <SettingsPanel builder={builderRef.current} registry={SectionRegistry} />
            </div>

            {/* Mode Indicator */}
            <ModeIndicator builder={builderRef.current} />
        </div>
    );
}

/**
 * Mode Indicator Component
 * Shows current mode (edit/preview) in bottom right
 */
function ModeIndicator({ builder }) {
    const [mode, setMode] = useState('edit');

    useEffect(() => {
        if (!builder) return;

        const handleModeChange = ({ mode: newMode }) => {
            setMode(newMode);
        };

        builder.on('modeChanged', handleModeChange);
        setMode(builder.getMode());

        return () => {
            builder.off('modeChanged', handleModeChange);
        };
    }, [builder]);

    return (
        <div className={`mode-indicator ${mode === 'preview' ? 'preview-mode' : 'edit-mode'}`}>
            <span className="mode-indicator-dot"></span>
            <span>{mode === 'preview' ? 'Preview Mode' : 'Edit Mode'}</span>
        </div>
    );
}
