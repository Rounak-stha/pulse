import { Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface ImageUploadInputProps {
    label: string;
    value?: string;
    onChange: (value: string) => void;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({ label, value, onChange }) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        try {
            // Option 1: Convert to base64 (simple but increases bundle size)
            const reader = new FileReader();
            reader.onload = () => {
                onChange(reader.result as string);
                setIsUploading(false);
            };
            reader.readAsDataURL(file);

            // Option 2: Upload to your server (recommended for production)
            // const formData = new FormData();
            // formData.append('image', file);
            // const response = await fetch('/api/upload', {
            //   method: 'POST',
            //   body: formData,
            // });
            // const { url } = await response.json();
            // onChange(url);
            // setIsUploading(false);
        } catch (error) {
            console.error('Upload failed:', error);
            setIsUploading(false);
        }
    };

    const handleUrlInput = (url: string) => {
        onChange(url);
    };

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
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full aspect-video flex flex-col items-center justify-center gap-2 border-2 border-dashed border-input rounded-md hover:border-primary/50 transition-colors bg-background disabled:opacity-50"
                    >
                        {isUploading ? (
                            <>
                                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                <span className="text-sm text-muted-foreground">Uploading...</span>
                            </>
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-muted-foreground" />
                                <span className="text-sm font-medium">Click to upload</span>
                                <span className="text-xs text-muted-foreground">or drag and drop</span>
                            </>
                        )}
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-input" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-background px-2 text-muted-foreground">or paste URL</span>
                        </div>
                    </div>

                    <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        onChange={e => handleUrlInput(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
                    />
                </div>
            )}
        </div>
    );
};
