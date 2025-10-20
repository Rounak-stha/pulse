/**
 * Section Registry
 * Manages catalog of available section types with their schemas and render functions
 */
class SectionRegistry {
    constructor() {
        this.sections = new Map();
        this.categories = new Set();
    }

    /**
     * Register a new section type
     * @param {Object} definition - Section definition
     */
    register(definition) {
        const { type, name, category, icon, defaults, schema, render } = definition;

        // Validation
        if (!type) throw new Error('Section type is required');
        if (!name) throw new Error('Section name is required');
        if (!render || typeof render !== 'function') {
            throw new Error('Section render function is required');
        }

        if (this.sections.has(type)) {
            console.warn(`Section type "${type}" already registered. Overwriting.`);
        }

        this.sections.set(type, {
            type,
            name,
            category: category || 'Other',
            icon: icon || '',
            defaults: defaults || {},
            schema: schema || [],
            render,
        });

        if (category) {
            this.categories.add(category);
        }
    }

    /**
     * Get a section definition by type
     * @param {string} type - Section type
     * @returns {Object|null} Section definition
     */
    get(type) {
        return this.sections.get(type) || null;
    }

    /**
     * Get all registered sections
     * @returns {Array} Array of section definitions
     */
    getAll() {
        return Array.from(this.sections.values());
    }

    /**
     * Get sections by category
     * @param {string} category - Category name
     * @returns {Array} Array of section definitions in category
     */
    getByCategory(category) {
        return this.getAll().filter(section => section.category === category);
    }

    /**
     * Get all categories
     * @returns {Array} Array of category names
     */
    getCategories() {
        return Array.from(this.categories).sort();
    }

    /**
     * Check if a section type exists
     * @param {string} type - Section type
     * @returns {boolean}
     */
    has(type) {
        return this.sections.has(type);
    }

    /**
     * Create a new section instance with defaults
     * @param {string} type - Section type
     * @param {Object} overrides - Settings to override defaults
     * @returns {Object} New section instance
     */
    createSection(type, overrides = {}) {
        const definition = this.get(type);
        if (!definition) {
            throw new Error(`Section type "${type}" not found`);
        }

        return {
            type,
            settings: {
                ...definition.defaults,
                ...overrides,
            },
        };
    }

    /**
     * Validate section settings against schema
     * @param {string} type - Section type
     * @param {Object} settings - Settings to validate
     * @returns {Object} { valid: boolean, errors: Array }
     */
    validate(type, settings) {
        const definition = this.get(type);
        if (!definition) {
            return {
                valid: false,
                errors: [`Section type "${type}" not found`],
            };
        }

        const errors = [];
        const { schema } = definition;

        schema.forEach(field => {
            const { key, type: fieldType, required, min, max } = field;
            const value = settings[key];

            // Check required fields
            if (required && (value === undefined || value === null || value === '')) {
                errors.push(`Field "${key}" is required`);
                return;
            }

            // Type-specific validation
            if (value !== undefined && value !== null) {
                switch (fieldType) {
                    case 'number':
                    case 'slider':
                        if (typeof value !== 'number') {
                            errors.push(`Field "${key}" must be a number`);
                        } else {
                            if (min !== undefined && value < min) {
                                errors.push(`Field "${key}" must be >= ${min}`);
                            }
                            if (max !== undefined && value > max) {
                                errors.push(`Field "${key}" must be <= ${max}`);
                            }
                        }
                        break;

                    case 'boolean':
                    case 'toggle':
                        if (typeof value !== 'boolean') {
                            errors.push(`Field "${key}" must be a boolean`);
                        }
                        break;

                    case 'select':
                    case 'radio':
                        if (field.options && Array.isArray(field.options)) {
                            const validValues = field.options.map(opt =>
                                typeof opt === 'object' ? opt.value : opt,
                            );
                            if (!validValues.includes(value)) {
                                errors.push(`Field "${key}" has invalid value`);
                            }
                        }
                        break;
                }
            }
        });

        return {
            valid: errors.length === 0,
            errors,
        };
    }

    /**
     * Get schema for a section type
     * @param {string} type - Section type
     * @returns {Array} Schema definition
     */
    getSchema(type) {
        const definition = this.get(type);
        return definition ? definition.schema : [];
    }

    /**
     * Get defaults for a section type
     * @param {string} type - Section type
     * @returns {Object} Default settings
     */
    getDefaults(type) {
        const definition = this.get(type);
        return definition ? { ...definition.defaults } : {};
    }

    /**
     * Clear all registered sections (useful for testing)
     */
    clear() {
        this.sections.clear();
        this.categories.clear();
    }
}

// Export singleton instance
const SectionRegistrySingleton = new SectionRegistry();
export default SectionRegistrySingleton;
