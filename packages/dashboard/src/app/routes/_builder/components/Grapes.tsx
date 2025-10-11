import type { Editor } from 'grapesjs';
import { useEffect, useRef, useState } from 'react';

import { blocks } from '../components/blocks.js';
import { ThemeConfigurator } from './theme-configurator.js';

function loadStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/styles/builder.css';
    document.head.appendChild(link);
}

const WebsiteBuilder = () => {
    const editorRef = useRef(null);
    const gjsRef = useRef<Editor>(null);
    const [ready, setReady] = useState(false);
    const [leftSidebarActiveTab, setLeftSidebarActiveTab] = useState<'blocks' | 'theme'>('blocks');

    useEffect(() => {
        setReady(true);
    }, []);

    useEffect(() => {
        if (!editorRef.current || !ready) return;

        loadStyles();
        // Add custom CSS overrides for whitelabeling
        const style = document.createElement('style');

        document.head.appendChild(style);

        // Dynamically import GrapesJS
        import('grapesjs').then(({ grapesjs }) => {
            gjsRef.current = grapesjs.init({
                container: editorRef.current!, // we've alreay checked this eists
                height: '100%',
                width: '100%',
                storageManager: false,
                panels: { defaults: [] },
                blockManager: {
                    appendTo: '#blocks-container',
                    blocks,
                },
                styleManager: {
                    appendTo: '#styles-container',
                    sectors: [
                        {
                            name: 'Layout',
                            open: true,
                            buildProps: [
                                'display',
                                'flex-direction',
                                'justify-content',
                                'align-items',
                                'width',
                                'height',
                                'margin',
                                'padding',
                            ],
                        },
                        {
                            name: 'Spacing',
                            open: false,
                            buildProps: [
                                'margin-top',
                                'margin-right',
                                'margin-bottom',
                                'margin-left',
                                'padding-top',
                                'padding-right',
                                'padding-bottom',
                                'padding-left',
                            ],
                        },
                        {
                            name: 'Size',
                            open: false,
                            buildProps: ['width', 'height', 'max-width', 'min-height'],
                        },
                        {
                            name: 'Typography',
                            open: true,
                            buildProps: [
                                'font-family',
                                'font-size',
                                'font-weight',
                                'letter-spacing',
                                'color',
                                'line-height',
                                'text-align',
                                'text-decoration',
                                'text-shadow',
                            ],
                        },
                        {
                            name: 'Effect',
                            open: true,
                            buildProps: ['opacity', 'border-radius', 'border', 'box-shadow', 'background'],
                        },
                    ],
                },
                layerManager: {
                    appendTo: '#layers-container',
                },
                traitManager: {
                    appendTo: '#traits-container',
                },
                selectorManager: {
                    appendTo: '#selectors-container',
                },
                deviceManager: {
                    devices: [
                        { name: 'Desktop', width: '' },
                        { name: 'Tablet', width: '768px', widthMedia: '992px' },
                        { name: 'Mobile', width: '320px', widthMedia: '480px' },
                    ],
                },
                plugins: [],
                canvas: {
                    styles: [],
                    scripts: [],
                },
            });

            // Set initial content
            gjsRef.current.setComponents(`
          <nav style="display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background: white; border-bottom: 1px solid #e5e7eb;">
        <div style="font-weight: bold; font-size: 24px; color: #111827;">STORE</div>
        <div style="display: flex; gap: 32px; align-items: center;">
            <a href="#" style="color: #111827; text-decoration: none; font-weight: 500;">Shop</a>
            <a href="#" style="color: #6b7280; text-decoration: none; font-weight: 500;">About</a>
            <a href="#" style="color: #6b7280; text-decoration: none; font-weight: 500;">Contact</a>
            <button style="padding: 10px 24px; background: #111827; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Cart (0)</button>
        </div>
    </nav>

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

    <section style="padding: 80px 20px; background: white;">
        <div style="max-width: 1200px; margin: 0 auto;">
            <h2 style="font-size: 36px; font-weight: bold; text-align: center; margin-bottom: 48px;">Featured Products</h2>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;">
                <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                    <div style="background: #f3f4f6; aspect-ratio: 1;">
                        <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300" style="width: 100%; height: 100%; object-fit: cover;" />
                    </div>
                    <div style="padding: 16px;">
                        <h4 style="font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Premium Headphones</h4>
                        <p style="font-size: 20px; font-weight: bold; margin: 0;">$99</p>
                    </div>
                </div>
                <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                    <div style="background: #f3f4f6; aspect-ratio: 1;">
                        <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300" style="width: 100%; height: 100%; object-fit: cover;" />
                    </div>
                    <div style="padding: 16px;">
                        <h4 style="font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Smart Watch</h4>
                        <p style="font-size: 20px; font-weight: bold; margin: 0;">$149</p>
                    </div>
                </div>
                <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                    <div style="background: #f3f4f6; aspect-ratio: 1;">
                        <img src="https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300" style="width: 100%; height: 100%; object-fit: cover;" />
                    </div>
                    <div style="padding: 16px;">
                        <h4 style="font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Designer Shoes</h4>
                        <p style="font-size: 20px; font-weight: bold; margin: 0;">$199</p>
                    </div>
                </div>
                <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                    <div style="background: #f3f4f6; aspect-ratio: 1;">
                        <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300" style="width: 100%; height: 100%; object-fit: cover;" />
                    </div>
                    <div style="padding: 16px;">
                        <h4 style="font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Classic Backpack</h4>
                        <p style="font-size: 20px; font-weight: bold; margin: 0;">$79</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer style="background: #111827; color: white; padding: 60px 40px 30px;">
        <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
            <p style="color: #9ca3af; font-size: 14px;">© 2024 Store. All rights reserved.</p>
        </div>
    </footer>
        `);
        });

        return () => {
            if (gjsRef.current) {
                gjsRef.current.destroy();
                gjsRef.current = null;
            }
        };
    }, [ready]);

    return (
        <div className="flex h-screen text-sm bg-card">
            {/* Left Sidebar */}
            <div className="w-72 border-r flex flex-col overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b">
                    <button
                        onClick={() => setLeftSidebarActiveTab('blocks')}
                        className={`flex-1 px-4 py-2 text-xs font-medium ${leftSidebarActiveTab == 'blocks' ? 'border-b-2' : ''}`}
                    >
                        Elements
                    </button>
                    <button
                        onClick={() => setLeftSidebarActiveTab('theme')}
                        className={`flex-1 px-4 py-2 text-xs font-medium ${leftSidebarActiveTab == 'theme' ? 'border-b-2' : ''}`}
                    >
                        Theme
                    </button>
                </div>

                {/* Blocks */}
                <div
                    className={`flex-1 overflow-y-auto p-4 ${leftSidebarActiveTab === 'blocks' ? 'block' : 'hidden'}`}
                >
                    <div id="blocks-container"></div>
                </div>
                <div className={leftSidebarActiveTab === 'theme' ? 'block' : 'hidden'}>
                    <ThemeConfigurator editor={gjsRef.current} />
                </div>
            </div>

            {/* Main Canvas */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Toolbar */}
                <div className="border-b px-4 py-2 flex items-center justify-between">
                    <div className="flex-1 flex items-center justify-center gap-1 rounded-lg p-1">
                        <button
                            onClick={() => gjsRef.current?.setDevice('Desktop')}
                            className="p-1.5 hover:rounded transition-colors"
                            title="Desktop"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                <line x1="8" y1="21" x2="16" y2="21"></line>
                                <line x1="12" y1="17" x2="12" y2="21"></line>
                            </svg>
                        </button>
                        <button
                            onClick={() => gjsRef.current?.setDevice('Tablet')}
                            className="p-1.5 hover:rounded transition-colors"
                            title="Tablet"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                                <line x1="12" y1="18" x2="12.01" y2="18"></line>
                            </svg>
                        </button>
                        <button
                            onClick={() => gjsRef.current?.setDevice('Mobile')}
                            className="p-1.5 hover:rounded transition-colors"
                            title="Mobile"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <rect x="7" y="2" width="10" height="20" rx="2" ry="2"></rect>
                                <line x1="12" y1="18" x2="12.01" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Canvas */}
                <div ref={editorRef} className="flex-1 overflow-auto"></div>
            </div>

            {/* Right Sidebar */}
            <div className="w-72 border-l flex flex-col overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b">
                    <button className="flex-1 px-4 py-2 text-xs font-medium border-b-2">Styles</button>
                </div>

                {/* Selector */}
                <div className="border-b p-4">
                    <div id="selectors-container"></div>
                </div>

                {/* Style Manager */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div id="styles-container"></div>
                </div>

                {/* Traits */}
                <div className="border-t p-4">
                    <div id="traits-container"></div>
                </div>
            </div>
        </div>
    );
};

export default WebsiteBuilder;
