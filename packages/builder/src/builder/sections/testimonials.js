import SectionRenderer from '../renderer/SectionRenderer.js';

/**
 * Testimonials Section Definition
 * Display customer testimonials in various layouts
 */
export default {
    type: 'testimonials',
    name: 'Testimonials',
    category: 'Social Proof',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
  </svg>`,

    defaults: {
        title: 'What Our Customers Say',
        showTitle: true,
        layout: 'grid',
        columns: 3,
        showAvatar: true,
        showRating: true,
        backgroundColor: 'white',
        textAlign: 'left',
    },

    schema: [
        {
            key: 'title',
            type: 'text',
            label: 'Section Title',
            placeholder: 'e.g., Customer Testimonials',
            category: 'Content',
        },
        {
            key: 'showTitle',
            type: 'toggle',
            label: 'Show Title',
            category: 'Content',
        },
        {
            key: 'layout',
            type: 'select',
            label: 'Layout',
            options: [
                { value: 'grid', label: 'Grid' },
                { value: 'carousel', label: 'Carousel' },
                { value: 'masonry', label: 'Masonry' },
            ],
            category: 'Layout',
        },
        {
            key: 'columns',
            type: 'slider',
            label: 'Columns',
            min: 1,
            max: 4,
            default: 3,
            category: 'Layout',
        },
        {
            key: 'showAvatar',
            type: 'toggle',
            label: 'Show Avatar',
            category: 'Display',
        },
        {
            key: 'showRating',
            type: 'toggle',
            label: 'Show Rating',
            category: 'Display',
        },
        {
            key: 'backgroundColor',
            type: 'select',
            label: 'Background Color',
            options: [
                { value: 'white', label: 'White' },
                { value: 'gray', label: 'Gray' },
                { value: 'blue', label: 'Blue' },
            ],
            category: 'Design',
        },
        {
            key: 'textAlign',
            type: 'select',
            label: 'Text Alignment',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
            ],
            category: 'Design',
        },
    ],

    render: (settings, data) => {
        const { title, showTitle, layout, columns, showAvatar, showRating, backgroundColor, textAlign } =
            settings;

        const testimonials = data.testimonials || [];

        const bgClasses = {
            white: 'bg-white',
            gray: 'bg-gray-50',
            blue: 'bg-blue-50',
        };

        const columnClasses = {
            1: 'grid-cols-1',
            2: 'grid-cols-1 md:grid-cols-2',
            3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
            4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        };

        const alignClasses = {
            left: 'text-left',
            center: 'text-center',
        };

        return `
      <section
        class="testimonials-section py-16 px-4 sm:px-6 lg:px-8 ${bgClasses[backgroundColor] || bgClasses.white}"
        ${SectionRenderer.sectionVScope(settings, data)}
      >
        <div class="max-w-7xl mx-auto">

          ${
              showTitle && title
                  ? `
            <div class="mb-12 text-center">
              <h2 class="text-3xl md:text-4xl font-bold text-gray-900" v-text="settings.title">
                ${SectionRenderer.escapeHTML(title)}
              </h2>
            </div>
          `
                  : ''
          }

          <div class="grid ${columnClasses[columns] || columnClasses[3]} gap-8">
            ${testimonials
                .map(
                    (testimonial, index) => `
              <div class="testimonial-card bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">

                ${
                    showRating
                        ? `
                  <div class="flex text-yellow-400 mb-4">
                    ${Array(5)
                        .fill(0)
                        .map(
                            (_, i) => `
                      <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    `,
                        )
                        .join('')}
                  </div>
                `
                        : ''
                }

                <blockquote class="${alignClasses[textAlign] || alignClasses.left} mb-6">
                  <p
                    class="text-gray-700 italic"
                    v-text="data.testimonials[${index}].text"
                  >
                    "${SectionRenderer.escapeHTML(testimonial.text)}"
                  </p>
                </blockquote>

                <div class="flex items-center ${textAlign === 'center' ? 'justify-center' : ''}">
                  ${
                      showAvatar
                          ? `
                    <img
                      :src="data.testimonials[${index}].avatar"
                      :alt="data.testimonials[${index}].name"
                      src="${SectionRenderer.escapeHTML(testimonial.avatar)}"
                      alt="${SectionRenderer.escapeHTML(testimonial.name)}"
                      class="w-12 h-12 rounded-full object-cover mr-4"
                    />
                  `
                          : ''
                  }

                  <div class="${textAlign === 'center' && !showAvatar ? 'text-center' : ''}">
                    <p
                      class="font-semibold text-gray-900"
                      v-text="data.testimonials[${index}].name"
                    >
                      ${SectionRenderer.escapeHTML(testimonial.name)}
                    </p>
                    <p
                      class="text-sm text-gray-500"
                      v-text="data.testimonials[${index}].role"
                    >
                      ${SectionRenderer.escapeHTML(testimonial.role)}
                    </p>
                  </div>
                </div>
              </div>
            `,
                )
                .join('')}
          </div>

          ${
              testimonials.length === 0
                  ? `
            <div class="text-center py-12">
              <p class="text-gray-500 text-lg">No testimonials to display</p>
            </div>
          `
                  : ''
          }

        </div>
      </section>
    `;
    },
};
