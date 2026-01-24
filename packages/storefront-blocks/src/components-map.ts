import { Badge, Button, Headline, RootContainer, Subtext } from './atoms/index.js';
import { FeaturedCollections, Footer, Header, HeroBanner, ProductGallery, ProductInfo, ProductPage, AddToCart } from './compounds/index.js';

export const ComponentMap = {
    Headline,
    Badge,
    Button,
    RootContainer,
    Subtext,
    HeroBanner,
    Header,
    FeaturedCollections,
    Footer,
    ProductPage,
    ProductGallery,
    ProductInfo,
    AddToCart,
} as const;
