import { Product } from '@/builder-blocks/compounds/index.js';
import { Card } from '@/vdb/components/ui/card.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Label } from '@/vdb/components/ui/label.js';
import { ScrollArea } from '@/vdb/components/ui/scroll-area.js';
import { api } from '@/vdb/graphql/api.js';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import { Loader2, Package, Search } from 'lucide-react';
import { useState } from 'react';
import { ProductPageSetttingsSearchQuery } from '../../pages/product/productpage.graphql.js';

interface ProductSearchInputProps {
    label?: string;
    onProductSelect: (value: Product) => void;
}

export function ProductSearchInput({ label = 'Products', onProductSelect }: ProductSearchInputProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const queryKey = ['ProductSearchInput', debouncedSearchTerm];
    const { data, isFetching } = useQuery({
        queryFn: () => {
            return api.query(ProductPageSetttingsSearchQuery, {
                options: { take: 10, filter: { name: { contains: debouncedSearchTerm } } },
            });
        },
        queryKey,
        placeholderData: keepPreviousData,
        enabled: debouncedSearchTerm.length > 0,
    });

    const products = data?.products?.items || [];

    return (
        <div className="relative flex flex-col gap-2">
            <Label>{label}</Label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="text"
                    value={searchTerm}
                    onChange={e => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Search products..."
                    className="pl-10"
                />
                {isFetching && (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                )}
            </div>

            {isOpen && searchTerm && (
                <Card className="absolute top-full z-50 mt-1 w-full border shadow-lg">
                    <ScrollArea className="max-h-80">
                        {products.length > 0 ? (
                            <div className="p-1">
                                {products.map(product => {
                                    const variant = product.variants[0];
                                    const price = variant?.prices[0];

                                    return (
                                        <button
                                            key={product.id}
                                            onClick={() => {
                                                onProductSelect(product as Product);
                                                setIsOpen(false);
                                                setSearchTerm('');
                                            }}
                                            className="flex w-full items-start gap-3 rounded-md p-3 text-left transition-colors hover:bg-accent"
                                        >
                                            {product.featuredAsset ? (
                                                <img
                                                    src={product.featuredAsset.preview}
                                                    alt={product.name}
                                                    className="h-12 w-12 rounded-md object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                                                    <Package className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-0.5">
                                                <p className="font-medium">{product.name}</p>

                                                <p
                                                    className="text-muted-foreground text-sm"
                                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                                />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            !isFetching && (
                                <div className="flex flex-col items-center justify-center p-8 text-center">
                                    <Package className="mb-2 h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">No products found</p>
                                </div>
                            )
                        )}
                    </ScrollArea>
                </Card>
            )}
        </div>
    );
}
