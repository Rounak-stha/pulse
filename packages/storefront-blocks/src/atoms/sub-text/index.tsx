import { cn } from '../../lib/utils.js';
import { SubtextProps } from './types.js';

export const Subtext: React.FC<SubtextProps> = ({ text, color, className, ref }) => {
    return (
        <p ref={ref} className={cn('mb-8 leading-relaxed', className)} style={{ color }}>
            {text}
        </p>
    );
};
