'use client';
import { ShopPagination as ShopPaginationPure } from '@vendure/storefront-blocks/compounds';
import type { ShopPaginationProps } from '@vendure/storefront-blocks/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { FC } from 'react';

export const ShopPaginationRenderer: FC<ShopPaginationProps> = props => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const page = Number(searchParams.get('page')) || 1;
    const perPage = Number(searchParams.get('perPage')) || props.perPage;

    const onPageChange = (newPage: number) => {
        const newParams = new URLSearchParams(searchParams);
        if (newPage <= 1) {
            newParams.delete('page');
        } else {
            newParams.set('page', String(newPage));
        }
        router.push(`${pathname}?${newParams.toString()}`);
    };

    const onPerPageChange = (newPerPage: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('perPage', String(newPerPage));
        newParams.set('page', '1');
        router.push(`${pathname}?${newParams.toString()}`);
    };

    return (
        <ShopPaginationPure
            {...props}
            page={page}
            perPage={perPage}
            onPageChange={onPageChange}
            onPerPageChange={onPerPageChange}
        />
    );
};
