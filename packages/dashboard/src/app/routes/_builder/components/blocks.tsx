import type { BlockProperties } from 'grapesjs';

export const blocks: BlockProperties[] = [
    // LAYOUT
    {
        id: 'section',
        label: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; gap: 6px; cursor: pointer;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M3 9h18M3 15h18"/>
                </svg>
                <span>Section</span>
            </div>
        `,
        category: 'Layout',
        content:
            '<section style="padding: 80px 20px; min-height: 400px; background: #ffffff;"><div style="max-width: 1200px; margin: 0 auto;"><h2 style="font-size: 36px; margin-bottom: 20px;">Section Title</h2><p>Section content goes here</p></div></section>',
    },
    {
        id: 'container',
        label: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; gap: 6px; cursor: pointer;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="5" y="5" width="14" height="14" rx="1"/>
                    <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>
                </svg>
                <span>Container</span>
            </div>
        `,
        category: 'Layout',
        content:
            '<div style="max-width: 1200px; margin: 0 auto; padding: 40px 20px;"><p>Container content</p></div>',
    },
    {
        id: 'grid-2',
        label: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; gap: 6px; cursor: pointer;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="7" height="18" rx="1"/>
                    <rect x="14" y="3" width="7" height="18" rx="1"/>
                </svg>
                <span>2 Columns</span>
            </div>
        `,
        category: 'Layout',
        content:
            '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; padding: 20px;"><div style="padding: 30px; background: #f9fafb; border-radius: 8px; min-height: 200px;">Column 1</div><div style="padding: 30px; background: #f9fafb; border-radius: 8px; min-height: 200px;">Column 2</div></div>',
    },
    {
        id: 'grid-3',
        label: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; gap: 6px; cursor: pointer;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="5" height="18" rx="1"/>
                    <rect x="10" y="3" width="4" height="18" rx="1"/>
                    <rect x="16" y="3" width="5" height="18" rx="1"/>
                </svg>
                <span>3 Columns</span>
            </div>
        `,
        category: 'Layout',
        content:
            '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding: 20px;"><div style="padding: 30px; background: #f9fafb; border-radius: 8px; min-height: 200px;">Column 1</div><div style="padding: 30px; background: #f9fafb; border-radius: 8px; min-height: 200px;">Column 2</div><div style="padding: 30px; background: #f9fafb; border-radius: 8px; min-height: 200px;">Column 3</div></div>',
    },
    {
        id: 'grid-4',
        label: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; gap: 6px; cursor: pointer;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
                <span>4 Grid</span>
            </div>
        `,
        category: 'Layout',
        content:
            '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; padding: 20px;"><div style="padding: 30px; background: #f9fafb; border-radius: 8px; min-height: 150px;">Item 1</div><div style="padding: 30px; background: #f9fafb; border-radius: 8px; min-height: 150px;">Item 2</div><div style="padding: 30px; background: #f9fafb; border-radius: 8px; min-height: 150px;">Item 3</div><div style="padding: 30px; background: #f9fafb; border-radius: 8px; min-height: 150px;">Item 4</div></div>',
    },

    // HERO SECTIONS
    {
        id: 'hero-centered',
        label: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; gap: 6px; cursor: pointer;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M12 8v8M8 12h8"/>
                </svg>
                <span>Hero Center</span>
            </div>
        `,
        category: 'Hero',
        content: `
            <section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 120px 20px; text-align: center; color: white;">
                <div style="max-width: 800px; margin: 0 auto;">
                    <h1 style="font-size: 56px; font-weight: bold; margin: 0 0 20px 0; line-height: 1.2;">Welcome to Our Store</h1>
                    <p style="font-size: 20px; margin: 0 0 40px 0; opacity: 0.95;">Discover amazing products at unbeatable prices</p>
                    <div style="display: flex; gap: 16px; justify-content: center;">
                        <button style="padding: 16px 32px; background: white; color: #667eea; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">Shop Now</button>
                        <button style="padding: 16px 32px; background: transparent; color: white; border: 2px solid white; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">Learn More</button>
                    </div>
                </div>
            </section>
        `,
    },
    {
        id: 'hero-split',
        label: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; gap: 6px; cursor: pointer;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="8" height="18" rx="1"/>
                    <rect x="13" y="8" width="8" height="8" rx="1"/>
                </svg>
                <span>Hero Split</span>
            </div>
        `,
        category: 'Hero',
        content: `
            <section style="display: grid; grid-template-columns: 1fr 1fr; min-height: 600px; background: #f9fafb;">
                <div style="padding: 80px 60px; display: flex; flex-direction: column; justify-content: center;">
                    <h1 style="font-size: 48px; font-weight: bold; margin: 0 0 24px 0; color: #111827;">New Collection 2024</h1>
                    <p style="font-size: 18px; margin: 0 0 32px 0; color: #6b7280; line-height: 1.6;">Explore our latest arrivals and trending styles. Limited time offers available now.</p>
                    <div>
                        <button style="padding: 14px 32px; background: #111827; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">Explore Collection</button>
                    </div>
                </div>
                <div style="background: url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800') center/cover; position: relative;">
                    <div style="position: absolute; top: 20px; right: 20px; background: #ef4444; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600;">Sale 50% OFF</div>
                </div>
            </section>
        `,
    },
    {
        id: 'hero-minimal',
        label: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; gap: 6px; cursor: pointer;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M7 12h10"/>
                </svg>
                <span>Hero Minimal</span>
            </div>
        `,
        category: 'Hero',
        content: `
            <section style="padding: 100px 20px; background: white;">
                <div style="max-width: 900px; margin: 0 auto;">
                    <div style="text-align: center; margin-bottom: 60px;">
                        <span style="display: inline-block; padding: 6px 16px; background: #fef3c7; color: #92400e; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 24px;">NEW ARRIVAL</span>
                        <h1 style="font-size: 64px; font-weight: 300; margin: 0 0 20px 0; color: #111827; letter-spacing: -2px;">Premium Quality</h1>
                        <p style="font-size: 20px; color: #6b7280; max-width: 600px; margin: 0 auto 40px;">Crafted with attention to detail and designed for those who appreciate excellence</p>
                        <button style="padding: 16px 48px; background: #111827; color: white; border: none; border-radius: 4px; font-size: 15px; letter-spacing: 1px; cursor: pointer;">DISCOVER MORE</button>
                    </div>
                </div>
            </section>
        `,
    },

    // E-COMMERCE SPECIFIC
    {
        id: 'product-card',
        label: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; gap: 6px; cursor: pointer;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    <path d="M8 17h8M12 13v8"/>
                </svg>
                <span>Product Card</span>
            </div>
        `,
        category: 'E-commerce',
        content: `
            <div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background: white; max-width: 320px;">
                <div style="position: relative; background: #f3f4f6; aspect-ratio: 1;">
                    <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" style="width: 100%; height: 100%; object-fit: cover;" />
                    <span style="position: absolute; top: 12px; right: 12px; background: #ef4444; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">-30%</span>
                </div>
                <div style="padding: 20px;">
                    <div style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Electronics</div>
                    <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 8px 0; color: #111827;">Premium Headphones</h3>
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                        <span style="color: #fbbf24;">★★★★★</span>
                        <span style="color: #6b7280; font-size: 14px;">(128)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                        <span style="font-size: 24px; font-weight: bold; color: #111827;">$199</span>
                        <span style="font-size: 16px; color: #9ca3af; text-decoration: line-through;">$285</span>
                    </div>
                    <button style="width: 100%; padding: 12px; background: #111827; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Add to Cart</button>
                </div>
            </div>
        `,
    },
    {
        id: 'product-grid',
        label: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; gap: 6px; cursor: pointer;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
                <span>Product Grid</span>
            </div>
        `,
        category: 'E-commerce',
        content: `
            <section style="padding: 80px 20px; background: white;">
                <div style="max-width: 1200px; margin: 0 auto;">
                    <h2 style="font-size: 36px; font-weight: bold; text-align: center; margin-bottom: 48px;">Featured Products</h2>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;">
                        <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background: white;">
                            <div style="background: #f3f4f6; aspect-ratio: 1;">
                                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300" style="width: 100%; height: 100%; object-fit: cover;" />
                            </div>
                            <div style="padding: 16px;">
                                <h4 style="font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Product Name</h4>
                                <p style="font-size: 20px; font-weight: bold; margin: 0;">$99</p>
                            </div>
                        </div>
                        <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background: white;">
                            <div style="background: #f3f4f6; aspect-ratio: 1;">
                                <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300" style="width: 100%; height: 100%; object-fit: cover;" />
                            </div>
                            <div style="padding: 16px;">
                                <h4 style="font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Product Name</h4>
                                <p style="font-size: 20px; font-weight: bold; margin: 0;">$149</p>
                            </div>
                        </div>
                        <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background: white;">
                            <div style="background: #f3f4f6; aspect-ratio: 1;">
                                <img src="https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300" style="width: 100%; height: 100%; object-fit: cover;" />
                            </div>
                            <div style="padding: 16px;">
                                <h4 style="font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Product Name</h4>
                                <p style="font-size: 20px; font-weight: bold; margin: 0;">$199</p>
                            </div>
                        </div>
                        <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background: white;">
                            <div style="background: #f3f4f6; aspect-ratio: 1;">
                                <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300" style="width: 100%; height: 100%; object-fit: cover;" />
                            </div>
                            <div style="padding: 16px;">
                                <h4 style="font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Product Name</h4>
                                <p style="font-size: 20px; font-weight: bold; margin: 0;">$79</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `,
    },
    {
        id: 'cart-item',
        label: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; gap: 6px; cursor: pointer;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="8" cy="21" r="1"/>
                    <circle cx="19" cy="21" r="1"/>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                </svg>
                <span>Cart Item</span>
            </div>
        `,
        category: 'E-commerce',
        content: `
            <div style="display: flex; gap: 20px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background: white;">
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;" />
                <div style="flex: 1;">
                    <h4 style="font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Product Name</h4>
                    <p style="font-size: 14px; color: #6b7280; margin: 0 0 12px 0;">Color: Black | Size: M</p>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="display: flex; align-items: center; border: 1px solid #e5e7eb; border-radius: 6px;">
                            <button style="padding: 6px 12px; background: none; border: none; cursor: pointer;">-</button>
                            <span style="padding: 6px 12px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">1</span>
                            <button style="padding: 6px 12px; background: none; border: none; cursor: pointer;">+</button>
                        </div>
                        <span style="font-size: 18px; font-weight: bold;">$99.00</span>
                    </div>
                </div>
                <button style="padding: 8px; background: none; border: none; color: #ef4444; cursor: pointer; font-size: 20px;">×</button>
            </div>
        `,
    },
    {
        id: 'promo-banner',
        label: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; gap: 6px; cursor: pointer;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="7" width="18" height="10" rx="2"/>
                    <path d="M8 11h8M10 15h4"/>
                </svg>
                <span>Promo Banner</span>
            </div>
        `,
        category: 'E-commerce',
        content: `
            <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 40px 20px; text-align: center; color: white;">
                <div style="max-width: 800px; margin: 0 auto;">
                    <span style="display: inline-block; padding: 6px 16px; background: rgba(0,0,0,0.2); border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 16px; letter-spacing: 1px;">LIMITED TIME OFFER</span>
                    <h2 style="font-size: 42px; font-weight: bold; margin: 0 0 12px 0;">Get 50% Off on All Items</h2>
                    <p style="font-size: 18px; margin: 0 0 24px 0; opacity: 0.95;">Use code: SAVE50 at checkout</p>
                    <button style="padding: 14px 32px; background: white; color: #f59e0b; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">Shop Now</button>
                </div>
            </div>
        `,
    },
    {
        id: 'category-card',
        label: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; gap: 6px; cursor: pointer;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
                <span>Category</span>
            </div>
        `,
        category: 'E-commerce',
        content: `
            <div style="position: relative; border-radius: 12px; overflow: hidden; height: 300px; max-width: 400px;">
                <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400" style="width: 100%; height: 100%; object-fit: cover;" />
                <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); display: flex; flex-direction: column; justify-content: flex-end; padding: 30px; color: white;">
                    <h3 style="font-size: 28px; font-weight: bold; margin: 0 0 8px 0;">Men's Fashion</h3>
                    <p style="font-size: 14px; margin: 0 0 16px 0; opacity: 0.9;">150+ Products</p>
                    <button style="padding: 10px 24px; background: white; color: #111827; border: none; border-radius: 6px; font-weight: 600; width: fit-content; cursor: pointer;">Browse Collection</button>
                </div>
            </div>
        `,
    },

    // BASIC COMPONENTS
    {
        id: 'navbar',
        label: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; gap: 6px; cursor: pointer;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="4" width="18" height="4" rx="1"/>
                    <path d="M8 12h8M8 16h5"/>
                </svg>
                <span>Navbar</span>
            </div>
        `,
        category: 'Components',
        content: `
            <nav style="display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background: white; border-bottom: 1px solid #e5e7eb;">
                <div style="font-weight: bold; font-size: 24px; color: #111827;">STORE</div>
                <div style="display: flex; gap: 32px; align-items: center;">
                    <a href="#" style="color: #111827; text-decoration: none; font-weight: 500;">Shop</a>
                    <a href="#" style="color: #6b7280; text-decoration: none; font-weight: 500;">About</a>
                    <a href="#" style="color: #6b7280; text-decoration: none; font-weight: 500;">Contact</a>
                    <button style="padding: 10px 24px; background: #111827; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Cart (0)</button>
                </div>
            </nav>
        `,
    },
    {
        id: 'footer',
        label: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; gap: 6px; cursor: pointer;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="20" width="18" height="4" rx="1"/>
                    <path d="M8 12h8M8 8h5"/>
                </svg>
                <span>Footer</span>
            </div>
        `,
        category: 'Components',
        content: `
            <footer style="background: #111827; color: white; padding: 60px 40px 30px;">
                <div style="max-width: 1200px; margin: 0 auto;">
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; margin-bottom: 40px;">
                        <div>
                            <h3 style="font-size: 20px; font-weight: bold; margin: 0 0 20px 0;">STORE</h3>
                            <p style="color: #9ca3af; font-size: 14px; line-height: 1.6;">Making the world a better place through quality products.</p>
                        </div>
                        <div>
                            <h4 style="font-size: 14px; font-weight: 600; margin: 0 0 16px 0;">Shop</h4>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 14px;">All Products</a>
                                <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 14px;">New Arrivals</a>
                                <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 14px;">Sale</a>
                            </div>
                        </div>
                        <div>
                            <h4 style="font-size: 14px; font-weight: 600; margin: 0 0 16px 0;">Company</h4>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 14px;">About</a>
                                <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 14px;">Contact</a>
                                <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 14px;">Careers</a>
                            </div>
                        </div>
                        <div>
                            <h4 style="font-size: 14px; font-weight: 600; margin: 0 0 16px 0;">Legal</h4>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 14px;">Privacy</a>
                                <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 14px;">Terms</a>
                                <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 14px;">Returns</a>
                            </div>
                        </div>
                    </div>
                    <div style="border-top: 1px solid #374151; padding-top: 24px; text-align: center; color: #9ca3af; font-size: 14px;">
                        © 2024 Store. All rights reserved.
                    </div>
                </div>
            </footer>
        `,
    },
    {
        id: 'button',
        label: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; gap: 6px; cursor: pointer;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="8" width="18" height="8" rx="2"/>
                    <circle cx="12" cy="12" r="1" fill="currentColor"/>
                </svg>
                <span>Button</span>
            </div>
        `,
        category: 'Basic',
        content:
            '<button style="padding: 12px 32px; background: #111827; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">Button</button>',
    },
    {
        id: 'text',
        label: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; gap: 6px; cursor: pointer;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M4 7h16M4 12h10M4 17h14"/>
                </svg>
                <span>Text</span>
            </div>
        `,
        category: 'Basic',
        content: '<p style="font-size: 16px; line-height: 1.6; color: #374151;">Insert your text here</p>',
    },
    {
        id: 'heading',
        label: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; gap: 6px; cursor: pointer;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M6 4v16M18 4v16M6 12h12" stroke-width="2"/>
                </svg>
                <span>Heading</span>
            </div>
        `,
        category: 'Basic',
        content: '<h2 style="font-size: 36px; font-weight: bold; margin: 0; color: #111827;">Heading</h2>',
    },
    {
        id: 'image',
        label: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; gap: 6px; cursor: pointer;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
                <span>Image</span>
            </div>
        `,
        category: 'Media',
        content:
            '<img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600" style="max-width: 100%; height: auto; border-radius: 8px;" />',
    },
    {
        id: 'testimonial',
        label: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; gap: 6px; cursor: pointer;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span>Testimonial</span>
            </div>
        `,
        category: 'Components',
        content: `
            <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 600px;">
                <div style="color: #fbbf24; font-size: 24px; margin-bottom: 16px;">★★★★★</div>
                <p style="font-size: 18px; line-height: 1.6; color: #374151; margin: 0 0 24px 0;">"Amazing quality and fast shipping! This is exactly what I was looking for. Highly recommend to anyone."</p>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 48px; height: 48px; border-radius: 50%; background: #e5e7eb;"></div>
                    <div>
                        <div style="font-weight: 600; color: #111827;">John Doe</div>
                        <div style="font-size: 14px; color: #6b7280;">Verified Customer</div>
                    </div>
                </div>
            </div>
        `,
    },
    {
        id: 'cta-section',
        label: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; gap: 6px; cursor: pointer;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M12 8v8M8 12h8"/>
                </svg>
                <span>CTA Section</span>
            </div>
        `,
        category: 'Components',
        content: `
            <section style="background: #111827; color: white; padding: 80px 40px; text-align: center;">
                <div style="max-width: 700px; margin: 0 auto;">
                    <h2 style="font-size: 42px; font-weight: bold; margin: 0 0 20px 0;">Ready to Get Started?</h2>
                    <p style="font-size: 18px; margin: 0 0 32px 0; opacity: 0.9;">Join thousands of satisfied customers and experience the difference today.</p>
                    <button style="padding: 16px 40px; background: white; color: #111827; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">Shop Now</button>
                </div>
            </section>
        `,
    },
];
