import mitt from 'mitt';

/**
 * Selection Manager
 * Handles section selection logic and visual feedback
 */
class SelectionManager {
    constructor(canvasElement, builderStore) {
        if (!canvasElement) {
            throw new Error('Canvas element is required');
        }

        this.canvas = canvasElement;
        this.store = builderStore;
        this.emitter = mitt();
        this.enabled = false;

        // Bound methods for event listeners
        this.handleClick = this.handleClick.bind(this);

        console.debug('SelectionManager created');
    }

    /**
     * Enable selection handling
     */
    enable() {
        if (this.enabled) return;

        this.canvas.addEventListener('click', this.handleClick, true);
        this.enabled = true;

        console.debug('SelectionManager enabled');
    }

    /**
     * Disable selection handling
     */
    disable() {
        if (!this.enabled) return;

        this.canvas.removeEventListener('click', this.handleClick, true);
        this.enabled = false;

        console.debug('SelectionManager disabled');
    }

    /**
     * Handle click events on canvas
     * @param {MouseEvent} event - Click event
     */
    handleClick(event) {
        // Only handle in edit mode
        const mode = this.store.getState().mode;
        if (mode !== 'edit') return;

        // Find the section wrapper that was clicked
        const sectionWrapper = event.target.closest('[data-section-id]');

        if (!sectionWrapper) {
            // Clicked outside any section - deselect
            this.deselectSection();
            return;
        }

        const sectionId = sectionWrapper.getAttribute('data-section-id');

        // Check if clicked on a control button
        const controlButton = event.target.closest('[data-action]');
        if (controlButton) {
            // Handle control button clicks separately
            event.stopPropagation();
            event.preventDefault();
            this.handleControlClick(controlButton, sectionId);
            return;
        }

        // Select the section
        event.stopPropagation();
        this.selectSection(sectionId);
    }

    /**
     * Handle control button clicks
     * @param {HTMLElement} button - Button element
     * @param {string} sectionId - Section ID
     */
    handleControlClick(button, sectionId) {
        const action = button.getAttribute('data-action');

        switch (action) {
            case 'settings':
                this.selectSection(sectionId);
                this.emitter.emit('settings', { sectionId });
                break;

            case 'duplicate':
                this.emitter.emit('duplicate', { sectionId });
                // Auto-duplicate without confirmation
                if (this.store && this.store.getState) {
                    this.store.getState().duplicateSection(sectionId);
                }
                break;

            case 'delete':
                this.emitter.emit('delete', { sectionId });
                // Delete with confirmation
                if (confirm('Delete this section?')) {
                    if (this.store && this.store.getState) {
                        this.store.getState().removeSection(sectionId);
                    }
                }
                break;

            case 'move-up':
                this.emitter.emit('moveUp', { sectionId });
                this.moveSection(sectionId, -1);
                break;

            case 'move-down':
                this.emitter.emit('moveDown', { sectionId });
                this.moveSection(sectionId, 1);
                break;

            case 'drag':
                // Drag handle - do nothing, handled by DragDropManager
                break;

            default:
                console.warn(`Unknown control action: ${action}`);
        }
    }

    /**
     * Move section up or down
     * @param {string} sectionId - Section ID
     * @param {number} direction - -1 for up, 1 for down
     */
    moveSection(sectionId, direction) {
        const sections = this.store.getState().sections;
        const currentIndex = sections.findIndex(s => s.id === sectionId);

        if (currentIndex === -1) return;

        const newIndex = currentIndex + direction;

        // Check bounds
        if (newIndex < 0 || newIndex >= sections.length) return;

        // Reorder
        this.store.getState().reorderSections(currentIndex, newIndex);
    }

    /**
     * Select a section
     * @param {string} sectionId - Section ID
     */
    selectSection(sectionId) {
        const currentSelected = this.store.getState().selectedSectionId;

        if (currentSelected === sectionId) {
            // Already selected
            return;
        }

        // Update state
        this.store.getState().selectSection(sectionId);

        // Emit event
        this.emitter.emit('select', { sectionId });

        console.debug(`Section selected: ${sectionId}`);
    }

    /**
     * Deselect current section
     */
    deselectSection() {
        const currentSelected = this.store.getState().selectedSectionId;

        if (!currentSelected) {
            // Nothing selected
            return;
        }

        // Update state
        this.store.getState().deselectSection();

        // Emit event
        this.emitter.emit('deselect', { sectionId: currentSelected });

        console.debug('Section deselected');
    }

    /**
     * Select next section (keyboard navigation)
     */
    selectNext() {
        const { sections, selectedSectionId } = this.store.getState();

        if (sections.length === 0) return;

        if (!selectedSectionId) {
            // Select first section
            this.selectSection(sections[0].id);
            return;
        }

        const currentIndex = sections.findIndex(s => s.id === selectedSectionId);
        const nextIndex = (currentIndex + 1) % sections.length;
        this.selectSection(sections[nextIndex].id);
    }

    /**
     * Select previous section (keyboard navigation)
     */
    selectPrevious() {
        const { sections, selectedSectionId } = this.store.getState();

        if (sections.length === 0) return;

        if (!selectedSectionId) {
            // Select last section
            this.selectSection(sections[sections.length - 1].id);
            return;
        }

        const currentIndex = sections.findIndex(s => s.id === selectedSectionId);
        const prevIndex = currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
        this.selectSection(sections[prevIndex].id);
    }

    /**
     * Get selected section
     * @returns {Object|null} Selected section
     */
    getSelectedSection() {
        return this.store.getState().getSelectedSection();
    }

    /**
     * Get selected section ID
     * @returns {string|null} Selected section ID
     */
    getSelectedSectionId() {
        return this.store.getState().selectedSectionId;
    }

    /**
     * Check if a section is selected
     * @param {string} sectionId - Section ID
     * @returns {boolean}
     */
    isSelected(sectionId) {
        return this.store.getState().selectedSectionId === sectionId;
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

    /**
     * Destroy and clean up
     */
    destroy() {
        this.disable();
        this.emitter.all.clear();
        console.debug('SelectionManager destroyed');
    }
}

export default SelectionManager;
