export interface ShopToolbarProps {
    totalItems: number;
    sortValue: string;
    sortOptions: Array<{ value: string; label: string }>;
    view: 'grid' | 'list';
    showResultCount: boolean;
    showViewToggle: boolean;
    showSort: boolean;
    onSortChange?: (value: string) => void;
    onViewChange?: (view: 'grid' | 'list') => void;
    ref?: React.Ref<HTMLDivElement>;
    selected?: boolean;
}
