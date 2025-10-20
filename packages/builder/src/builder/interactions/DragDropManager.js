import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import mitt from 'mitt';

/**
 * Drag & Drop Manager
 * Handles section reordering and new section drops using @atlaskit/pragmatic-drag-and-drop
 */
class DragDropManager {
    constructor(canvasElement, builderStore, builder) {
        if (!canvasElement) {
            throw new Error('Canvas element is required');
        }

        this.canvas = canvasElement;
        this.store = builderStore;
        this.builder = builder;
        this.emitter = mitt();
        this.enabled = false;

        // Track active drag operations
        this.draggingSectionId = null;
        this.dropIndicator = null;
        this.canvasDropCleanup = null;

        // Cleanup functions for each draggable/droppable
        this.cleanupFunctions = new Map();

        console.debug('DragDropManager created');
    }

    /**
     * Enable drag and drop
     */
    enable() {
        if (this.enabled) return;

        // Create drop indicator element
        this.createDropIndicator();

        // Make canvas a drop target for new sections
        this.setupCanvasDropTarget();

        // Setup existing sections
        this.setupAllSections();

        // Observe for new sections added to canvas
        this.setupMutationObserver();

        this.enabled = true;
        console.debug('DragDropManager enabled');
    }

    /**
     * Setup canvas as drop target for new sections from sidebar
     */
    setupCanvasDropTarget() {
        this.currentDropIndex = null;

        this.canvasDropCleanup = dropTargetForElements({
            element: this.canvas,
            canDrop: ({ source }) => source.data.type === 'new-section',
            getData: () => ({ type: 'canvas' }),
            onDragEnter: () => {
                this.canvas.classList.add('accepting-drop');
            },
            onDrag: ({ location }) => {
                // Use the actual mouse position from location
                const mouseY = location.current.input.clientY;
                this.updateDropIndicatorPosition(mouseY);
            },
            onDragLeave: () => {
                this.canvas.classList.remove('accepting-drop');
                this.hideDropIndicator();
                this.currentDropIndex = null;
            },
            onDrop: ({ source }) => {
                this.canvas.classList.remove('accepting-drop');

                if (source.data.type === 'new-section' && source.data.sectionType) {
                    const dropIndex =
                        this.currentDropIndex !== null
                            ? this.currentDropIndex
                            : this.store.getState().sections.length;
                    this.builder.insertSectionAt(source.data.sectionType, dropIndex);
                    this.hideDropIndicator();
                    this.currentDropIndex = null;
                }
            },
        });
    }

    /**
     * Update drop indicator position based on mouse Y coordinate
     * @param {number} mouseY - Mouse Y position in viewport
     */
    updateDropIndicatorPosition(mouseY) {
        const sections = Array.from(this.canvas.querySelectorAll('[data-section-id]'));
        const canvasRect = this.canvas.getBoundingClientRect();

        // If no sections, drop at beginning
        if (sections.length === 0) {
            this.showDropIndicatorBetween(null, null, 0);
            this.currentDropIndex = 0;
            return;
        }

        // Find where to insert based on mouse position
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const rect = section.getBoundingClientRect();
            const sectionMiddle = rect.top + rect.height / 2;

            // Mouse is in upper half of this section - insert before it
            if (mouseY < sectionMiddle) {
                this.showDropIndicatorBetween(i > 0 ? sections[i - 1] : null, section, i);
                this.currentDropIndex = i;
                return;
            }
        }

        // Mouse is below all sections - insert at end
        const lastSection = sections[sections.length - 1];
        this.showDropIndicatorBetween(lastSection, null, sections.length);
        this.currentDropIndex = sections.length;
    }

    /**
     * Show drop indicator between two sections
     * @param {HTMLElement|null} beforeSection - Section before drop point (null if at start)
     * @param {HTMLElement|null} afterSection - Section after drop point (null if at end)
     * @param {number} index - Drop index
     */
    showDropIndicatorBetween(beforeSection, afterSection, index) {
        if (!this.dropIndicator) return;

        const canvasRect = this.canvas.getBoundingClientRect();
        let topPosition;

        if (!beforeSection && afterSection) {
            // Insert at beginning - show above first section
            const rect = afterSection.getBoundingClientRect();
            topPosition = rect.top - canvasRect.top + this.canvas.scrollTop;
        } else if (beforeSection && !afterSection) {
            // Insert at end - show below last section
            const rect = beforeSection.getBoundingClientRect();
            topPosition = rect.bottom - canvasRect.top + this.canvas.scrollTop;
        } else if (beforeSection && afterSection) {
            // Insert between sections - show at gap
            const rectBefore = beforeSection.getBoundingClientRect();
            topPosition = rectBefore.bottom - canvasRect.top + this.canvas.scrollTop;
        } else {
            // No sections at all
            topPosition = 0;
        }

        this.dropIndicator.style.display = 'block';
        this.dropIndicator.style.position = 'absolute';
        this.dropIndicator.style.left = '20px';
        this.dropIndicator.style.right = '20px';
        this.dropIndicator.style.top = `${topPosition}px`;
        this.dropIndicator.style.pointerEvents = 'none';

        if (!this.dropIndicator.parentNode) {
            this.canvas.style.position = 'relative';
            this.canvas.appendChild(this.dropIndicator);
        }
    }

    /**
     * Disable drag and drop
     */
    disable() {
        if (!this.enabled) return;

        // Clean up canvas drop target
        if (this.canvasDropCleanup) {
            this.canvasDropCleanup();
            this.canvasDropCleanup = null;
        }

        // Clean up all draggables and droppables
        this.cleanupFunctions.forEach(cleanup => cleanup());
        this.cleanupFunctions.clear();

        // Disconnect observer
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        // Remove drop indicator
        if (this.dropIndicator && this.dropIndicator.parentNode) {
            this.dropIndicator.remove();
        }

        this.enabled = false;
        console.debug('DragDropManager disabled');
    }

    /**
     * Create drop indicator element
     */
    createDropIndicator() {
        this.dropIndicator = document.createElement('div');
        this.dropIndicator.className = 'drop-indicator';
        this.dropIndicator.style.display = 'none';
    }

    /**
     * Setup mutation observer to watch for new sections
     */
    setupMutationObserver() {
        this.observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.hasAttribute('data-section-id')) {
                        this.setupSection(node);
                    }
                });

                mutation.removedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.hasAttribute('data-section-id')) {
                        const sectionId = node.getAttribute('data-section-id');
                        this.cleanupSection(sectionId);
                    }
                });
            });
        });

        this.observer.observe(this.canvas, {
            childList: true,
            subtree: false,
        });
    }

    /**
     * Setup drag and drop for all existing sections
     */
    setupAllSections() {
        const sections = this.canvas.querySelectorAll('[data-section-id]');
        sections.forEach(section => this.setupSection(section));
    }

    /**
     * Setup drag and drop for a single section
     * @param {HTMLElement} sectionElement - Section wrapper element
     */
    setupSection(sectionElement) {
        const sectionId = sectionElement.getAttribute('data-section-id');

        if (this.cleanupFunctions.has(sectionId)) {
            // Already setup
            return;
        }

        const dragHandle = sectionElement.querySelector('[data-action="drag"]');

        if (!dragHandle) {
            console.warn(`No drag handle found for section ${sectionId}`);
            return;
        }

        // Make section draggable
        const draggableCleanup = draggable({
            element: sectionElement,
            dragHandle: dragHandle,
            getInitialData: () => ({ sectionId, type: 'section' }),
            onGenerateDragPreview: ({ nativeSetDragImage }) => {
                // Use native drag preview
                const preview = sectionElement.cloneNode(true);
                preview.style.opacity = '0.5';
                nativeSetDragImage(preview, 0, 0);
            },
            onDragStart: () => this.handleDragStart(sectionId, sectionElement),
            onDrop: () => this.handleDragEnd(sectionId, sectionElement),
        });

        // Make section a drop target
        const dropTargetCleanup = dropTargetForElements({
            element: sectionElement,
            canDrop: ({ source }) => source.data.type === 'section' && source.data.sectionId !== sectionId,
            getData: ({ input, element }) => {
                const sections = Array.from(this.canvas.querySelectorAll('[data-section-id]'));
                const index = sections.indexOf(element);

                return {
                    sectionId,
                    index,
                };
            },
            onDragEnter: ({ self, source }) => {
                this.handleDragEnter(self.data.sectionId, source.data.sectionId, self.element);
            },
            onDragLeave: () => {
                this.hideDropIndicator();
            },
            onDrop: ({ self, source }) => {
                this.handleDrop(source.data.sectionId, self.data.sectionId);
            },
        });

        // Store cleanup function
        const cleanup = combine(draggableCleanup, dropTargetCleanup);
        this.cleanupFunctions.set(sectionId, cleanup);
    }

    /**
     * Cleanup drag and drop for a section
     * @param {string} sectionId - Section ID
     */
    cleanupSection(sectionId) {
        const cleanup = this.cleanupFunctions.get(sectionId);
        if (cleanup) {
            cleanup();
            this.cleanupFunctions.delete(sectionId);
        }
    }

    /**
     * Handle drag start
     * @param {string} sectionId - Section ID being dragged
     * @param {HTMLElement} element - Section element
     */
    handleDragStart(sectionId, element) {
        this.draggingSectionId = sectionId;
        element.classList.add('is-dragging');
        document.body.style.cursor = 'grabbing';

        this.emitter.emit('dragStart', { sectionId });
        console.debug(`Drag started: ${sectionId}`);
    }

    /**
     * Handle drag end
     * @param {string} sectionId - Section ID
     * @param {HTMLElement} element - Section element
     */
    handleDragEnd(sectionId, element) {
        element.classList.remove('is-dragging');
        document.body.style.cursor = '';
        this.hideDropIndicator();

        // Remove all drag-over classes
        const allSections = this.canvas.querySelectorAll('[data-section-id]');
        allSections.forEach(el => el.classList.remove('is-drag-over'));

        this.draggingSectionId = null;

        this.emitter.emit('dragEnd', { sectionId });
        console.debug(`Drag ended: ${sectionId}`);
    }

    /**
     * Handle drag enter over a drop target
     * @param {string} targetSectionId - Target section ID
     * @param {string} sourceSectionId - Source section ID being dragged
     * @param {HTMLElement} targetElement - Target element
     */
    handleDragEnter(targetSectionId, sourceSectionId, targetElement) {
        if (targetSectionId === sourceSectionId) {
            return;
        }

        // Remove previous drag-over
        const allSections = this.canvas.querySelectorAll('[data-section-id]');
        allSections.forEach(el => el.classList.remove('is-drag-over'));

        // Add to current target
        targetElement.classList.add('is-drag-over');

        // Show drop indicator
        this.showDropIndicator(targetElement, sourceSectionId, targetSectionId);
    }

    /**
     * Handle drop
     * @param {string} sourceSectionId - Section being dropped
     * @param {string} targetSectionId - Drop target section
     */
    handleDrop(sourceSectionId, targetSectionId) {
        if (sourceSectionId === targetSectionId) {
            return;
        }

        const sections = this.store.getState().sections;
        const sourceIndex = sections.findIndex(s => s.id === sourceSectionId);
        const targetIndex = sections.findIndex(s => s.id === targetSectionId);

        if (sourceIndex === -1 || targetIndex === -1) {
            console.warn('Invalid section indices for drop');
            return;
        }

        // Update state (this will trigger canvas update via state subscription)
        this.store.getState().reorderSections(sourceIndex, targetIndex);

        this.emitter.emit('drop', {
            sourceSectionId,
            targetSectionId,
            fromIndex: sourceIndex,
            toIndex: targetIndex,
        });

        console.debug(`Dropped ${sourceSectionId} onto ${targetSectionId}`);
    }

    /**
     * Show drop indicator
     * @param {HTMLElement} targetElement - Target element
     * @param {string} sourceSectionId - Source section ID
     * @param {string} targetSectionId - Target section ID
     */
    showDropIndicator(targetElement, sourceSectionId, targetSectionId) {
        if (!this.dropIndicator) return;

        const sections = this.store.getState().sections;
        const sourceIndex = sections.findIndex(s => s.id === sourceSectionId);
        const targetIndex = sections.findIndex(s => s.id === targetSectionId);

        // Determine if we should show indicator above or below target
        const showAbove = sourceIndex > targetIndex;

        // Position indicator
        const rect = targetElement.getBoundingClientRect();
        const canvasRect = this.canvas.getBoundingClientRect();

        this.dropIndicator.style.display = 'block';
        this.dropIndicator.style.position = 'absolute';
        this.dropIndicator.style.left = '0';
        this.dropIndicator.style.right = '0';

        if (showAbove) {
            this.dropIndicator.style.top = `${rect.top - canvasRect.top - 2}px`;
        } else {
            this.dropIndicator.style.top = `${rect.bottom - canvasRect.top - 2}px`;
        }

        // Add to canvas if not already there
        if (!this.dropIndicator.parentNode) {
            this.canvas.style.position = 'relative';
            this.canvas.appendChild(this.dropIndicator);
        }
    }

    /**
     * Hide drop indicator
     */
    hideDropIndicator() {
        if (this.dropIndicator) {
            this.dropIndicator.style.display = 'none';
        }
    }

    /**
     * Get dragging section ID
     * @returns {string|null}
     */
    getDraggingSectionId() {
        return this.draggingSectionId;
    }

    /**
     * Check if currently dragging
     * @returns {boolean}
     */
    isDragging() {
        return this.draggingSectionId !== null;
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
        console.debug('DragDropManager destroyed');
    }
}

export default DragDropManager;
