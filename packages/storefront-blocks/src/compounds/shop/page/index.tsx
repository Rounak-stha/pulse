'use client';
import { SlidersHorizontal, X } from 'lucide-react';
import type { FC } from 'react';
import { useState } from 'react';
import { cn } from '../../../lib/utils.js';
import { containerSizeClasses, gapClasses, sidebarWidthClasses, spacingClasses } from './constants/styles.js';
import { ShopPageRuntimeProps } from './types.js';

export const ShopPage: FC<ShopPageRuntimeProps> = ({
    layout,
    containerSize,
    spacing,
    sidebarWidth,
    stickySidebar,
    showFilters,
    FiltersSlot,
    ToolbarSlot,
    ProductGridSlot,
    PaginationSlot,
    ref,
    selected,
}) => {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const renderFiltersDrawer = () => {
        if (!mobileFiltersOpen || !showFilters || !FiltersSlot) return null;
        return (
            <div className="fixed inset-0 z-50">
                <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
                <div className="absolute inset-y-0 left-0 w-full max-w-xs bg-background shadow-xl flex flex-col">
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                        <span className="text-base font-semibold">Filters</span>
                        <button
                            onClick={() => setMobileFiltersOpen(false)}
                            className="p-1 rounded-md hover:bg-muted"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">{FiltersSlot}</div>
                </div>
            </div>
        );
    };

    if (layout === 'top-filters') {
        return (
            <div
                ref={ref}
                className={cn(
                    containerSizeClasses[containerSize],
                    'mx-auto',
                    spacingClasses[spacing],
                    selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
                )}
            >
                <div className={cn('flex flex-col', gapClasses[spacing])}>
                    {showFilters && FiltersSlot && <div className="w-full">{FiltersSlot}</div>}
                    {ToolbarSlot && <div className="w-full">{ToolbarSlot}</div>}
                    {ProductGridSlot && <div className="w-full">{ProductGridSlot}</div>}
                    {PaginationSlot && <div className="w-full">{PaginationSlot}</div>}
                </div>
            </div>
        );
    }

    return (
        <div
            ref={ref}
            className={cn(
                containerSizeClasses[containerSize],
                'mx-auto',
                spacingClasses[spacing],
                selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
            )}
        >
            <div className={cn('flex flex-col', gapClasses[spacing])}>
                Filters ya huna parne
                {showFilters && FiltersSlot && (
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileFiltersOpen(true)}
                            className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                        </button>
                    </div>
                )}
                <div className={cn('flex flex-col md:flex-row', gapClasses[spacing])}>
                    {showFilters && FiltersSlot && (
                        <aside
                            className={cn(
                                'flex-shrink-0 hidden md:block',
                                sidebarWidthClasses[sidebarWidth],
                                layout === 'sidebar-right' && 'md:order-2',
                                stickySidebar && 'md:sticky md:top-4 md:self-start',
                            )}
                        >
                            {FiltersSlot}
                        </aside>
                    )}
                    <main
                        className={cn(
                            'flex-1 min-w-0 flex flex-col',
                            gapClasses[spacing],
                            layout === 'sidebar-right' && 'md:order-1',
                        )}
                    >
                        {ToolbarSlot && <div>{ToolbarSlot}</div>}
                        {ProductGridSlot && <div>{ProductGridSlot}</div>}
                        {PaginationSlot && <div>{PaginationSlot}</div>}
                    </main>
                </div>
            </div>

            {renderFiltersDrawer()}
        </div>
    );
};
