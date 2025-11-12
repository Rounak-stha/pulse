import { ReactNode } from 'react';

export interface RootContainerProps {
    children: ReactNode;
    ref?: React.Ref<HTMLDivElement>;
}
