'use client';
import { Grid3X3, List } from 'lucide-react';
import type { FC } from 'react';
import { cn } from '../../../lib/utils.js';
import { ShopToolbarProps } from './types.js';

export const ShopToolbar: FC<ShopToolbarProps> = ({
    totalItems,
    sortValue,
    sortOptions,
    view,
    showResultCount,
    showViewToggle,
    showSort,
    onSortChange,
    onViewChange,
    ref,
    selected,
}) => {
    return (
        <div
            ref={ref}
            className={cn(
                'flex items-center justify-between gap-4 flex-wrap',
                selected && 'ring-2 ring-ring',
            )}
        >
            {showResultCount && (
                <p className="text-sm text-muted-foreground">
                    {totalItems} {totalItems === 1 ? 'product' : 'products'}
                </p>
            )}

            <div className="flex items-center gap-3 ml-auto">
                {showSort && (
                    <select
                        value={sortValue}
                        onChange={e => onSortChange?.(e.target.value)}
                        className="text-sm border border-border rounded-md px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )}

                {showViewToggle && (
                    <div className="flex items-center border border-border rounded-md overflow-hidden">
                        <button
                            onClick={() => onViewChange?.('grid')}
                            className={cn(
                                'p-1.5 transition-colors',
                                view === 'grid'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-background text-muted-foreground hover:text-foreground',
                            )}
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onViewChange?.('list')}
                            className={cn(
                                'p-1.5 transition-colors',
                                view === 'list'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-background text-muted-foreground hover:text-foreground',
                            )}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
