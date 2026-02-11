'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { FC } from 'react';
import { cn } from '../../../lib/utils.js';
import { useShopPreview } from '../context.js';
import { ShopPaginationProps } from './types.js';

function getPageNumbers(currentPage: number, totalPages: number): Array<number | '...'> {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: Array<number | '...'> = [1];

    if (currentPage > 3) {
        pages.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (currentPage < totalPages - 2) {
        pages.push('...');
    }

    pages.push(totalPages);

    return pages;
}

export const ShopPagination: FC<ShopPaginationProps> = ({
    page,
    perPage,
    totalItems: totalItemsProp,
    style,
    showPageSize,
    pageSizeOptions,
    onPageChange,
    onPerPageChange,
    ref,
    selected,
}) => {
    const preview = useShopPreview();
    const totalItems = preview?.totalItems ?? totalItemsProp;
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

    if (totalPages <= 1 && !showPageSize) {
        return null;
    }

    return (
        <div
            ref={ref}
            className={cn(
                'flex items-center justify-center gap-4 flex-wrap',
                selected && 'ring-2 ring-ring',
            )}
        >
            {style === 'simple' ? (
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onPageChange?.(page - 1)}
                        disabled={page <= 1}
                        className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>
                    <span className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => onPageChange?.(page + 1)}
                        disabled={page >= totalPages}
                        className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPageChange?.(page - 1)}
                        disabled={page <= 1}
                        className="p-1.5 rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    {getPageNumbers(page, totalPages).map((pageNum, idx) =>
                        pageNum === '...' ? (
                            <span key={`ellipsis-${idx}`} className="px-2 text-sm text-muted-foreground">
                                ...
                            </span>
                        ) : (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange?.(pageNum)}
                                className={cn(
                                    'min-w-[2rem] h-8 text-sm rounded-md border transition-colors',
                                    pageNum === page
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-background text-foreground border-border hover:bg-muted',
                                )}
                            >
                                {pageNum}
                            </button>
                        ),
                    )}
                    <button
                        onClick={() => onPageChange?.(page + 1)}
                        disabled={page >= totalPages}
                        className="p-1.5 rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {showPageSize && (
                <select
                    value={perPage}
                    onChange={e => onPerPageChange?.(Number(e.target.value))}
                    className="text-sm border border-border rounded-md px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                    {pageSizeOptions.map(size => (
                        <option key={size} value={size}>
                            {size} per page
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};
