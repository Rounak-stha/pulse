import SectionRenderer from '../renderer/SectionRenderer.js';

/**
 * Hero Section Definition
 * Full-width hero banner with headline, subtext, and CTA
 */
export default {
    type: 'hero',
    name: 'Hero Banner',
    category: 'Hero',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" stroke-width="2"/>
    <path d="M8 11h8M8 14h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

    defaults: {
        headline: 'Welcome to Our Store',
        subtext: 'Discover amazing products at unbeatable prices',
        ctaText: 'Shop Now',
        ctaLink: '/collections/all',
        backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=800&fit=crop',
        overlay: true,
        overlayOpacity: 0.4,
        textAlign: 'center',
        textColor: 'white',
        height: 'medium',
        style: 'modern',
    },

    schema: [
        {
            key: 'headline',
            type: 'text',
            label: 'Headline',
            placeholder: 'Enter headline',
            required: true,
            category: 'Content',
        },
        {
            key: 'subtext',
            type: 'textarea',
            label: 'Subtext',
            placeholder: 'Enter supporting text',
            category: 'Content',
        },
        {
            key: 'ctaText',
            type: 'text',
            label: 'Button Text',
            placeholder: 'e.g., Shop Now',
            category: 'Content',
        },
        {
            key: 'ctaLink',
            type: 'text',
            label: 'Button Link',
            placeholder: '/collections/all',
            category: 'Content',
        },
        {
            key: 'backgroundImage',
            type: 'image',
            label: 'Background Image',
            category: 'Design',
        },
        {
            key: 'overlay',
            type: 'toggle',
            label: 'Show Overlay',
            category: 'Design',
        },
        {
            key: 'overlayOpacity',
            type: 'slider',
            label: 'Overlay Opacity',
            min: 0,
            max: 1,
            step: 0.1,
            category: 'Design',
            dependsOn: { overlay: true },
        },
        {
            key: 'textAlign',
            type: 'select',
            label: 'Text Alignment',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' },
            ],
            category: 'Layout',
        },
        {
            key: 'textColor',
            type: 'select',
            label: 'Text Color',
            options: [
                { value: 'white', label: 'White' },
                { value: 'black', label: 'Black' },
            ],
            category: 'Design',
        },
        {
            key: 'height',
            type: 'select',
            label: 'Section Height',
            options: [
                { value: 'small', label: 'Small (400px)' },
                { value: 'medium', label: 'Medium (600px)' },
                { value: 'large', label: 'Large (800px)' },
                { value: 'fullscreen', label: 'Full Screen' },
            ],
            category: 'Layout',
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
    ],

    render: (settings, data) => {
        const {
            headline,
            subtext,
            ctaText,
            ctaLink,
            backgroundImage,
            overlay,
            overlayOpacity,
            textAlign,
            textColor,
            height,
            style,
        } = settings;

        // Height classes
        const heightClasses = {
            small: 'h-[200px]',
            medium: 'h-[200px]',
            large: 'h-[200px]',
            fullscreen: 'min-h-screen',
        };

        // Text alignment classes
        const alignClasses = {
            left: 'text-left items-start',
            center: 'text-center items-center',
            right: 'text-right items-end',
        };

        // Text color classes
        const colorClasses = {
            white: 'text-white',
            black: 'text-gray-900',
        };

        // Style-specific classes
        const styleClasses = {
            modern: 'font-sans',
            minimal: 'font-light',
            bold: 'font-bold',
        };

        const headlineSizeClasses = {
            modern: 'text-5xl md:text-6xl lg:text-7xl',
            minimal: 'text-4xl md:text-5xl lg:text-6xl',
            bold: 'text-6xl md:text-7xl lg:text-8xl',
        };

        return `
      <section 
        class="hero-section relative ${heightClasses[height] || heightClasses.medium} w-full overflow-hidden"
        ${SectionRenderer.sectionVScope(settings, data)}
      >
        <!-- Background Image -->
        <div 
          class="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style="background-image: url('${SectionRenderer.escapeHTML(backgroundImage)}');"
        ></div>

        <!-- Overlay -->
        ${
            overlay
                ? `
          <div 
            class="absolute inset-0 bg-black"
            style="opacity: ${overlayOpacity};"
          ></div>
        `
                : ''
        }

        <!-- Content -->
        <div class="relative h-full flex flex-col justify-center ${alignClasses[textAlign] || alignClasses.center} px-4 sm:px-6 lg:px-8">
          <div class="max-w-7xl mx-auto w-full">
            <div class="max-w-3xl ${textAlign === 'center' ? 'mx-auto' : textAlign === 'right' ? 'ml-auto' : ''}">
              
              <!-- Headline -->
              <h1 
                class="${headlineSizeClasses[style] || headlineSizeClasses.modern} ${styleClasses[style] || styleClasses.modern} ${colorClasses[textColor] || colorClasses.white} font-bold mb-6 leading-tight"
                v-text="settings.headline"
              >
                ${SectionRenderer.escapeHTML(headline)}
              </h1>

              <!-- Subtext -->
              ${
                  subtext
                      ? `
                <p 
                  class="text-xl md:text-2xl ${colorClasses[textColor] || colorClasses.white} mb-8 opacity-90"
                  v-text="settings.subtext"
                >
                  ${SectionRenderer.escapeHTML(subtext)}
                </p>
              `
                      : ''
              }

              <!-- CTA Button -->
              ${
                  ctaText
                      ? `
                <div>
                  <a 
                    :href="settings.ctaLink"
                    class="inline-block px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 ${
                        textColor === 'white'
                            ? 'bg-white text-gray-900 hover:bg-gray-100'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                    } shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    v-text="settings.ctaText"
                  >
                    ${SectionRenderer.escapeHTML(ctaText)}
                  </a>
                </div>
              `
                      : ''
              }

            </div>
          </div>
        </div>
      </section>
    `;
    },
};
