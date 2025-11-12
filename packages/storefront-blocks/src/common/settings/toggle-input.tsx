interface ToggleInputProps {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
}

export const ToggleInput: React.FC<ToggleInputProps> = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <button
            onClick={() => onChange(!value)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
                value ? 'bg-primary' : 'bg-muted'
            }`}
        >
            <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    value ? 'translate-x-5' : ''
                }`}
            />
        </button>
    </div>
);
