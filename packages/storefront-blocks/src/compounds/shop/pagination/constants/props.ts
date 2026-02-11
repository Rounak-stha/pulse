import { ShopPaginationProps } from '../types.js';

export const DefaultShopPaginationProps: ShopPaginationProps = {
    page: 1,
    perPage: 12,
    totalItems: 0,
    style: 'numbered',
    showPageSize: false,
    pageSizeOptions: [12, 24, 48],
};
