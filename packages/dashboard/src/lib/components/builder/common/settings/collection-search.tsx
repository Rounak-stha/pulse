import { Card } from '@/vdb/components/ui/card.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Label } from '@/vdb/components/ui/label.js';
import { ScrollArea } from '@/vdb/components/ui/scroll-area.js';
import { api } from '@/vdb/graphql/api.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import { FolderOpen, Loader2, Search } from 'lucide-react';
import { useState } from 'react';

const collectionSearchQuery = graphql(`
    query CollectionSearchQuery($options: CollectionListOptions) {
        collections(options: $options) {
            items {
                id
                name
                slug
                featuredAsset {
                    id
                    source
                    preview
                }
            }
        }
    }
`);

interface CollectionSearchInputProps {
    label?: string;
    selectedSlug?: string;
    onCollectionSelect: (collection: { id: string; name: string; slug: string }) => void;
    onClear?: () => void;
}

export function CollectionSearchInput({
    label = 'Collection',
    selectedSlug,
    onCollectionSelect,
    onClear,
}: Readonly<CollectionSearchInputProps>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { data: selectedData } = useQuery({
        queryFn: () => {
            return api.query(collectionSearchQuery, {
                options: { take: 1, filter: { slug: { eq: selectedSlug } } },
            });
        },
        queryKey: ['CollectionSearchInput', 'selected', selectedSlug],
        enabled: !!selectedSlug,
    });

    const selectedCollection = selectedData?.collections?.items?.[0];

    const queryKey = ['CollectionSearchInput', debouncedSearchTerm];
    const { data, isFetching } = useQuery({
        queryFn: () => {
            return api.query(collectionSearchQuery, {
                options: { take: 10, filter: { name: { contains: debouncedSearchTerm } } },
            });
        },
        queryKey,
        placeholderData: keepPreviousData,
        enabled: debouncedSearchTerm.length > 0,
    });

    const collections = data?.collections?.items || [];

    return (
        <div className="relative flex flex-col gap-2">
            <Label>{label}</Label>
            {selectedSlug && selectedCollection && (
                <div className="flex items-center gap-2 rounded-md border p-2 text-sm">
                    {selectedCollection.featuredAsset ? (
                        <img
                            src={selectedCollection.featuredAsset.preview}
                            alt={selectedCollection.name}
                            className="h-8 w-8 rounded-md object-cover"
                        />
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                            <FolderOpen className="h-4 w-4 text-muted-foreground" />
                        </div>
                    )}
                    <span className="flex-1 font-medium">{selectedCollection.name}</span>
                    {onClear && (
                        <button
                            onClick={onClear}
                            className="text-xs text-muted-foreground hover:text-foreground"
                        >
                            Clear
                        </button>
                    )}
                </div>
            )}
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
                    placeholder="Search collections..."
                    className="pl-10"
                />
                {isFetching && (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                )}
            </div>

            {isOpen && searchTerm && (
                <Card className="absolute top-full z-50 mt-1 w-full border shadow-lg">
                    <ScrollArea className="max-h-80">
                        <div className="p-1">
                            {onClear && (
                                <button
                                    onClick={() => {
                                        onClear();
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                    className="flex w-full items-center gap-3 rounded-md p-3 text-left transition-colors hover:bg-accent"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                                        <FolderOpen className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <p className="font-medium">All Products</p>
                                </button>
                            )}
                            {collections.length > 0
                                ? collections.map(collection => (
                                      <button
                                          key={collection.id}
                                          onClick={() => {
                                              onCollectionSelect({
                                                  id: collection.id,
                                                  name: collection.name,
                                                  slug: collection.slug,
                                              });
                                              setIsOpen(false);
                                              setSearchTerm('');
                                          }}
                                          className="flex w-full items-start gap-3 rounded-md p-3 text-left transition-colors hover:bg-accent"
                                      >
                                          {collection.featuredAsset ? (
                                              <img
                                                  src={collection.featuredAsset.preview}
                                                  alt={collection.name}
                                                  className="h-12 w-12 rounded-md object-cover"
                                              />
                                          ) : (
                                              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                                                  <FolderOpen className="h-6 w-6 text-muted-foreground" />
                                              </div>
                                          )}
                                          <div className="flex flex-col gap-0.5">
                                              <p className="font-medium">{collection.name}</p>
                                              <p className="text-sm text-muted-foreground">
                                                  /{collection.slug}
                                              </p>
                                          </div>
                                      </button>
                                  ))
                                : !isFetching && (
                                      <div className="flex flex-col items-center justify-center p-8 text-center">
                                          <FolderOpen className="mb-2 h-8 w-8 text-muted-foreground" />
                                          <p className="text-sm text-muted-foreground">
                                              No collections found
                                          </p>
                                      </div>
                                  )}
                        </div>
                    </ScrollArea>
                </Card>
            )}
        </div>
    );
}
