import mitt from 'mitt';
import PetiteVueAdapter from '../reactivity/PetiteVueAdapter.js';
import useBuilderStore from '../state/builderStore.js';
import CanvasManager from './CanvasManager.js';
import SectionRegistry from './SectionRegistry.js';

/**
 * Builder - Main orchestrator for the website builder
 * Coordinates all subsystems and provides high-level API
 */
class Builder {
    constructor(canvasElement, options = {}) {
        if (!canvasElement) {
            throw new Error('Canvas element is required');
        }

        this.canvas = canvasElement;
        this.options = {
            reactivityAdapter: 'petite-vue',
            autoSave: false,
            autoSaveInterval: 30000, // 30 seconds
            ...options,
        };

        // Event emitter for builder events
        this.emitter = mitt();

        // Subsystems
        this.store = null;
        this.reactivityAdapter = null;
        this.canvasManager = null;
        this.dataProvider = null;

        // State
        this.initialized = false;
        this.unsubscribe = null;
        this.autoSaveTimer = null;

        console.info('Builder instance created');
    }

    /**
     * Initialize the builder and all subsystems
     */
    async init() {
        if (this.initialized) {
            console.warn('Builder already initialized');
            return;
        }

        try {
            console.info('Initializing builder...');

            // Initialize reactivity adapter
            this.reactivityAdapter = this.createReactivityAdapter();

            // Initialize canvas manager
            this.canvasManager = new CanvasManager(this.canvas, this.reactivityAdapter);

            // Get store reference
            this.store = useBuilderStore;

            // Subscribe to state changes
            this.subscribeToStateChanges();

            // Set initial mode
            this.canvasManager.setMode(this.store.getState().mode);

            // Render initial sections if any
            const initialSections = this.store.getState().sections;
            if (initialSections.length > 0) {
                this.renderAllSections();
            }

            // Setup auto-save if enabled
            if (this.options.autoSave) {
                this.setupAutoSave();
            }

            this.initialized = true;
            this.emit('initialized');

            console.info('Builder initialized successfully');
        } catch (error) {
            console.error('Error initializing builder:', error);
            throw error;
        }
    }

    /**
     * Create reactivity adapter based on options
     * @returns {ReactivityAdapter}
     */
    createReactivityAdapter() {
        const adapterType = this.options.reactivityAdapter;

        switch (adapterType) {
            case 'petite-vue':
                return new PetiteVueAdapter();

            // Future: Add other adapters
            // case 'alpine':
            //   return new AlpineAdapter();

            default:
                console.warn(`Unknown adapter type: ${adapterType}, defaulting to petite-vue`);
                return new PetiteVueAdapter();
        }
    }

    /**
     * Subscribe to state changes and sync canvas
     */
    subscribeToStateChanges() {
        console.log('Subscribing to state changes');
        this.unsubscribe = this.store.subscribe((state, prevState) => {
            this.handleStateChange(state, prevState);
        });
    }

    /**
     * Handle state changes and update canvas accordingly
     * @param {Object} state - Current state
     * @param {Object} prevState - Previous state
     */
    handleStateChange(state, prevState) {
        console.log('Handling State Change', { state, prevState });
        const startTime = performance.now();

        try {
            // Handle mode changes
            if (state.mode !== prevState.mode) {
                this.canvasManager.setMode(state.mode);
                this.emit('modeChanged', { mode: state.mode });
            }

            // Handle section changes
            this.syncSections(state.sections, prevState.sections);

            // Handle selection changes
            if (state.selectedSectionId !== prevState.selectedSectionId) {
                this.handleSelectionChange(state.selectedSectionId, prevState.selectedSectionId);
            }

            const duration = performance.now() - startTime;
            console.debug(`State sync completed in ${duration.toFixed(2)}ms`);
        } catch (error) {
            console.error('Error handling state change:', error);
        }
    }

    /**
     * Sync sections between state and canvas
     * @param {Array} sections - Current sections
     * @param {Array} prevSections - Previous sections
     */
    syncSections(sections, prevSections) {
        const currentIds = new Set(sections.map(s => s.id));
        const prevIds = new Set(prevSections.map(s => s.id));

        // Find added sections
        const added = sections.filter(s => !prevIds.has(s.id));

        // Find removed sections
        const removed = prevSections.filter(s => !currentIds.has(s.id));

        // Find updated sections (same ID but different content)
        const updated = sections.filter(section => {
            const prevSection = prevSections.find(s => s.id === section.id);
            return prevSection && !this.sectionsEqual(section, prevSection);
        });

        // Check if it's a reorder operation (same sections, different order)
        const isReorder =
            added.length === 0 &&
            removed.length === 0 &&
            updated.length === 0 &&
            sections.length === prevSections.length;

        // Handle removals first
        removed.forEach(section => {
            this.canvasManager.removeSection(section.id);
            this.emit('sectionRemoved', { section });
        });

        // Handle additions
        added.forEach(section => {
            const index = sections.indexOf(section);
            const data = this.getSectionData(section);

            if (index === sections.length - 1) {
                this.canvasManager.renderSection(section, data);
            } else {
                this.canvasManager.insertSection(section, data, index);
            }

            this.emit('sectionAdded', { section });
        });

        // Handle updates
        updated.forEach(section => {
            const data = this.getSectionData(section);
            this.canvasManager.updateSection(section.id, section, data);
            this.emit('sectionUpdated', { section });
        });

        // Handle reordering
        if (isReorder) {
            this.handleReordering(sections, prevSections);
        }
    }

    /**
     * Handle section reordering
     * @param {Array} sections - Current sections
     * @param {Array} prevSections - Previous sections
     */
    handleReordering(sections, prevSections) {
        // Check if order actually changed
        const orderChanged = !sections.every((section, index) => prevSections[index]?.id === section.id);

        if (orderChanged) {
            // Find which section moved
            sections.forEach((section, newIndex) => {
                const prevIndex = prevSections.findIndex(s => s.id === section.id);
                if (prevIndex !== -1 && prevIndex !== newIndex) {
                    this.canvasManager.reorderSection(section.id, newIndex);
                    this.emit('sectionReordered', {
                        sectionId: section.id,
                        from: prevIndex,
                        to: newIndex,
                    });
                }
            });
        }
    }

    /**
     * Handle selection changes
     * @param {string|null} selectedId - Currently selected section ID
     * @param {string|null} prevSelectedId - Previously selected section ID
     */
    handleSelectionChange(selectedId, prevSelectedId) {
        // Remove highlight from previous selection
        if (prevSelectedId) {
            const prevElement = this.canvasManager.getSection(prevSelectedId);
            if (prevElement) {
                prevElement.classList.remove('section-selected');
            }
        }

        // Add highlight to current selection
        if (selectedId) {
            const element = this.canvasManager.getSection(selectedId);
            if (element) {
                element.classList.add('section-selected');
                // Scroll into view if needed
                element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }

        this.emit('selectionChanged', { selectedId, prevSelectedId });
    }

    /**
     * Check if two sections are equal
     * @param {Object} section1
     * @param {Object} section2
     * @returns {boolean}
     */
    sectionsEqual(section1, section2) {
        return JSON.stringify(section1) === JSON.stringify(section2);
    }

    /**
     * Get data for a section (mock or real)
     * @param {Object} section - Section object
     * @returns {Object} Section data
     */
    getSectionData(section) {
        if (this.dataProvider) {
            // Use data provider if available
            return this.dataProvider.getMockData(section.type, section.settings);
        }
        return {};
    }

    /**
     * Render all sections from state
     */
    renderAllSections() {
        const sections = this.store.getState().sections;
        const dataMap = {};

        sections.forEach(section => {
            dataMap[section.id] = this.getSectionData(section);
        });

        this.canvasManager.batchRender(sections, dataMap);
    }

    // ===== Public API Methods =====

    /**
     * Add a new section
     * @param {string} type - Section type
     * @param {Object} overrides - Settings overrides
     * @returns {string} Section ID
     */
    addSection(type, overrides = {}) {
        const section = SectionRegistry.createSection(type, overrides);
        return this.store.getState().addSection(section);
    }

    /**
     * Insert section at specific position
     * @param {string} type - Section type
     * @param {number} index - Position to insert
     * @param {Object} overrides - Settings overrides
     * @returns {string} Section ID
     */
    insertSectionAt(type, index, overrides = {}) {
        const section = SectionRegistry.createSection(type, overrides);
        return this.store.getState().insertSection(section, index);
    }

    /**
     * Update section settings
     * @param {string} id - Section ID
     * @param {Object} settings - New settings
     */
    updateSectionSettings(id, settings) {
        this.store.getState().updateSectionSettings(id, settings);
    }

    /**
     * Delete a section
     * @param {string} id - Section ID
     */
    deleteSection(id) {
        this.store.getState().removeSection(id);
    }

    /**
     * Duplicate a section
     * @param {string} id - Section ID
     * @returns {string|null} New section ID
     */
    duplicateSection(id) {
        return this.store.getState().duplicateSection(id);
    }

    /**
     * Select a section
     * @param {string} id - Section ID
     */
    selectSection(id) {
        this.store.getState().selectSection(id);
    }

    /**
     * Deselect current section
     */
    deselectSection() {
        this.store.getState().deselectSection();
    }

    /**
     * Reorder sections
     * @param {number} fromIndex - Source index
     * @param {number} toIndex - Target index
     */
    reorderSections(fromIndex, toIndex) {
        this.store.getState().reorderSections(fromIndex, toIndex);
    }

    /**
     * Undo last action
     */
    undo() {
        const temporal = this.store.temporal;
        if (temporal.getState().pastStates.length > 0) {
            temporal.getState().undo();
            this.emit('undo');
        }
    }

    /**
     * Redo last undone action
     */
    redo() {
        const temporal = this.store.temporal;
        if (temporal.getState().futureStates.length > 0) {
            temporal.getState().redo();
            this.emit('redo');
        }
    }

    /**
     * Check if undo is available
     * @returns {boolean}
     */
    canUndo() {
        return this.store.temporal.getState().pastStates.length > 0;
    }

    /**
     * Check if redo is available
     * @returns {boolean}
     */
    canRedo() {
        return this.store.temporal.getState().futureStates.length > 0;
    }

    /**
     * Set builder mode
     * @param {string} mode - 'edit' or 'preview'
     */
    setMode(mode) {
        if (mode !== 'edit' && mode !== 'preview') {
            console.warn(`Invalid mode: ${mode}`);
            return;
        }
        this.store.getState().setMode(mode);
    }

    /**
     * Get current mode
     * @returns {string}
     */
    getMode() {
        return this.store.getState().mode;
    }

    /**
     * Toggle between edit and preview modes
     */
    toggleMode() {
        const currentMode = this.getMode();
        this.setMode(currentMode === 'edit' ? 'preview' : 'edit');
    }

    /**
     * Get current state
     * @returns {Object}
     */
    getState() {
        return this.store.getState();
    }

    /**
     * Get all sections
     * @returns {Array}
     */
    getSections() {
        return this.store.getState().sections;
    }

    /**
     * Get section by ID
     * @param {string} id - Section ID
     * @returns {Object|undefined}
     */
    getSection(id) {
        return this.store.getState().getSection(id);
    }

    /**
     * Get selected section
     * @returns {Object|undefined}
     */
    getSelectedSection() {
        return this.store.getState().getSelectedSection();
    }

    /**
     * Get sections count
     * @returns {number}
     */
    getSectionsCount() {
        return this.store.getState().getSectionsCount();
    }

    /**
     * Clear all sections
     */
    clearSections() {
        this.store.getState().clearSections();
        this.canvasManager.clear();
    }

    /**
     * Save current state
     * @returns {Object} Serialized state
     */
    save() {
        const state = this.store.getState();
        const data = {
            sections: state.sections,
            mode: state.mode,
            savedAt: new Date().toISOString(),
        };

        this.emit('save', { data });
        console.info('State saved');

        return data;
    }

    /**
     * Load state
     * @param {Object} data - State data to load
     */
    load(data) {
        if (!data || !data.sections) {
            console.warn('Invalid data for loading');
            return;
        }

        try {
            // Clear current canvas
            this.canvasManager.clear();

            // Load state
            this.store.getState().loadState(data);

            // Render all sections
            this.renderAllSections();

            this.emit('load', { data });
            console.info('State loaded');
        } catch (error) {
            console.error('Error loading state:', error);
            throw error;
        }
    }

    /**
     * Export for production rendering
     * @returns {Object} Production-ready data
     */
    export() {
        const sections = this.store.getState().sections;

        const exportData = {
            version: '1.0',
            sections: sections.map(section => ({
                id: section.id,
                type: section.type,
                settings: section.settings,
            })),
            exportedAt: new Date().toISOString(),
        };

        this.emit('export', { data: exportData });
        console.info('State exported for production');

        return exportData;
    }

    /**
     * Setup auto-save
     */
    setupAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }

        this.autoSaveTimer = setInterval(() => {
            const data = this.save();
            this.emit('autoSave', { data });
            console.debug('Auto-saved');
        }, this.options.autoSaveInterval);

        console.info(`Auto-save enabled (every ${this.options.autoSaveInterval}ms)`);
    }

    /**
     * Stop auto-save
     */
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
            console.info('Auto-save disabled');
        }
    }

    /**
     * Event emitter methods
     */
    on(event, handler) {
        this.emitter.on(event, handler);
    }

    off(event, handler) {
        this.emitter.off(event, handler);
    }

    emit(event, data) {
        this.emitter.emit(event, data);
    }

    /**
     * Get builder info
     * @returns {Object}
     */
    getInfo() {
        return {
            initialized: this.initialized,
            mode: this.getMode(),
            sectionsCount: this.getSectionsCount(),
            canUndo: this.canUndo(),
            canRedo: this.canRedo(),
            reactivityAdapter: this.reactivityAdapter?.getName(),
            autoSave: this.options.autoSave,
        };
    }

    /**
     * Destroy builder and clean up
     */
    destroy() {
        console.info('Destroying builder...');

        // Stop auto-save
        this.stopAutoSave();

        // Unsubscribe from state changes
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }

        // Clean up canvas manager
        if (this.canvasManager) {
            this.canvasManager.destroy();
            this.canvasManager = null;
        }

        // Clean up reactivity adapter
        if (this.reactivityAdapter) {
            if (typeof this.reactivityAdapter.destroy === 'function') {
                this.reactivityAdapter.destroy();
            }
            this.reactivityAdapter = null;
        }

        // Clear event listeners
        this.emitter.all.clear();

        this.initialized = false;
        this.emit('destroyed');

        console.info('Builder destroyed');
    }
}

export default Builder;
