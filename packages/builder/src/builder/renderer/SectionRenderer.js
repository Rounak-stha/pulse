import SectionRegistry from '../core/SectionRegistry.js';

/**
 * Section Renderer
 * Pure functions for generating HTML from section definitions
 */
class SectionRenderer {
    /**
     * Generate complete HTML for a section
     * @param {Object} section - Section object with type and settings
     * @param {Object} data - Data to render (products, collections, etc.)
     * @returns {string} Complete section HTML with wrapper
     */
    static generateSectionHTML(section, data = {}) {
        const { id, type, settings } = section;
        const definition = SectionRegistry.get(type);

        if (!definition) {
            console.error(`Section type "${type}" not found in registry`);
            return this.generateErrorSection(id, `Unknown section type: ${type}`);
        }

        try {
            // Call section's render function
            const contentHTML = definition.render(settings, data);

            // Wrap in section container
            return this.generateSectionWrapper(id, type, contentHTML);
        } catch (error) {
            console.error(`Error rendering section ${id}:`, error);
            return this.generateErrorSection(id, error.message);
        }
    }

    /**
     * Generate section wrapper with controls and data attributes
     * @param {string} id - Section ID
     * @param {string} type - Section type
     * @param {string} contentHTML - Inner section HTML
     * @returns {string} Wrapped HTML
     */
    static generateSectionWrapper(id, type, contentHTML) {
        return `
      <div 
        class="section-wrapper" 
        data-section-id="${this.escapeHTML(id)}" 
        data-section-type="${this.escapeHTML(type)}"
        data-builder-section
      >
        <!-- Edit mode controls (CSS controlled visibility) -->
        <div class="section-controls" data-mode-visibility="edit">
          <div class="section-controls-inner">
            <button 
              class="section-control-btn section-move-up" 
              data-action="move-up"
              title="Move Up"
              aria-label="Move section up"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button 
              class="section-control-btn section-move-down" 
              data-action="move-down"
              title="Move Down"
              aria-label="Move section down"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div 
              class="drag-handle" 
              data-action="drag"
              title="Drag to reorder"
              aria-label="Drag to reorder section"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="5" r="1.5" fill="currentColor"/>
                <circle cx="15" cy="5" r="1.5" fill="currentColor"/>
                <circle cx="9" cy="12" r="1.5" fill="currentColor"/>
                <circle cx="15" cy="12" r="1.5" fill="currentColor"/>
                <circle cx="9" cy="19" r="1.5" fill="currentColor"/>
                <circle cx="15" cy="19" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            <button 
              class="section-control-btn section-settings" 
              data-action="settings"
              title="Settings"
              aria-label="Section settings"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" stroke-width="2"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            <button 
              class="section-control-btn section-duplicate" 
              data-action="duplicate"
              title="Duplicate"
              aria-label="Duplicate section"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            <button 
              class="section-control-btn section-delete" 
              data-action="delete"
              title="Delete"
              aria-label="Delete section"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Actual section content -->
        <div class="section-content">
          ${contentHTML}
        </div>
      </div>
    `.trim();
    }

    /**
     * Generate error section HTML
     * @param {string} id - Section ID
     * @param {string} message - Error message
     * @returns {string} Error section HTML
     */
    static generateErrorSection(id, message) {
        return `
      <div 
        class="section-wrapper section-error" 
        data-section-id="${this.escapeHTML(id)}"
      >
        <div class="section-controls" data-mode-visibility="edit">
          <div class="section-controls-inner">
            <button 
              class="section-control-btn section-delete" 
              data-action="delete"
              title="Delete"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 4h10M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1m2 0v9a1 1 0 01-1 1H4a1 1 0 01-1-1V4h10z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="section-content">
          <div style="padding: 2rem; background: #fee; border: 2px dashed #f88; border-radius: 8px; text-align: center;">
            <p style="color: #c00; font-weight: 600; margin: 0 0 0.5rem 0;">⚠️ Section Error</p>
            <p style="color: #666; margin: 0; font-size: 0.875rem;">${this.escapeHTML(message)}</p>
          </div>
        </div>
      </div>
    `.trim();
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} str - String to escape
     * @returns {string} Escaped string
     */
    static escapeHTML(str) {
        if (typeof str !== 'string') return String(str);

        const escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
        };

        return str.replace(/[&<>"']/g, char => escapeMap[char]);
    }

    /**
     * Serialize data for embedding in HTML
     * Safely converts object to JSON string for v-scope attributes
     * @param {Object} obj - Object to serialize
     * @returns {string} JSON string safe for HTML attributes
     */
    static serializeData(obj) {
        try {
            const json = JSON.stringify(obj);
            // Escape quotes for HTML attribute safety
            return json.replace(/"/g, '&quot;');
        } catch (error) {
            console.error('Error serializing data:', error);
            return '{}';
        }
    }

    /**
     * Generate v-scope attribute with data
     * @param {Object} data - Data object for petite-vue
     * @returns {string} v-scope attribute string
     */
    static vScope(data) {
        return `v-scope="${this.serializeData(data)}"`;
    }

    /**
     * Generate v-scope for section with common data structure
     * @param {Object} settings - Section settings
     * @param {Object} data - Section data
     * @returns {string} v-scope attribute string
     */
    static sectionVScope(settings, data) {
        return this.vScope({
            settings: settings || {},
            data: data || {},
            // Common reactive properties that sections might use
            expanded: false,
            activeIndex: 0,
            isLoading: false,
        });
    }
}

export default SectionRenderer;
