import { RootContainer } from '@/vdb/components/builder/blocks/atoms/root-container/index.js';
import { Footer } from '@/vdb/components/builder/blocks/compounds/footer/main/index.js';
import { Header } from '@/vdb/components/builder/blocks/compounds/header/main/index.js';
import { HeroBanner } from '@/vdb/components/builder/blocks/compounds/hero/banner/index.js';
import { FeaturedCollections } from '@/vdb/components/builder/blocks/compounds/showcase/featured/index.js';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/vdb/components/ui/alert-dialog.js';
import { useIsMobile } from '@/vdb/hooks/use-mobile.js';
import { Element, useEditor } from '@craftjs/core';
import { ReactNode } from '@tanstack/react-router';
import { FootprintsIcon, HeadingIcon, SectionIcon, ShapesIcon } from 'lucide-react';
import { FC, useMemo, useState } from 'react';

type Block = {
    name: string;
    category: string;
    Icon: ReactNode;
    Component: FC<any>;
};

const blocks: Block[] = [
    {
        category: 'Hero',
        name: 'Hero Banner',
        Icon: SectionIcon,
        Component: HeroBanner,
    },
    {
        category: 'Header',
        name: 'Header',
        Icon: HeadingIcon,
        Component: Header,
    },
    {
        category: 'ShowCase',
        name: 'Featured Collections',
        Icon: ShapesIcon,
        Component: FeaturedCollections,
    },
    {
        category: 'Footer',
        name: 'Footer',
        Icon: FootprintsIcon,
        Component: Footer,
    },
];

const ALL_CATEGORIES_NAME = 'all';
const categories = [ALL_CATEGORIES_NAME, ...Array.from(new Set(blocks.map(b => b.category)))];

interface BlocksPanelProps {
    onBlockAdd?: () => void;
}

export const BlocksPanel: FC<BlocksPanelProps> = ({ onBlockAdd }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES_NAME);
    const [pendingBlock, setPendingBlock] = useState<{ block: Block; parentId: string } | null>(null);
    const { connectors, query, actions } = useEditor();
    const isMobile = useIsMobile();

    const filteredBlocks = useMemo(() => {
        let filtered = [...blocks];

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
    }, [selectedCategory, searchQuery]);

    const handleMobileTap = (block: Block) => {
        const selectedId = query.getEvent('selected').first();
        let parentId: string | null = null;

        if (selectedId) {
            const node = query.node(selectedId).get();
            if (node) {
                 if (node.data.isCanvas) {
                    parentId = selectedId;
                } else {
                    parentId = node.data.parent;
                }
            }
        }

        if (!parentId) {
             // Verify RootContainer exists
             const root = query.node('RootContainer').get();
             if (root) {
                 parentId = 'RootContainer';
             } else {
                 // Fallback to internal ROOT if RootContainer custom ID is not found (unlikely but safe)
                 parentId = 'ROOT'; 
             }
        }
        
        if (parentId) {
            setPendingBlock({ block, parentId });
        }
    };

    return (
        <div className="h-full space-y-4 flex flex-col">
            {/* ... Header and Filters ... */}
            {/* Header */}
            <div className="border-b">
                <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase mb-4">
                    Add Section
                </h2>

                {/* Search */}
                <div className="relative">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
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
                    <input
                        type="text"
                        placeholder="Search sections..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-muted/50 border-0 rounded-md focus:ring-2 focus:ring-primary focus:bg-background transition-colors"
                    />
                </div>
            </div>

            {/* Category Filter */}
            <div className="py-2 border-b">
                <div className="flex flex-wrap gap-1.5">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                selectedCategory === category
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                            }`}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sections List */}
            <div className="flex-1 overflow-y-auto py-4">
                {filteredBlocks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-muted/50 p-3 mb-3">
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
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <p className="text-sm text-muted-foreground">No sections found</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredBlocks.map(block => (
                            <SectionCard
                                key={block.name}
                                {...block}
                                onBlockAdd={onBlockAdd}
                                onMobileTap={() => handleMobileTap(block)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Confirmation Dialog */}
            <AlertDialog open={!!pendingBlock} onOpenChange={open => !open && setPendingBlock(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Add {pendingBlock?.block.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will add the section to your page.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPendingBlock(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (pendingBlock) {
                                    const { block, parentId } = pendingBlock;
                                    const Component = block.Component;
                                    
                                    // Final safety check
                                    const parentNode = query.node(parentId).get();
                                    if (parentNode) {
                                         const node = query.createNode(<Component />);
                                         actions.add(node, parentId);
                                         if (onBlockAdd) onBlockAdd();
                                    } else {
                                        console.error(`Starting add ignored: Parent node ${parentId} not found`);
                                    }
                                    setPendingBlock(null);
                                }
                            }}
                        >
                            Add Section
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Footer */}
            <div className="px-6 py-3 border-t bg-muted/30">
                <p className="text-xs text-muted-foreground text-center">Drag to canvas or click to add</p>
            </div>
        </div>
    );
};

/**
 * Section Card Component with Drag Support
 */
interface SectionCardProps {
    Icon: ReactNode;
    name: string;
    category: string;
    Component: FC;
    onBlockAdd?: () => void;
    onMobileTap?: () => void;
}

function SectionCard({ Icon, name, category, Component, onBlockAdd, onMobileTap }: SectionCardProps) {
    const { connectors, query, actions } = useEditor();
    const isMobile = useIsMobile();

    const handleAddBlock = () => {
        if (!isMobile) return;
        if (onMobileTap) {
            onMobileTap();
            return;
        }
        // Fallback or old logic if onMobileTap not provided (though we will provide it)
    };

    return (
        <button
            ref={(ref: HTMLButtonElement) => {
                // Only enable drag connector on desktop
                if (!isMobile) {
                    connectors.create(ref, <Component />);
                }
            }}
            onClick={handleAddBlock}
            className="w-full p-3 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-sm transition-all duration-200 text-left group cursor-move active:scale-[0.98]"
        >
            <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 w-9 h-9 bg-muted/50 rounded-md flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Icon />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground mb-0.5 truncate">{name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{category}</p>
                </div>

                {/* Drag Icon - Always rendered, hidden by default until hover/group-hover */}
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="9" cy="6" r="1.5" />
                        <circle cx="15" cy="6" r="1.5" />
                        <circle cx="9" cy="12" r="1.5" />
                        <circle cx="15" cy="12" r="1.5" />
                        <circle cx="9" cy="18" r="1.5" />
                        <circle cx="15" cy="18" r="1.5" />
                    </svg>
                </div>
            </div>
        </button>
    );
}
