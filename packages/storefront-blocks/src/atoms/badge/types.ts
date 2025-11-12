import { Ref } from 'react';

export interface BadgeProps {
    text: string;
    backgroundColor: string;
    textColor: string;
    className?: string;
    ref?: Ref<HTMLSpanElement>;
}
