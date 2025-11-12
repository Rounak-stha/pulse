interface SpacingInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

export const SpacingInput: React.FC<SpacingInputProps> = ({ label, value, onChange }) => {
    const options = [
        { value: 'compact', label: 'Compact', description: 'Tight spacing' },
        { value: 'normal', label: 'Normal', description: 'Default spacing' },
        { value: 'comfortable', label: 'Comfortable', description: 'Relaxed spacing' },
        { value: 'spacious', label: 'Spacious', description: 'Extra room' },
    ];

    return (
        <div>
            <label className="text-sm font-medium block mb-2">{label}</label>
            <div className="grid grid-cols-2 gap-2">
                {options.map(option => (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={`
              px-3 py-2 rounded-md text-sm border transition-all
              ${
                  value === option.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-input hover:border-primary/50'
              }
            `}
                    >
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs opacity-70">{option.description}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};
