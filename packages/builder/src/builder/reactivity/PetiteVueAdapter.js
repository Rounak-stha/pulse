import { createApp } from 'petite-vue';

import ReactivityAdapter from './ReactivityAdapter.js';

/**
 * Petite-vue Reactivity Adapter
 * Implements reactivity using petite-vue with isolated app instances per section
 */
class PetiteVueAdapter extends ReactivityAdapter {
    constructor() {
        super();
        // WeakMap to track app instances per element
        // WeakMap automatically handles cleanup when elements are garbage collected
        this.appInstances = new WeakMap();
        // Track enhanced elements
        this.enhancedElements = new WeakSet();
        console.info('PetiteVueAdapter initialized');
    }

    /**
     * Mount petite-vue on an element
     * Creates an isolated app instance for the element
     * @param {HTMLElement} element - Element to enhance
     */
    mount(element) {
        if (!element) {
            console.warn('PetiteVueAdapter.mount: No element provided');
            return;
        }

        // Check if already enhanced to avoid duplicate mounting
        if (this.isEnhanced(element)) {
            console.warn('Element already enhanced, skipping mount');
            return;
        }

        try {
            // Find all v-scope elements within this element
            const scopeElements = this.findScopeElements(element);

            if (scopeElements.length === 0) {
                console.debug('No v-scope elements found, skipping mount');
                return;
            }

            // Create isolated app instance for this element
            // This prevents reactivity conflicts between sections
            const app = createApp();

            // Mount the app on the element
            app.mount(element);

            // Store app instance for later unmounting
            this.appInstances.set(element, app);
            this.enhancedElements.add(element);

            console.debug('Petite-vue mounted on element:', element);
        } catch (error) {
            console.error('Error mounting petite-vue:', error);
            throw error;
        }
    }

    /**
     * Unmount petite-vue from an element
     * @param {HTMLElement} element - Element to clean up
     */
    unmount(element) {
        if (!element) {
            console.warn('PetiteVueAdapter.unmount: No element provided');
            return;
        }

        if (!this.isEnhanced(element)) {
            console.debug('Element not enhanced, skipping unmount');
            return;
        }

        try {
            const app = this.appInstances.get(element);

            if (app && typeof app.unmount === 'function') {
                app.unmount();
                console.debug('Petite-vue unmounted from element');
            }

            // Clean up references
            this.appInstances.delete(element);
            this.enhancedElements.delete(element);
        } catch (error) {
            console.error('Error unmounting petite-vue:', error);
            // Don't throw - cleanup should be forgiving
        }
    }

    /**
     * Remount petite-vue (more efficient than unmount + mount)
     * @param {HTMLElement} element - Element to re-enhance
     */
    remount(element) {
        if (!element) {
            console.warn('PetiteVueAdapter.remount: No element provided');
            return;
        }

        // For petite-vue, we need to fully unmount and remount
        // because the reactive data might have changed
        this.unmount(element);
        this.mount(element);
    }

    /**
     * Check if element is already enhanced
     * @param {HTMLElement} element - Element to check
     * @returns {boolean}
     */
    isEnhanced(element) {
        return this.enhancedElements.has(element);
    }

    /**
     * Get adapter name
     * @returns {string}
     */
    getName() {
        return 'petite-vue';
    }

    /**
     * Get adapter info
     * @returns {Object}
     */
    getInfo() {
        return {
            name: this.getName(),
            version: '0.4.1',
            enhancedCount: this.getEnhancedCount(),
        };
    }

    /**
     * Get count of currently enhanced elements
     * Note: WeakSet doesn't have a size property, so we track manually
     * @returns {number}
     */
    getEnhancedCount() {
        // This is an approximation since WeakSet doesn't provide size
        // In production, you might want to track this separately
        return 'N/A (WeakSet)';
    }

    /**
     * Find all elements with v-scope within a container
     * @param {HTMLElement} container - Container element
     * @returns {Array<HTMLElement>}
     */
    findScopeElements(container) {
        const elements = [];

        // Check if container itself has v-scope
        if (container.hasAttribute('v-scope')) {
            elements.push(container);
        }

        // Find all descendants with v-scope
        const descendants = container.querySelectorAll('[v-scope]');
        elements.push(...Array.from(descendants));

        return elements;
    }

    /**
     * Batch mount multiple elements
     * @param {Array<HTMLElement>} elements - Elements to enhance
     */
    batchMount(elements) {
        if (!Array.isArray(elements)) {
            console.warn('batchMount expects an array of elements');
            return;
        }

        elements.forEach(element => {
            this.mount(element);
        });
    }

    /**
     * Batch unmount multiple elements
     * @param {Array<HTMLElement>} elements - Elements to clean up
     */
    batchUnmount(elements) {
        if (!Array.isArray(elements)) {
            console.warn('batchUnmount expects an array of elements');
            return;
        }

        elements.forEach(element => {
            this.unmount(element);
        });
    }

    /**
     * Destroy adapter and clean up all instances
     */
    destroy() {
        console.info('Destroying PetiteVueAdapter');

        // WeakMap and WeakSet will be garbage collected automatically
        // but we can help by clearing references
        this.appInstances = new WeakMap();
        this.enhancedElements = new WeakSet();
    }
}

export default PetiteVueAdapter;
