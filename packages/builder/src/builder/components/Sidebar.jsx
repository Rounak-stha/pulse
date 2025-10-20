import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Sidebar Component
 * Displays available sections organized by category
 */
export default function Sidebar({ builder, registry }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Get all sections and categories
    const sections = useMemo(() => {
        if (!registry) return [];
        return registry.getAll();
    }, [registry]);

    const categories = useMemo(() => {
        if (!registry) return [];
        return ['all', ...registry.getCategories()];
    }, [registry]);

    // Filter sections
    const filteredSections = useMemo(() => {
        let filtered = sections;

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(s => s.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                s => s.name.toLowerCase().includes(query) || s.category.toLowerCase().includes(query),
            );
        }

        return filtered;
    }, [sections, selectedCategory, searchQuery]);

    return (
        <div className="w-80 h-full  border-r  flex flex-col">
            {/* Header */}
            <div className="p-4 border-b ">
                <h2 className="text-lg font-semibold text-muted-foreground mb-4">Add Section</h2>

                {/* Search */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search sections..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg
                        className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>

            {/* Category Filter */}
            <div className="p-4 border-b ">
                <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                selectedCategory === category
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-muted-foreground hover:bg-gray-200'
                            }`}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sections List */}
            <div className="flex-1 overflow-y-auto p-4">
                {filteredSections.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No sections found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredSections.map(section => (
                            <SectionCard key={section.type} section={section} />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t  bg-gray-50">
                <p className="text-xs text-muted-foreground text-center">
                    Drag sections to canvas or click to add
                </p>
            </div>
        </div>
    );
}

/**
 * Section Card Component with Drag Support
 */
function SectionCard({ section }) {
    const cardRef = useRef(null);

    useEffect(() => {
        const element = cardRef.current;
        if (!element) return;

        // Make section card draggable
        const cleanup = draggable({
            element,
            getInitialData: () => ({
                type: 'new-section',
                sectionType: section.type,
            }),
            /*             onGenerateDragPreview: ({ nativeSetDragImage }) => {
                const preview = element.cloneNode(true);
                preview.style.opacity = '0.8';
                preview.style.transform = 'rotate(-2deg)';
                nativeSetDragImage(preview, 0, 0);
            }, */
        });

        return cleanup;
    }, [section.type]);

    return (
        <button
            ref={cardRef}
            className="w-full p-4  border-2  rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200 text-left group cursor-move"
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    {section.icon ? (
                        <div dangerouslySetInnerHTML={{ __html: section.icon }} />
                    ) : (
                        <svg
                            className="w-6 h-6 text-muted-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-muted-foreground mb-1">{section.name}</h3>
                    <p className="text-sm text-muted-foreground">{section.category}</p>
                </div>

                {/* Drag Icon */}
                <div className="flex-shrink-0 text-muted-foreground group-hover:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                </div>
            </div>
        </button>
    );
}
