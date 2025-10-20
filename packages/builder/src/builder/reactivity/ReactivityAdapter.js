/**
 * Reactivity Adapter - Base Interface
 * Abstract class defining the contract for reactivity implementations
 */
class ReactivityAdapter {
  constructor() {
    if (this.constructor === ReactivityAdapter) {
      throw new Error('ReactivityAdapter is an abstract class and cannot be instantiated directly');
    }
  }

  /**
   * Initialize reactivity on an element
   * @param {HTMLElement} element - Element to enhance
   * @returns {void}
   */
  mount(element) {
    throw new Error('mount() must be implemented by subclass');
  }

  /**
   * Clean up reactivity from an element
   * @param {HTMLElement} element - Element to clean up
   * @returns {void}
   */
  unmount(element) {
    throw new Error('unmount() must be implemented by subclass');
  }

  /**
   * Efficiently re-initialize reactivity (should be faster than unmount + mount)
   * @param {HTMLElement} element - Element to re-enhance
   * @returns {void}
   */
  remount(element) {
    // Default implementation: unmount then mount
    this.unmount(element);
    this.mount(element);
  }

  /**
   * Check if element is already enhanced with reactivity
   * @param {HTMLElement} element - Element to check
   * @returns {boolean}
   */
  isEnhanced(element) {
    throw new Error('isEnhanced() must be implemented by subclass');
  }

  /**
   * Get the name of this adapter
   * @returns {string}
   */
  getName() {
    throw new Error('getName() must be implemented by subclass');
  }

  /**
   * Optional: Get configuration/debug info
   * @returns {Object}
   */
  getInfo() {
    return {
      name: this.getName(),
      version: '1.0.0'
    };
  }
}

export default ReactivityAdapter;