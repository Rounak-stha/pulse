'use client';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import React, { useState } from 'react';
import type { FC } from 'react';
import { cn } from '../../../lib/utils.js';
import { useShopPreview } from '../context.js';
import { ShopFiltersProps } from './types.js';

export const ShopFilters: FC<ShopFiltersProps> = ({
    facetGroups: facetGroupsProp,
    selectedValueIds,
    mode,
    showCounts,
    collapsible,
    onToggle,
    onClearAll,
    ref,
    selected,
}) => {
    const preview = useShopPreview();
    const facetGroups = preview?.facetGroups ?? facetGroupsProp;
    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

    const toggleGroup = (groupId: string) => {
        setCollapsedGroups(prev => {
            const next = new Set(prev);
            if (next.has(groupId)) {
                next.delete(groupId);
            } else {
                next.add(groupId);
            }
            return next;
        });
    };

    const hasSelection = selectedValueIds.length > 0;

    return (
        <div ref={ref} className={cn('flex flex-col gap-6', selected && 'ring-2 ring-ring')}>
            {hasSelection && (
                <button
                    onClick={onClearAll}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors self-start"
                >
                    <X className="w-3.5 h-3.5" />
                    Clear all filters
                </button>
            )}

            {facetGroups.map(group => {
                const isCollapsed = collapsedGroups.has(group.id);

                return (
                    <div key={group.id} className="flex flex-col gap-2">
                        {collapsible ? (
                            <button
                                onClick={() => toggleGroup(group.id)}
                                className="flex items-center justify-between text-sm font-semibold text-foreground"
                            >
                                {group.name}
                                {isCollapsed ? (
                                    <ChevronDown className="w-4 h-4" />
                                ) : (
                                    <ChevronUp className="w-4 h-4" />
                                )}
                            </button>
                        ) : (
                            <span className="text-sm font-semibold text-foreground">{group.name}</span>
                        )}

                        {!isCollapsed && (
                            <div className={cn('flex flex-col', mode === 'pill' ? 'flex-row flex-wrap gap-2' : 'gap-1')}>
                                {group.values.map(value => {
                                    const isSelected = selectedValueIds.includes(value.id);

                                    if (mode === 'pill') {
                                        return (
                                            <button
                                                key={value.id}
                                                onClick={() => onToggle?.(value.id)}
                                                className={cn(
                                                    'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border transition-colors',
                                                    isSelected
                                                        ? 'bg-primary text-primary-foreground border-primary'
                                                        : 'bg-background text-foreground border-border hover:border-muted-foreground',
                                                )}
                                            >
                                                {value.name}
                                                {showCounts && (
                                                    <span className="text-xs opacity-70">({value.count})</span>
                                                )}
                                            </button>
                                        );
                                    }

                                    return (
                                        <label
                                            key={value.id}
                                            className="flex items-center gap-2 cursor-pointer text-sm text-foreground hover:text-foreground/80 py-0.5"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => onToggle?.(value.id)}
                                                className="rounded border-border text-primary focus:ring-primary"
                                            />
                                            <span className="flex-1">{value.name}</span>
                                            {showCounts && (
                                                <span className="text-xs text-muted-foreground">
                                                    ({value.count})
                                                </span>
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
