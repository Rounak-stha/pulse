interface SelectInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
}

export const SelectInput: React.FC<SelectInputProps> = ({ label, value, onChange, options }) => (
    <div>
        <label className="text-sm font-medium block mb-2">{label}</label>
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm font-mono"
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);
