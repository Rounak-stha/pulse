import { api } from '@/vdb/graphql/api.js';
import { PageFragment } from '@/vdb/graphql/fragments.js';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { ChevronDown, FileText, GlobeIcon, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getPagesQuery } from '../builder.graphql.js';

const GLOBALS = [
    { region: 'header', label: 'Header' },
    { region: 'footer', label: 'Footer' },
];

interface PageSwitcherProps {
    currentPage: PageFragment | null;
    onPageChange: (pageId: string) => void;
    openCreatePageDialog: () => void;
}

export const PageSwitcher: React.FC<PageSwitcherProps> = ({
    currentPage,
    onPageChange,
    openCreatePageDialog,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ['pages'],
        queryFn: () => api.query(getPagesQuery, { options: { take: 20 } }),
    });

    const pages = data?.pages.items || [];

    const systemPages = useMemo(() => pages.filter(page => page.system), [pages]);
    const customPages = useMemo(() => pages.filter(page => !page.system), [pages]);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted rounded-md text-sm transition-colors"
            >
                <FileText className="w-4 h-4" />
                <span className="font-medium">{currentPage?.name}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
                <>
                <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                <div className="absolute top-full left-0 mt-1 w-64 bg-popover border rounded-md shadow-lg z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 border-b">
                    <button
                        onClick={() => {
                        openCreatePageDialog();
                        setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted rounded text-sm font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Create New Page
                    </button>
                    </div>

                    <div className="p-3 space-y-4">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3">Globals</p>
                        <div>
                        {GLOBALS.map(({ region, label }) => (
                            <button
                            key={region}
                            onClick={() => {
                                navigate({ to: `/dashboard/builder/globals/${region}` });
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted rounded text-sm transition-colors"
                            >
                            <GlobeIcon className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>{label}</span>
                            </button>
                        ))}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3">System Pages</p>
                        <div className="max-h-64 overflow-y-auto">
                        {systemPages.map(page => (
                            <button
                            key={page.id}
                            onClick={() => {
                                onPageChange(page.id);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 hover:bg-muted rounded text-sm transition-colors ${
                                page.id === currentPage?.id ? 'bg-muted' : ''
                            }`}
                            >
                            <span>{page.name}</span>
                            <span className={`text-xs ${page.publishedVersion ? 'text-green-500' : 'text-muted-foreground'}`}>
                                {page.publishedVersion ? '●' : '○'}
                            </span>
                            </button>
                        ))}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3">Custom Pages</p>
                        <div className="max-h-64 overflow-y-auto">
                        {customPages.map(page => (
                            <button
                            key={page.id}
                            onClick={() => {
                                onPageChange(page.id);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 hover:bg-muted rounded text-sm transition-colors ${
                                page.id === currentPage?.id ? 'bg-muted' : ''
                            }`}
                            >
                            <span>{page.name}</span>
                            <span className={`text-xs ${page.publishedVersion ? 'text-green-500' : 'text-muted-foreground'}`}>
                                {page.publishedVersion ? '●' : '○'}
                            </span>
                            </button>
                        ))}
                        </div>
                    </div>
                    </div>
                </div>
                </>
            )}
        </div>
    );
};
