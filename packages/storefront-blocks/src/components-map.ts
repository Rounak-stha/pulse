import { Badge, Button, Headline, RootContainer, Subtext } from './atoms/index.js';
import { FeaturedCollections, Footer, Header, HeroBanner } from './compounds/index.js';

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
} as const;
