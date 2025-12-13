import { Ref } from 'react';

export interface SubtextProps {
    text: string;
    color: string;
    className?: string;
    ref?: Ref<HTMLParagraphElement>;
}
