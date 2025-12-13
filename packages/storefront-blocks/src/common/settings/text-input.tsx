interface TextInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
}

export const TextInput: React.FC<TextInputProps> = ({ label, value, onChange, rows = 1 }) => (
    <div>
        <label className="text-sm font-medium block mb-2">{label}</label>
        {rows > 1 ? (
            <textarea
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm font-mono"
                rows={rows}
            />
        ) : (
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm font-mono"
            />
        )}
    </div>
);
