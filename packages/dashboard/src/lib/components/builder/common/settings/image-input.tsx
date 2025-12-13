import { Upload, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import { Asset } from '@/vdb/components/shared/asset/asset-gallery.js';

import { BuilderAssetPickerDialog } from './builder-asset-picker.jsx';

interface ImageUploadInputProps {
    label: string;
    value?: string;
    onChange: (value: string) => void;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({ label, value, onChange }) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [assetPickerOpen, setAssetPickerOpen] = useState(false);
    const [asset, setAsset] = useState<Asset | null>(null);

    const handleAssetsPicked = useCallback((selectedAssets: Asset[]) => {
        if (selectedAssets.length) {
            // Remove duplicates
            console.log(selectedAssets);
            setAsset(selectedAssets[0]);
            onChange(selectedAssets[0].preview);
        }
        setAssetPickerOpen(false);
    }, []);

    const clearImage = () => {
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div>
            <label className="text-sm font-medium block mb-2">{label}</label>

            {value ? (
                // Preview
                <div className="relative group">
                    <div className="aspect-video w-full rounded-md overflow-hidden border border-input bg-muted">
                        <img src={value} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <button
                        onClick={clearImage}
                        className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                // Upload area
                <div className="space-y-2">
                    <button
                        onClick={() => setAssetPickerOpen(true)}
                        disabled={isUploading}
                        className="w-full aspect-video flex flex-col items-center justify-center gap-2 border-2 border-dashed border-input rounded-md hover:border-primary/50 transition-colors bg-background disabled:opacity-50"
                    >
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <span className="text-sm font-medium">Click to upload</span>
                        <span className="text-xs text-muted-foreground">or drag and drop</span>
                    </button>
                </div>
            )}
            <BuilderAssetPickerDialog
                open={assetPickerOpen}
                onClose={() => setAssetPickerOpen(false)}
                onSelect={handleAssetsPicked}
            />
        </div>
    );
};
