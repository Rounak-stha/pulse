import { FacetGroup } from '../page/types.js';

export interface ShopFiltersProps {
    facetGroups: FacetGroup[];
    selectedValueIds: string[];
    mode: 'checkbox' | 'pill';
    showCounts: boolean;
    collapsible: boolean;
    onToggle?: (valueId: string) => void;
    onClearAll?: () => void;
    ref?: React.Ref<HTMLDivElement>;
    selected?: boolean;
}
