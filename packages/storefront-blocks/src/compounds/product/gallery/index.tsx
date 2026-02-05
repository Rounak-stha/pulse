'use client';
import { ChevronLeft, ChevronRight, Maximize2, ZoomIn } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../../lib/utils.js';
import { ProductGalleryProps } from './types.js';

interface ThumbnailProps {
    image: { id: string; source: string; preview?: string };
    index: number;
    isSelected: boolean;
    onClick: () => void;
}

const Thumbnail: React.FC<ThumbnailProps> = ({ image, index, isSelected, onClick }) => (
    <button
        onClick={onClick}
        className={cn(
            'flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-200 hover:scale-105',
            isSelected ? 'border-primary shadow-lg' : 'border-border hover:border-muted-foreground',
        )}
    >
        <img
            src={image.preview || image.source}
            alt={`Thumbnail ${index + 1}`}
            className="w-full h-full object-cover"
        />
    </button>
);

export const ProductGallery: React.FC<ProductGalleryProps> = ({
    className,
    images,
    selectedImageIndex,
    layout = 'grid',
    thumbnailPosition = 'bottom',
    zoom = true,
    aspectRatio = '1:1',
    ref,
    selected,
}) => {
    const [selectedIndex, setSelectedIndex] = useState(selectedImageIndex);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
    const [isFullscreen, setIsFullscreen] = useState(false);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSelectedIndex(selectedImageIndex);
    }, [selectedImageIndex]);

    const aspectRatioMap = {
        '1:1': 'aspect-square',
        '4:3': 'aspect-[4/3]',
        '16:9': 'aspect-video',
        '3:4': 'aspect-[3/4]',
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!zoom || !imageRef.current) return;
        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
    };

    const goToPrevious = () => setSelectedIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    const goToNext = () => setSelectedIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));

    if (images.length === 0) {
        return (
            <div
                ref={ref}
                className={cn(
                    'relative w-full aspect-square rounded-lg flex items-center justify-center bg-muted',
                    className,
                )}
            >
                <p className="text-muted-foreground">No images available</p>
            </div>
        );
    }

    const containerClasses =
        layout === 'grid'
            ? thumbnailPosition === 'left'
                ? 'flex flex-row-reverse gap-4'
                : thumbnailPosition === 'right'
                  ? 'flex flex-row gap-4'
                  : 'flex flex-col gap-4'
            : 'flex flex-col gap-4';

    const renderThumbnails = () => {
        if (images.length <= 1) return null;

        const thumbnails = images.map((img, idx) => (
            <Thumbnail
                key={img.id}
                image={img}
                index={idx}
                isSelected={selectedIndex === idx}
                onClick={() => setSelectedIndex(idx)}
            />
        ));

        const isVertical = thumbnailPosition === 'left' || thumbnailPosition === 'right';
        const wrapperClass = cn(
            'flex gap-2',
            isVertical ? 'flex-col overflow-y-auto max-h-[600px]' : 'flex-row overflow-x-auto pb-2',
        );

        return <div className={wrapperClass}>{thumbnails}</div>;
    };

    return (
        <div ref={ref} className={cn('relative w-full', selected && 'ring-2 ring-ring', className)}>
            <div className={containerClasses}>
                {thumbnailPosition === 'left' && renderThumbnails()}

                <div className="flex-1">
                    <div
                        ref={imageRef}
                        className={cn(
                            'relative rounded-lg overflow-hidden bg-muted group',
                            aspectRatioMap[aspectRatio] || 'aspect-square',
                        )}
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => zoom && setIsZoomed(true)}
                        onMouseLeave={() => setIsZoomed(false)}
                    >
                        <img
                            src={images[selectedIndex]?.source || images[selectedIndex]?.preview}
                            alt="Product"
                            className={cn(
                                'w-full h-full object-cover transition-transform duration-300',
                                isZoomed && 'scale-150 cursor-zoom-in',
                            )}
                            style={
                                isZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}
                            }
                        />

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={goToPrevious}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={goToNext}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </>
                        )}

                        {zoom && (
                            <div className="absolute top-4 right-4 bg-background/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <ZoomIn className="w-4 h-4" />
                            </div>
                        )}

                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="absolute bottom-4 right-4 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>

                        {images.length > 1 && (
                            <div className="absolute bottom-4 left-4 bg-background/80 text-foreground px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                {selectedIndex + 1} / {images.length}
                            </div>
                        )}
                    </div>
                </div>

                {thumbnailPosition === 'right' && renderThumbnails()}
            </div>

            {(thumbnailPosition === 'bottom' || thumbnailPosition === 'top') && (
                <div className={cn(thumbnailPosition === 'top' ? 'order-first mb-4' : 'mt-4')}>
                    {renderThumbnails()}
                </div>
            )}

            {isFullscreen && (
                <div
                    className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center backdrop-blur-sm"
                    onClick={() => setIsFullscreen(false)}
                >
                    <button className="absolute top-4 right-4 text-foreground text-4xl hover:text-muted-foreground transition-colors">
                        &times;
                    </button>
                    <img
                        src={images[selectedIndex]?.source}
                        alt="Product fullscreen"
                        className="max-w-[90vw] max-h-[90vh] object-contain"
                        onClick={e => e.stopPropagation()}
                    />
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    goToPrevious();
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/30 p-3 rounded-full transition-colors"
                            >
                                <ChevronLeft className="w-8 h-8 text-foreground" />
                            </button>
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    goToNext();
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/30 p-3 rounded-full transition-colors"
                            >
                                <ChevronRight className="w-8 h-8 text-foreground" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
