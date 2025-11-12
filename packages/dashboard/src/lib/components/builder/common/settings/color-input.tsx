interface ColorInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

export const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange }) => {
    const presetColors = [
        '#000000',
        '#ffffff',
        '#ef4444',
        '#f97316',
        '#f59e0b',
        '#84cc16',
        '#22c55e',
        '#14b8a6',
        '#06b6d4',
        '#3b82f6',
        '#6366f1',
        '#8b5cf6',
        '#a855f7',
        '#ec4899',
        '#f43f5e',
    ];

    return (
        <div>
            <label className="text-sm font-medium block mb-2">{label}</label>

            {/* Color input with preview */}
            <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        placeholder="#000000"
                        className="w-full px-3 py-2 pl-10 bg-background border border-input rounded-md text-sm font-mono"
                    />
                    <div
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded border border-input"
                        style={{ backgroundColor: value }}
                    />
                </div>
                <input
                    type="color"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className="w-12 h-full rounded-md border border-input cursor-pointer"
                />
            </div>

            {/* Preset colors */}
            <div className="flex flex-wrap gap-2">
                {presetColors.map(color => (
                    <button
                        key={color}
                        onClick={() => onChange(color)}
                        className={`
              w-8 h-8 rounded-md border-2 transition-all
              ${value === color ? 'border-primary scale-110' : 'border-transparent hover:scale-105'}
            `}
                        style={{ backgroundColor: color }}
                        title={color}
                    />
                ))}
            </div>
        </div>
    );
};
