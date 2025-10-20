/**
 * Data Provider
 * Provides mock data for builder preview and fetches real data from Vendure
 */
class DataProvider {
  constructor(options = {}) {
    this.options = {
      useMockData: true,
      vendureEndpoint: options.vendureEndpoint || '/graphql',
      cacheTimeout: 5 * 60 * 1000, // 5 minutes
      ...options
    };

    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  /**
   * Get data for a section
   * @param {string} sectionType - Section type
   * @param {Object} settings - Section settings
   * @returns {Promise<Object>} Section data
   */
  async getData(sectionType, settings = {}) {
    if (this.options.useMockData) {
      return this.getMockData(sectionType, settings);
    } else {
      return this.getRealData(sectionType, settings);
    }
  }

  /**
   * Get mock data for a section
   * @param {string} sectionType - Section type
   * @param {Object} settings - Section settings
   * @returns {Object} Mock data
   */
  getMockData(sectionType, settings = {}) {
    switch (sectionType) {
      case 'hero':
        return this.getMockHeroData(settings);
      
      case 'product-grid':
      case 'featured-products':
        return this.getMockProductData(settings);
      
      case 'testimonials':
        return this.getMockTestimonialData(settings);
      
      case 'collection-list':
        return this.getMockCollectionData(settings);
      
      default:
        return {};
    }
  }

  /**
   * Get mock hero data
   */
  getMockHeroData(settings) {
    return {
      images: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=800',
        'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600&h=800',
        'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&h=800'
      ]
    };
  }

  /**
   * Get mock product data
   */
  getMockProductData(settings) {
    const count = settings.limit || 8;
    const products = [];

    const mockProducts = [
      { name: 'Wireless Headphones', price: 99.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400' },
      { name: 'Smart Watch', price: 299.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400' },
      { name: 'Laptop Backpack', price: 49.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400' },
      { name: 'Coffee Maker', price: 79.99, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400' },
      { name: 'Running Shoes', price: 129.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400' },
      { name: 'Desk Lamp', price: 39.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400' },
      { name: 'Water Bottle', price: 24.99, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400' },
      { name: 'Yoga Mat', price: 34.99, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400' }
    ];

    for (let i = 0; i < count; i++) {
      const mockProduct = mockProducts[i % mockProducts.length];
      products.push({
        id: `product-${i + 1}`,
        name: mockProduct.name,
        price: mockProduct.price,
        image: mockProduct.image,
        rating: 4 + Math.random(),
        reviews: Math.floor(Math.random() * 500) + 10
      });
    }

    return { products };
  }

  /**
   * Get mock testimonial data
   */
  getMockTestimonialData(settings) {
    const testimonials = [
      {
        id: 1,
        name: 'Sarah Johnson',
        role: 'Product Designer',
        avatar: 'https://i.pravatar.cc/150?img=1',
        text: 'This product has completely transformed how I work. Highly recommended!',
        rating: 5
      },
      {
        id: 2,
        name: 'Michael Chen',
        role: 'Software Engineer',
        avatar: 'https://i.pravatar.cc/150?img=2',
        text: 'Outstanding quality and excellent customer service. Will definitely buy again.',
        rating: 5
      },
      {
        id: 3,
        name: 'Emily Rodriguez',
        role: 'Marketing Manager',
        avatar: 'https://i.pravatar.cc/150?img=3',
        text: 'Best purchase I\'ve made this year. Exceeded all my expectations!',
        rating: 5
      }
    ];

    return { testimonials };
  }

  /**
   * Get mock collection data
   */
  getMockCollectionData(settings) {
    const collections = [
      {
        id: 'collection-1',
        name: 'New Arrivals',
        slug: 'new-arrivals',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600',
        productCount: 24
      },
      {
        id: 'collection-2',
        name: 'Best Sellers',
        slug: 'best-sellers',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600',
        productCount: 18
      },
      {
        id: 'collection-3',
        name: 'Sale Items',
        slug: 'sale',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=600',
        productCount: 32
      }
    ];

    return { collections };
  }

  /**
   * Get real data from Vendure
   * @param {string} sectionType - Section type
   * @param {Object} settings - Section settings
   * @returns {Promise<Object>}
   */
  async getRealData(sectionType, settings = {}) {
    const cacheKey = `${sectionType}-${JSON.stringify(settings)}`;
    
    // Check cache
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    // Check if request is already pending
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    // Create new request
    const requestPromise = this.fetchFromVendure(sectionType, settings);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      const data = await requestPromise;
      this.setCache(cacheKey, data);
      return data;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  /**
   * Fetch data from Vendure GraphQL API
   * @param {string} sectionType - Section type
   * @param {Object} settings - Section settings
   * @returns {Promise<Object>}
   */
  async fetchFromVendure(sectionType, settings) {
    const query = this.buildQuery(sectionType, settings);
    
    if (!query) {
      console.warn(`No query builder for section type: ${sectionType}`);
      return {};
    }

    try {
      const response = await fetch(this.options.vendureEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        throw new Error('GraphQL query failed');
      }

      return this.transformVendureResponse(sectionType, result.data);
    } catch (error) {
      console.error('Error fetching from Vendure:', error);
      // Fallback to mock data on error
      return this.getMockData(sectionType, settings);
    }
  }

  /**
   * Build GraphQL query for section type
   * @param {string} sectionType - Section type
   * @param {Object} settings - Section settings
   * @returns {string} GraphQL query
   */
  buildQuery(sectionType, settings) {
    switch (sectionType) {
      case 'product-grid':
      case 'featured-products':
        return this.buildProductQuery(settings);
      
      case 'collection-list':
        return this.buildCollectionQuery(settings);
      
      default:
        return null;
    }
  }

  /**
   * Build product query
   */
  buildProductQuery(settings) {
    const limit = settings.limit || 10;
    const collectionSlug = settings.collection || '';

    return `
      query {
        products(options: { take: ${limit} }) {
          items {
            id
            name
            slug
            description
            featuredAsset {
              preview
            }
            variants {
              id
              price
              priceWithTax
            }
          }
        }
      }
    `;
  }

  /**
   * Build collection query
   */
  buildCollectionQuery(settings) {
    return `
      query {
        collections {
          items {
            id
            name
            slug
            featuredAsset {
              preview
            }
            productVariants {
              totalItems
            }
          }
        }
      }
    `;
  }

  /**
   * Transform Vendure response to section data format
   * @param {string} sectionType - Section type
   * @param {Object} data - Vendure response data
   * @returns {Object} Transformed data
   */
  transformVendureResponse(sectionType, data) {
    switch (sectionType) {
      case 'product-grid':
      case 'featured-products':
        return {
          products: data.products.items.map((product) => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.variants[0]?.priceWithTax / 100 || 0,
            image: product.featuredAsset?.preview || '',
            rating: 4.5,
            reviews: 0
          }))
        };
      
      case 'collection-list':
        return {
          collections: data.collections.items.map((collection) => ({
            id: collection.id,
            name: collection.name,
            slug: collection.slug,
            image: collection.featuredAsset?.preview || '',
            productCount: collection.productVariants.totalItems
          }))
        };
      
      default:
        return data;
    }
  }

  /**
   * Cache management
   */
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.options.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
    console.info('Data cache cleared');
  }

  /**
   * Toggle between mock and real data
   * @param {boolean} useMock - Use mock data
   */
  setMockMode(useMock) {
    this.options.useMockData = useMock;
    this.clearCache();
    console.info(`Data mode: ${useMock ? 'mock' : 'real'}`);
  }
}

export default DataProvider;