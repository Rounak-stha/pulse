'use client';
import { ShopFilters as ShopFiltersPure } from '@vendure/storefront-blocks/compounds';
import type { ShopFiltersProps } from '@vendure/storefront-blocks/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { FC } from 'react';

export const ShopFiltersRenderer: FC<ShopFiltersProps> = props => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const selectedValueIds = searchParams.getAll('facet');

    const onToggle = (valueId: string) => {
        const newParams = new URLSearchParams(searchParams);
        const existing = newParams.getAll('facet');

        if (existing.includes(valueId)) {
            newParams.delete('facet');
            existing
                .filter(id => id !== valueId)
                .forEach(id => newParams.append('facet', id));
        } else {
            newParams.append('facet', valueId);
        }
        newParams.set('page', '1');
        router.push(`${pathname}?${newParams.toString()}`);
    };

    const onClearAll = () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('facet');
        newParams.set('page', '1');
        router.push(`${pathname}?${newParams.toString()}`);
    };

    return (
        <ShopFiltersPure
            {...props}
            selectedValueIds={selectedValueIds}
            onToggle={onToggle}
            onClearAll={onClearAll}
        />
    );
};
