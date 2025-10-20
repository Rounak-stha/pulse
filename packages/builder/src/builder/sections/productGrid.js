import SectionRenderer from '../renderer/SectionRenderer.js';

/**
 * Product Grid Section Definition
 * Display products in a responsive grid layout
 */
export default {
    type: 'product-grid',
    name: 'Product Grid',
    category: 'Products',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
  </svg>`,

    defaults: {
        title: 'Featured Products',
        showTitle: true,
        collection: 'featured',
        limit: 8,
        columns: 4,
        columnsTablet: 3,
        columnsMobile: 2,
        showRating: true,
        showPrice: true,
        showAddToCart: true,
        style: 'modern',
        cardStyle: 'elevated',
        spacing: 'normal',
    },

    schema: [
        {
            key: 'title',
            type: 'text',
            label: 'Section Title',
            placeholder: 'e.g., Featured Products',
            category: 'Content',
        },
        {
            key: 'showTitle',
            type: 'toggle',
            label: 'Show Title',
            category: 'Content',
        },
        {
            key: 'collection',
            type: 'select',
            label: 'Show Products From',
            options: 'dynamic:collections',
            category: 'Content',
        },
        {
            key: 'limit',
            type: 'number',
            label: 'Number of Products',
            min: 1,
            max: 50,
            default: 8,
            category: 'Content',
        },
        {
            key: 'columns',
            type: 'slider',
            label: 'Columns (Desktop)',
            min: 2,
            max: 6,
            default: 4,
            category: 'Layout',
        },
        {
            key: 'columnsTablet',
            type: 'slider',
            label: 'Columns (Tablet)',
            min: 2,
            max: 4,
            default: 3,
            category: 'Layout',
        },
        {
            key: 'columnsMobile',
            type: 'slider',
            label: 'Columns (Mobile)',
            min: 1,
            max: 3,
            default: 2,
            category: 'Layout',
        },
        {
            key: 'showRating',
            type: 'toggle',
            label: 'Show Product Rating',
            category: 'Display',
        },
        {
            key: 'showPrice',
            type: 'toggle',
            label: 'Show Price',
            category: 'Display',
        },
        {
            key: 'showAddToCart',
            type: 'toggle',
            label: 'Show Add to Cart Button',
            category: 'Display',
        },
        {
            key: 'style',
            type: 'select',
            label: 'Visual Style',
            options: [
                { value: 'modern', label: 'Modern' },
                { value: 'minimal', label: 'Minimal' },
                { value: 'bold', label: 'Bold' },
            ],
            category: 'Design',
        },
        {
            key: 'cardStyle',
            type: 'select',
            label: 'Card Style',
            options: [
                { value: 'flat', label: 'Flat' },
                { value: 'elevated', label: 'Elevated (Shadow)' },
                { value: 'outlined', label: 'Outlined' },
            ],
            category: 'Design',
        },
        {
            key: 'spacing',
            type: 'select',
            label: 'Grid Spacing',
            options: [
                { value: 'compact', label: 'Compact' },
                { value: 'normal', label: 'Normal' },
                { value: 'relaxed', label: 'Relaxed' },
            ],
            category: 'Layout',
        },
    ],

    render: (settings, data) => {
        const {
            title,
            showTitle,
            columns,
            columnsTablet,
            columnsMobile,
            showRating,
            showPrice,
            showAddToCart,
            style,
            cardStyle,
            spacing,
        } = settings;

        const products = data.products || [];

        // Grid column classes
        const columnClasses = {
            2: 'sm:grid-cols-2',
            3: 'sm:grid-cols-3',
            4: 'sm:grid-cols-2 lg:grid-cols-4',
            5: 'sm:grid-cols-3 lg:grid-cols-5',
            6: 'sm:grid-cols-3 lg:grid-cols-6',
        };

        const tabletClasses = {
            2: 'md:grid-cols-2',
            3: 'md:grid-cols-3',
            4: 'md:grid-cols-4',
        };

        const mobileClasses = {
            1: 'grid-cols-1',
            2: 'grid-cols-2',
            3: 'grid-cols-3',
        };

        // Spacing classes
        const gapClasses = {
            compact: 'gap-4',
            normal: 'gap-6',
            relaxed: 'gap-8',
        };

        // Card style classes
        const cardClasses = {
            flat: 'bg-white',
            elevated: 'bg-white shadow-md hover:shadow-xl transition-shadow duration-300',
            outlined: 'bg-white border-2 border-gray-200 hover:border-gray-300',
        };

        return `
      <section class="product-grid-section py-12 px-4 sm:px-6 lg:px-8 h-64" ${SectionRenderer.sectionVScope(settings, data)}>
        <div class="max-w-7xl mx-auto">
          
          ${
              showTitle && title
                  ? `
            <div class="mb-8 text-center">
              <h2 class="text-3xl md:text-4xl font-bold text-gray-900" v-text="settings.title">
                ${SectionRenderer.escapeHTML(title)}
              </h2>
            </div>
          `
                  : ''
          }

          <div class="grid ${mobileClasses[columnsMobile] || 'grid-cols-2'} ${tabletClasses[columnsTablet] || 'md:grid-cols-3'} ${columnClasses[columns] || 'lg:grid-cols-4'} ${gapClasses[spacing] || 'gap-6'}">
            
            ${products
                .map(
                    (product, index) => `
              <div 
                class="product-card ${cardClasses[cardStyle] || cardClasses.elevated} rounded-lg overflow-hidden group"
                :key="data.products[${index}].id"
              >
                <!-- Product Info -->
                <div class="p-4">
                  <!-- Product Name -->
                  <h3 
                    class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2"
                    v-text="data.products[${index}].name"
                  >
                    ${SectionRenderer.escapeHTML(product.name)}
                  </h3>

                  ${
                      showRating
                          ? `
                    <!-- Rating -->
                    <div class="flex items-center gap-2 mb-2">
                      <div class="flex text-yellow-400">
                        ${Array(5)
                            .fill(0)
                            .map(
                                (_, i) => `
                          <svg 
                            class="w-4 h-4 ${i < Math.floor(product.rating || 4.5) ? 'fill-current' : 'fill-gray-300'}" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        `,
                            )
                            .join('')}
                      </div>
                      <span class="text-sm text-gray-600" v-text="'(' + data.products[${index}].reviews + ')'">
                        (${product.reviews || 0})
                      </span>
                    </div>
                  `
                          : ''
                  }

                  ${
                      showPrice
                          ? `
                    <!-- Price -->
                    <div class="flex items-baseline gap-2">
                      <span 
                        class="text-xl font-bold text-gray-900"
                        v-text="' Product Image -->
                <div class="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    :src="data.products[${index}].image"
                    :alt="data.products[${index}].name"
                    src="${SectionRenderer.escapeHTML(product.image)}"
                    alt="${SectionRenderer.escapeHTML(product.name)}"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  ${
                      showAddToCart
                          ? `
                    <button
                      class="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gray-900 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-800"
                      @click="console.log('Add to cart:', data.products[${index}].id)"
                    >
                      Add to Cart
                    </button>
                  `
                          : ''
                  }
                </div>

                <!-- + data.products[${index}].price.toFixed(2)"
                      >
                        ${product.price?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  `
                          : ''
                  }
                </div>
              </div>
            `,
                )
                .join('')}

          </div>

          ${
              products.length === 0
                  ? `
            <div class="text-center py-12">
              <p class="text-gray-500 text-lg">No products to display</p>
            </div>
          `
                  : ''
          }

        </div>
      </section>
    `;
    },
};
