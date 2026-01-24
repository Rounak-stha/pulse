interface NumberInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

export const NumberInput: React.FC<NumberInputProps> = ({ label, value, onChange }) => (
    <div>
        <label className="text-sm font-medium block mb-2">{label}</label>

        <input
            type="number"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm font-mono"
        />
    </div>
);
