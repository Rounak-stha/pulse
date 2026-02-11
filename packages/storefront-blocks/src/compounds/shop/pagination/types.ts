export interface ShopPaginationProps {
    page: number;
    perPage: number;
    totalItems: number;
    style: 'numbered' | 'simple';
    showPageSize: boolean;
    pageSizeOptions: number[];
    onPageChange?: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
    ref?: React.Ref<HTMLDivElement>;
    selected?: boolean;
}
