// components/CreatePageDialog.tsx
import { Button } from '@/vdb/components/ui/button.js';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/vdb/components/ui/dialog.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Label } from '@/vdb/components/ui/label.js';
import { Textarea } from '@/vdb/components/ui/textarea.js';
import { useForm } from 'react-hook-form';

interface CreatePageDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreatePageInput) => Promise<void>;
    isCreating?: boolean;
}

interface CreatePageInput {
    name: string;
    slug: string;
    description?: string;
}

export const CreatePageDialog: React.FC<CreatePageDialogProps> = ({
    open,
    onOpenChange,
    onSubmit,
    isCreating = false,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<CreatePageInput>();

    const nameValue = watch('name');

    // Auto-generate slug from name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        setValue('slug', slug);
    };

    const handleFormSubmit = async (data: CreatePageInput) => {
        await onSubmit(data);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Create New Page</DialogTitle>
                        <DialogDescription>
                            Enter the details for your new page. The slug will be used in the URL.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="buider-new-page-name">
                                Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="buider-new-page-name"
                                placeholder="Page Name"
                                {...register('name', {
                                    required: 'Name is required',
                                    onChange: handleNameChange,
                                })}
                            />
                            {errors.name && (
                                <span className="text-sm text-destructive">{errors.name.message}</span>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="slug">
                                Slug <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="slug"
                                placeholder="home-page"
                                {...register('slug', {
                                    required: 'Slug is required',
                                    pattern: {
                                        value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                                        message: 'Slug must be lowercase alphanumeric with hyphens',
                                    },
                                })}
                            />
                            {errors.slug && (
                                <span className="text-sm text-destructive">{errors.slug.message}</span>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="builder-new-page-description">Description</Label>
                            <Textarea
                                id="builder-new-page-description"
                                placeholder="A brief description of the page..."
                                rows={3}
                                {...register('description')}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                reset();
                                onOpenChange(false);
                            }}
                            disabled={isCreating}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isCreating}>
                            {isCreating ? 'Creating...' : 'Create Page'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
