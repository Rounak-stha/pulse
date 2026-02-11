'use client';
import { ShopToolbar as ShopToolbarPure } from '@vendure/storefront-blocks/compounds';
import type { ShopToolbarProps } from '@vendure/storefront-blocks/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import type { FC } from 'react';

export const ShopToolbarRenderer: FC<ShopToolbarProps> = props => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const sortValue = searchParams.get('sort') || 'NEWEST';
    const [view, setView] = useState<'grid' | 'list'>(props.view);

    const onSortChange = (value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value === 'NEWEST') {
            newParams.delete('sort');
        } else {
            newParams.set('sort', value);
        }
        newParams.set('page', '1');
        router.push(`${pathname}?${newParams.toString()}`);
    };

    const onViewChange = (newView: 'grid' | 'list') => {
        setView(newView);
    };

    return (
        <ShopToolbarPure
            {...props}
            sortValue={sortValue}
            view={view}
            onSortChange={onSortChange}
            onViewChange={onViewChange}
        />
    );
};
