import { tinykeys } from 'tinykeys';

/**
 * Keyboard Manager
 * Handles keyboard shortcuts for builder operations
 */
class KeyboardManager {
    constructor(builderStore, builderInstance) {
        this.store = builderStore;
        this.builder = builderInstance;
        this.enabled = false;
        this.unsubscribe = null;

        // Default shortcuts
        this.shortcuts = {
            // Undo/Redo
            '$mod+z': () => this.handleUndo(),
            '$mod+Shift+z': () => this.handleRedo(),
            '$mod+y': () => this.handleRedo(),

            // Delete
            Backspace: () => this.handleDelete(),
            Delete: () => this.handleDelete(),

            // Duplicate
            '$mod+d': () => this.handleDuplicate(),

            // Navigation
            ArrowUp: () => this.handleNavigateUp(),
            ArrowDown: () => this.handleNavigateDown(),

            // Preview mode
            '$mod+p': () => this.handleTogglePreview(),

            // Deselect
            Escape: () => this.handleEscape(),

            // Save
            '$mod+s': () => this.handleSave(),
        };

        console.debug('KeyboardManager created');
    }

    /**
     * Enable keyboard shortcuts
     */
    enable() {
        if (this.enabled) return;

        this.unsubscribe = tinykeys(window, this.shortcuts, {
            // Prevent default for handled shortcuts
            event: 'keydown',
        });

        this.enabled = true;
        console.debug('KeyboardManager enabled');
    }

    /**
     * Disable keyboard shortcuts
     */
    disable() {
        if (!this.enabled) return;

        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }

        this.enabled = false;
        console.debug('KeyboardManager disabled');
    }

    /**
     * Register a custom shortcut
     * @param {string} keys - Key combination (e.g., '$mod+k')
     * @param {Function} handler - Handler function
     */
    registerShortcut(keys, handler) {
        this.shortcuts[keys] = handler;

        // Re-enable to apply new shortcut
        if (this.enabled) {
            this.disable();
            this.enable();
        }
    }

    /**
     * Unregister a shortcut
     * @param {string} keys - Key combination
     */
    unregisterShortcut(keys) {
        delete this.shortcuts[keys];

        // Re-enable to apply changes
        if (this.enabled) {
            this.disable();
            this.enable();
        }
    }

    /**
     * Handle undo
     */
    handleUndo() {
        if (this.shouldPreventAction()) return;

        if (this.builder.canUndo()) {
            this.builder.undo();
            console.debug('Undo triggered via keyboard');
        }
    }

    /**
     * Handle redo
     */
    handleRedo() {
        if (this.shouldPreventAction()) return;

        if (this.builder.canRedo()) {
            this.builder.redo();
            console.debug('Redo triggered via keyboard');
        }
    }

    /**
     * Handle delete
     */
    handleDelete() {
        if (this.shouldPreventAction()) return;

        const selectedSectionId = this.store.getState().selectedSectionId;

        if (selectedSectionId) {
            this.builder.deleteSection(selectedSectionId);
            console.debug('Delete triggered via keyboard');
        }
    }

    /**
     * Handle duplicate
     */
    handleDuplicate() {
        if (this.shouldPreventAction()) return;

        const selectedSectionId = this.store.getState().selectedSectionId;

        if (selectedSectionId) {
            this.builder.duplicateSection(selectedSectionId);
            console.debug('Duplicate triggered via keyboard');
        }
    }

    /**
     * Handle navigate up (select previous section)
     */
    handleNavigateUp() {
        if (this.shouldPreventAction()) return;

        const { sections, selectedSectionId } = this.store.getState();

        if (sections.length === 0) return;

        if (!selectedSectionId) {
            // Select last section
            this.builder.selectSection(sections[sections.length - 1].id);
            return;
        }

        const currentIndex = sections.findIndex(s => s.id === selectedSectionId);
        if (currentIndex > 0) {
            this.builder.selectSection(sections[currentIndex - 1].id);
        }
    }

    /**
     * Handle navigate down (select next section)
     */
    handleNavigateDown() {
        if (this.shouldPreventAction()) return;

        const { sections, selectedSectionId } = this.store.getState();

        if (sections.length === 0) return;

        if (!selectedSectionId) {
            // Select first section
            this.builder.selectSection(sections[0].id);
            return;
        }

        const currentIndex = sections.findIndex(s => s.id === selectedSectionId);
        if (currentIndex < sections.length - 1) {
            this.builder.selectSection(sections[currentIndex + 1].id);
        }
    }

    /**
     * Handle toggle preview mode
     */
    handleTogglePreview() {
        if (this.shouldPreventAction()) return;

        this.builder.toggleMode();
        console.debug('Preview mode toggled via keyboard');
    }

    /**
     * Handle escape (deselect)
     */
    handleEscape() {
        const selectedSectionId = this.store.getState().selectedSectionId;

        if (selectedSectionId) {
            this.builder.deselectSection();
            console.debug('Deselect triggered via keyboard');
        }
    }

    /**
     * Handle save
     */
    handleSave() {
        if (this.shouldPreventAction()) return;

        this.builder.save();
        console.debug('Save triggered via keyboard');
    }

    /**
     * Check if action should be prevented
     * (e.g., when user is typing in an input field)
     * @returns {boolean}
     */
    shouldPreventAction() {
        const activeElement = document.activeElement;

        // Prevent if user is typing in input, textarea, or contenteditable
        if (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable
        ) {
            return true;
        }

        // Prevent in preview mode for most actions
        const mode = this.store.getState().mode;
        if (mode === 'preview') {
            // Allow only mode toggle in preview
            return false;
        }

        return false;
    }

    /**
     * Get list of registered shortcuts
     * @returns {Array} Array of shortcut info
     */
    getShortcuts() {
        return Object.entries(this.shortcuts).map(([keys, handler]) => ({
            keys: this.formatKeys(keys),
            description: this.getShortcutDescription(keys),
        }));
    }

    /**
     * Format keys for display
     * @param {string} keys - Key combination
     * @returns {string} Formatted keys
     */
    formatKeys(keys) {
        return keys
            .replace('$mod', navigator.platform.includes('Mac') ? '⌘' : 'Ctrl')
            .replace('Shift', '⇧')
            .replace('ArrowUp', '↑')
            .replace('ArrowDown', '↓')
            .replace('Escape', 'Esc');
    }

    /**
     * Get description for a shortcut
     * @param {string} keys - Key combination
     * @returns {string} Description
     */
    getShortcutDescription(keys) {
        const descriptions = {
            '$mod+z': 'Undo',
            '$mod+Shift+z': 'Redo',
            '$mod+y': 'Redo',
            Backspace: 'Delete section',
            Delete: 'Delete section',
            '$mod+d': 'Duplicate section',
            ArrowUp: 'Select previous section',
            ArrowDown: 'Select next section',
            '$mod+p': 'Toggle preview mode',
            Escape: 'Deselect section',
            '$mod+s': 'Save',
        };

        return descriptions[keys] || 'Custom action';
    }

    /**
     * Destroy and clean up
     */
    destroy() {
        this.disable();
        console.debug('KeyboardManager destroyed');
    }
}

export default KeyboardManager;
