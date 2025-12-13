// components/PageSwitcher.tsx
import { useBuilderPage } from '@/vdb/framework/page/use-builder-page.js';
import { api } from '@/vdb/graphql/api.js';
import { PageFragment } from '@/vdb/graphql/fragments.js';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, FileText, Plus } from 'lucide-react';
import { useState } from 'react';
import { getPagesQuery } from '../buider.graphql.js';
import { CreatePageDialog } from './create-page-dialog.js';

interface PageSwitcherProps {
    currentPage: PageFragment | null;
    onPageChange: (pageId: string) => void;
    onCreatePage: ReturnType<typeof useBuilderPage>['createPage'];
}

export const PageSwitcher: React.FC<PageSwitcherProps> = ({ currentPage, onPageChange, onCreatePage }) => {
    const [newPageDialogOpen, setNewPageDialogOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ['pages'],
        queryFn: () => api.query(getPagesQuery, { options: { take: 20 } }),
    });

    const handleCreatePage = async (input: { name: string; slug: string; description?: string }) => {
        await onCreatePage(input);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted rounded-md text-sm"
            >
                <FileText className="w-4 h-4" />
                <span className="font-medium">{currentPage?.name}</span>
                <ChevronDown className="w-4 h-4" />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 w-64 bg-popover border rounded-md shadow-lg z-20">
                        <div className="p-2">
                            <button
                                onClick={() => {
                                    setNewPageDialogOpen(true);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted rounded text-sm font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                Create New Page
                            </button>
                        </div>

                        <div className="border-t max-h-64 overflow-y-auto">
                            {data?.pages?.items?.map(page => (
                                <button
                                    key={page.id}
                                    onClick={() => {
                                        onPageChange(page.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 hover:bg-muted text-sm ${
                                        page.id === currentPage?.id ? 'bg-muted' : ''
                                    }`}
                                >
                                    <span>{page.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {page.publishedVersion ? '●' : '○'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
            <CreatePageDialog
                open={newPageDialogOpen}
                onOpenChange={setNewPageDialogOpen}
                onSubmit={handleCreatePage}
            />
        </div>
    );
};
