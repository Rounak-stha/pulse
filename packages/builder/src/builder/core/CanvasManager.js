import SectionRenderer from '../renderer/SectionRenderer.js';

/**
 * Canvas Manager
 * Orchestrates DOM operations, coordinates rendering and reactivity
 */
class CanvasManager {
    constructor(canvasElement, reactivityAdapter) {
        if (!canvasElement) {
            throw new Error('Canvas element is required');
        }

        this.canvas = canvasElement;
        this.reactivityAdapter = reactivityAdapter;
        this.sectionElements = new Map(); // Map<sectionId, HTMLElement>
        this.scrollPositions = new Map(); // Map<sectionId, number>

        // Initialize canvas
        this.setupCanvas();
    }

    /**
     * Setup canvas with proper attributes
     */
    setupCanvas() {
        this.canvas.setAttribute('data-builder-canvas', '');
        this.canvas.style.minHeight = '100vh';
    }

    /**
     * Render and mount a new section
     * @param {Object} section - Section object
     * @param {Object} data - Data for section
     * @returns {HTMLElement} Created section element
     */
    renderSection(section, data = {}) {
        const startTime = performance.now();

        try {
            // Generate HTML
            const html = SectionRenderer.generateSectionHTML(section, data);

            // Create element from HTML
            const element = this.createElementFromHTML(html);

            // Store reference
            this.sectionElements.set(section.id, element);

            // Add to canvas
            this.canvas.appendChild(element);

            // Mount reactivity
            if (this.reactivityAdapter) {
                const contentElement = element.querySelector('.section-content');
                if (contentElement) {
                    this.reactivityAdapter.mount(contentElement);
                }
            }

            const duration = performance.now() - startTime;
            console.debug(`Section ${section.id} rendered in ${duration.toFixed(2)}ms`);

            return element;
        } catch (error) {
            console.error('Error rendering section:', error);
            throw error;
        }
    }

    /**
     * Insert section at specific position
     * @param {Object} section - Section object
     * @param {Object} data - Data for section
     * @param {number} index - Position to insert at
     * @returns {HTMLElement} Created section element
     */
    insertSection(section, data, index) {
        console.log('Inserting Section', { section });
        const startTime = performance.now();

        try {
            const html = SectionRenderer.generateSectionHTML(section, data);
            const element = this.createElementFromHTML(html);

            this.sectionElements.set(section.id, element);

            // Insert at specific position
            const existingSections = this.getAllSectionElements();
            if (index >= existingSections.length) {
                this.canvas.appendChild(element);
            } else {
                this.canvas.insertBefore(element, existingSections[index]);
            }

            // Mount reactivity
            if (this.reactivityAdapter) {
                const contentElement = element.querySelector('.section-content');
                if (contentElement) {
                    this.reactivityAdapter.mount(contentElement);
                }
            }

            const duration = performance.now() - startTime;
            console.debug(`Section ${section.id} inserted at ${index} in ${duration.toFixed(2)}ms`);

            return element;
        } catch (error) {
            console.error('Error inserting section:', error);
            throw error;
        }
    }

    /**
     * Update existing section
     * @param {string} sectionId - Section ID
     * @param {Object} section - Updated section object
     * @param {Object} data - Updated data
     */
    updateSection(sectionId, section, data = {}) {
        console.log('Updating Section');
        const startTime = performance.now();

        try {
            const oldElement = this.sectionElements.get(sectionId);
            if (!oldElement) {
                console.warn(`Section ${sectionId} not found for update`);
                return;
            }

            // Save scroll position if needed
            this.saveScrollPosition(oldElement);

            // Generate new HTML
            const html = SectionRenderer.generateSectionHTML(section, data);
            const newElement = this.createElementFromHTML(html);

            // Unmount reactivity from old element
            if (this.reactivityAdapter) {
                const oldContent = oldElement.querySelector('.section-content');
                if (oldContent) {
                    this.reactivityAdapter.unmount(oldContent);
                }
            }

            // Replace in DOM
            oldElement.replaceWith(newElement);

            // Update reference
            this.sectionElements.set(sectionId, newElement);

            // Mount reactivity on new element
            if (this.reactivityAdapter) {
                const newContent = newElement.querySelector('.section-content');
                if (newContent) {
                    this.reactivityAdapter.mount(newContent);
                }
            }

            // Restore scroll position if saved
            this.restoreScrollPosition(newElement, sectionId);

            const duration = performance.now() - startTime;
            console.debug(`Section ${sectionId} updated in ${duration.toFixed(2)}ms`);
        } catch (error) {
            console.error('Error updating section:', error);
            throw error;
        }
    }

    /**
     * Remove section from canvas
     * @param {string} sectionId - Section ID
     */
    removeSection(sectionId) {
        try {
            const element = this.sectionElements.get(sectionId);
            if (!element) {
                console.warn(`Section ${sectionId} not found for removal`);
                return;
            }

            // Unmount reactivity
            if (this.reactivityAdapter) {
                const contentElement = element.querySelector('.section-content');
                if (contentElement) {
                    this.reactivityAdapter.unmount(contentElement);
                }
            }

            // Remove from DOM
            element.remove();

            // Clean up references
            this.sectionElements.delete(sectionId);
            this.scrollPositions.delete(sectionId);

            console.debug(`Section ${sectionId} removed`);
        } catch (error) {
            console.error('Error removing section:', error);
            throw error;
        }
    }

    /**
     * Reorder section to new position
     * @param {string} sectionId - Section ID
     * @param {number} newIndex - New position
     */
    reorderSection(sectionId, newIndex) {
        try {
            const element = this.sectionElements.get(sectionId);
            if (!element) {
                console.warn(`Section ${sectionId} not found for reordering`);
                return;
            }

            const allSections = this.getAllSectionElements();
            const currentIndex = allSections.indexOf(element);

            if (currentIndex === -1 || currentIndex === newIndex) {
                return;
            }

            // Use CSS transform for smooth animation before DOM change
            const distance = (newIndex - currentIndex) * element.offsetHeight;
            element.style.transition = 'transform 0.3s ease';
            element.style.transform = `translateY(${distance}px)`;

            // Wait for animation, then update DOM
            setTimeout(() => {
                element.style.transition = '';
                element.style.transform = '';

                // Remove from current position
                element.remove();

                // Insert at new position
                if (newIndex >= allSections.length - 1) {
                    this.canvas.appendChild(element);
                } else {
                    const targetSection = allSections[newIndex > currentIndex ? newIndex + 1 : newIndex];
                    if (targetSection) {
                        this.canvas.insertBefore(element, targetSection);
                    }
                }

                console.debug(`Section ${sectionId} reordered to index ${newIndex}`);
            }, 300);
        } catch (error) {
            console.error('Error reordering section:', error);
            throw error;
        }
    }

    /**
     * Clear all sections from canvas
     */
    clear() {
        try {
            // Unmount all reactivity
            if (this.reactivityAdapter) {
                this.sectionElements.forEach(element => {
                    const contentElement = element.querySelector('.section-content');
                    if (contentElement) {
                        this.reactivityAdapter.unmount(contentElement);
                    }
                });
            }

            // Clear canvas
            this.canvas.innerHTML = '';

            // Clear references
            this.sectionElements.clear();
            this.scrollPositions.clear();

            console.debug('Canvas cleared');
        } catch (error) {
            console.error('Error clearing canvas:', error);
            throw error;
        }
    }

    /**
     * Get section element by ID
     * @param {string} sectionId - Section ID
     * @returns {HTMLElement|null}
     */
    getSection(sectionId) {
        return this.sectionElements.get(sectionId) || null;
    }

    /**
     * Get all section elements in order
     * @returns {Array<HTMLElement>}
     */
    getAllSectionElements() {
        return Array.from(this.canvas.querySelectorAll('[data-section-id]'));
    }

    /**
     * Get all section IDs in order
     * @returns {Array<string>}
     */
    getAllSectionIds() {
        return this.getAllSectionElements().map(el => el.getAttribute('data-section-id'));
    }

    /**
     * Create HTMLElement from HTML string
     * @param {string} html - HTML string
     * @returns {HTMLElement}
     */
    createElementFromHTML(html) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.firstElementChild;
    }

    /**
     * Save scroll position of scrollable content
     * @param {HTMLElement} element - Section element
     */
    saveScrollPosition(element) {
        const scrollableContent = element.querySelector('[data-scrollable]');
        if (scrollableContent && scrollableContent.scrollTop > 0) {
            const sectionId = element.getAttribute('data-section-id');
            this.scrollPositions.set(sectionId, scrollableContent.scrollTop);
        }
    }

    /**
     * Restore scroll position after update
     * @param {HTMLElement} element - New section element
     * @param {string} sectionId - Section ID
     */
    restoreScrollPosition(element, sectionId) {
        const savedPosition = this.scrollPositions.get(sectionId);
        if (savedPosition) {
            const scrollableContent = element.querySelector('[data-scrollable]');
            if (scrollableContent) {
                scrollableContent.scrollTop = savedPosition;
            }
            this.scrollPositions.delete(sectionId);
        }
    }

    /**
     * Batch render multiple sections
     * @param {Array<Object>} sections - Array of section objects
     * @param {Object} dataMap - Map of sectionId to data
     */
    batchRender(sections, dataMap = {}) {
        console.log('Batch Rendering Sections: ', sections);
        const startTime = performance.now();

        try {
            // Use DocumentFragment for better performance
            const fragment = document.createDocumentFragment();
            const elementsToMount = [];

            sections.forEach(section => {
                const data = dataMap[section.id] || {};
                const html = SectionRenderer.generateSectionHTML(section, data);
                const element = this.createElementFromHTML(html);

                this.sectionElements.set(section.id, element);
                fragment.appendChild(element);

                const contentElement = element.querySelector('.section-content');
                if (contentElement) {
                    elementsToMount.push(contentElement);
                }
            });

            // Single DOM operation
            this.canvas.appendChild(fragment);

            // Mount reactivity on all sections
            if (this.reactivityAdapter) {
                elementsToMount.forEach(element => {
                    this.reactivityAdapter.mount(element);
                });
            }

            const duration = performance.now() - startTime;
            console.debug(`Batch rendered ${sections.length} sections in ${duration.toFixed(2)}ms`);
        } catch (error) {
            console.error('Error in batch render:', error);
            throw error;
        }
    }

    /**
     * Set canvas mode (edit/preview)
     * @param {string} mode - 'edit' or 'preview'
     */
    setMode(mode) {
        this.canvas.setAttribute('data-mode', mode);
    }

    /**
     * Destroy canvas manager and clean up
     */
    destroy() {
        this.clear();
        this.canvas.removeAttribute('data-builder-canvas');
        this.canvas.removeAttribute('data-mode');
    }
}

export default CanvasManager;
