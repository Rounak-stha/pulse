import { cn } from '../../lib/utils.js';
import { BadgeProps } from './types.js';

export const Badge: React.FC<BadgeProps> = ({ text, backgroundColor, textColor, className, ref }) => {
    return (
        <span
            ref={ref}
            className={cn(
                'text-xs font-medium tracking-wider uppercase px-4 py-2 rounded-full inline-block',
                className,
            )}
            style={{ backgroundColor, color: textColor }}
        >
            {text}
        </span>
    );
};
