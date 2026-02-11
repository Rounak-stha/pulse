import { ShopToolbarProps } from '../types.js';

export const DefaultShopToolbarProps: ShopToolbarProps = {
    totalItems: 0,
    sortValue: 'NEWEST',
    sortOptions: [
        { value: 'NEWEST', label: 'Newest' },
        { value: 'NAME_ASC', label: 'Name: A-Z' },
        { value: 'NAME_DESC', label: 'Name: Z-A' },
    ],
    view: 'grid',
    showResultCount: true,
    showViewToggle: true,
    showSort: true,
};
