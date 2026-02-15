# Website Builder Architecture

## Overview

The website builder uses **Craft.js** for drag-and-drop page editing. It spans three packages with strict separation:

```
storefront-blocks  →  Pure presentational React components (no data fetching)
dashboard          →  Craft.js builder wrappers (useNode, settings panels, mock data)
storefront         →  Next.js runtime renderers (Apollo Client, data fetching, mutations)
```

Both `dashboard` and `storefront` import from `storefront-blocks`. Never the reverse.

## Data Model

### Entities (packages/core/src/entity/page/)

- **Page** (`page.entity.ts`): Belongs to a `Shop`. Has `name`, `slug`, `system` (bool), `publishedVersion`, `draftVersion`.
- **PageVersion** (`page-version.entity.ts`): Stores `content` (LZ-compressed Base64 Craft.js JSON), `theme` (JSON), `status` (DRAFT/PUBLISHED/ARCHIVED).
- **Default pages** (`default-pages.json`): Seeded on shop creation. Includes system pages: `home`, `product`, `__global_header`, `__global_footer`.

### Page Service (packages/core/src/service/services/page.service.ts)

Key methods: `create`, `update`, `delete`, `saveDraft`, `publish`, `getPublishedPageBySlug`, `createDefaultPagesAfterRegistration`.

Global slugs (`__global_header`, `__global_footer`) are protected from rename and deletion.

### Sync Service (packages/core/src/plugin/sync-pages-plugin/syncPages/sync-pages.service.ts)

Runs on startup. Ensures every shop has all system pages from `default-pages.json`.

## GraphQL APIs

### Admin API (packages/core/src/api/schema/admin-api/page.api.graphql)

- `page(id)`, `pageBySlug(slug)`, `pages(options)` — fetch pages
- `createPage`, `updatePage`, `deletePage` — CRUD
- `savePageDraft(input)`, `publishPage(input)` — versioning
- `theme`, `updateTheme` — shop theme

### Shop API (packages/core/src/api/schema/shop-api/shop.api.graphql)

- `pageBySlug(slug): ShopPage` — returns `{ id, name, slug, publishedVersion: { id, content, theme } }`
- `theme: Theme` — returns `{ id, value }`

### Resolvers

- Admin: `packages/core/src/api/resolvers/admin/page.resolver.ts`
- Shop: `packages/core/src/api/resolvers/shop/shop-page.resolver.ts`

## Dashboard (Builder)

### Key Files

| File | Purpose |
|---|---|
| `dashboard/src/app/routes/_builder/builder_.$id.tsx` | Route: `/builder/$id` |
| `dashboard/src/app/routes/_builder/components/CraftBuilder.tsx` | Initializes `<Editor resolver={BuilderComponents}>` + `<BuilderProvider>` |
| `dashboard/src/lib/providers/builder.tsx` | `BuilderProvider` — fetches page, manages save/publish/create, LZ compress/decompress |
| `dashboard/src/lib/components/builder/index.tsx` | `BuilderComponents` map — all Craft.js components registered here |
| `dashboard/src/lib/components/builder/builder.graphql.ts` | All builder GraphQL queries/mutations |
| `dashboard/src/lib/components/builder/toolbar/page-switcher.tsx` | Page dropdown: Globals / System Pages / Custom Pages |
| `dashboard/src/lib/components/builder/toolbar/create-page-dialog.tsx` | New page creation dialog |
| `dashboard/src/lib/components/builder/sidebar/left.tsx` | Left sidebar (component palette) |
| `dashboard/src/lib/components/builder/sidebar/right.tsx` | Right sidebar (selected component settings) |

### Builder Components Structure

```
dashboard/src/lib/components/builder/
  blocks/
    atoms/          → RootContainer, Badge, Button, Headline, Subtext
    compounds/
      header/main/  → Header builder wrapper + settings
      footer/main/  → Footer builder wrapper + settings
      hero/banner/  → HeroBanner builder wrapper + settings
  pages/
    product/        → ProductPage, ProductGallery, ProductInfo, AddToCart
    checkout/       → CheckoutPage, OrderSummary, CustomerInfo, ShippingAddress, etc.
    shop/           → ShopPage, ProductGrid, ShopFilters, ShopToolbar, ShopPagination
```

Each builder component: wraps the pure component with `useNode` for `connect`/`drag`/`selected`, attaches `.craft` metadata.

### Content Serialization

- **Save**: `query.serialize()` → JSON string → `LZString.compressToBase64()` → stored as `content` in PageVersion
- **Load**: `LZString.decompressFromBase64(content)` → JSON string → `actions.deserialize(json)`

## Storefront (Next.js)

### Route Structure

```
app/shop/[shopcode]/
  layout.tsx                    → Fetches globals (header/footer) + theme, wraps pages in RootContainer
  page.tsx                      → Redirects to /home
  [pagename]/page.tsx           → Generic page renderer (home, custom pages)
  product/[productId]/page.tsx  → Product page
  shop/page.tsx                 → Shop/catalog page (fetches products)
  checkout/page.tsx             → Checkout page
```

### Data Fetching (packages/storefront/lib/)

| File | Purpose |
|---|---|
| `apollo-client-server.ts` | SSR Apollo Client (`NEXT_PUBLIC_GRAPHQL_URL`) |
| `page-data.ts` | `fetchPageData(shopcode, queries[])` — parallel query execution with shopcode header. `parsePageTree()` — LZ decompress. `parseTheme()` — JSON parse. |
| `queries/page.ts` | `getPageBySlugQuery` (single page), `getGlobalsQuery` (header + footer via aliases) |
| `queries/product.ts` | Product query |
| `queries/shop.ts` | Products list query |
| `queries/checkout.ts` | Checkout queries/mutations |
| `queries/cart.ts` | Cart queries/mutations |

### Renderer (packages/storefront/lib/renderer/)

| File | Purpose |
|---|---|
| `index.tsx` | `BuilderTreeRenderer` — walks Craft tree ROOT node, dispatches to component renderers. Skips Header/Footer (handled by layout globals). |
| `globals.tsx` | `GlobalHeaderRenderer`, `GlobalFooterRenderer` — extracts Header/Footer from global page trees |
| `compounds/header/main.tsx` | `HeaderRenderer` — renders pure Header with props |
| `compounds/footer/main.tsx` | `FooterRenderer` — renders pure Footer with props |
| `compounds/hero/banner.tsx` | `HeroBannerRenderer` |
| `showcase/featured/index.tsx` | `FeaturedCollectionsRenderer` (fetches collections via Apollo) |
| `page/product/index.tsx` | `ProductPageRenderer` — maps Craft linked nodes to slots |
| `page/checkout/index.tsx` | `CheckoutPageRenderer` |
| `page/shop/index.tsx` | `ShopPageRenderer` |

### Rendering Flow

```
layout.tsx (server component)
  ├── fetchPageData(shopcode, [getGlobalsQuery])
  ├── parsePageTree(header.content) → headerTree
  ├── parsePageTree(footer.content) → footerTree
  ├── parseTheme(theme.value) → theme
  └── <RootContainer theme={theme}>
        <GlobalHeaderRenderer tree={headerTree} />
        {children}  ← page route renders here
        <GlobalFooterRenderer tree={footerTree} />
      </RootContainer>

page route (e.g., [pagename]/page.tsx)
  ├── fetchPageData(shopcode, [getPageBySlugQuery, ...])
  ├── parsePageTree(content) → tree
  └── <BuilderTreeRenderer tree={tree} ...>
        └── RenderRoot: walks tree nodes, renders components
            (skips Header/Footer — handled by layout)
```

## Globals System

Globals (header, footer) use a **dedicated `BuilderGlobal` entity**, separate from pages.

### Entity (`packages/core/src/entity/builder-global/builder-global.entity.ts`)

`BuilderGlobal` has: `shop` (ManyToOne), `region` (string, e.g., 'header'/'footer'), `content` (published LZ-compressed Craft.js JSON), `draftContent` (draft). Unique constraint on (shop, region).

### Backend

- **Service**: `packages/core/src/service/services/builder-global.service.ts` — `findByRegion`, `findAll`, `saveDraft`, `publish`, `getAllPublished`
- **Admin API**: `builderGlobal(region)`, `builderGlobals`, `saveBuilderGlobalDraft(input)`, `publishBuilderGlobal(input)`
- **Shop API**: `publishedBuilderGlobals` — returns `[{ region, content }]`
- **Schema**: `packages/core/src/api/schema/admin-api/builder-global.api.graphql`, `packages/core/src/api/schema/shop-api/builder-global.api.graphql`

### Dashboard

- **GraphQL**: `packages/dashboard/src/lib/components/builder/globals.graphql.ts`
- **Provider**: `packages/dashboard/src/lib/providers/builder.tsx` — `BuilderProvider` (loads/saves pages and globals via Craft.js editor, LZ compression) - previously separate providers for pages and globals have been unified
- **Route**: `/dashboard/builder/globals/$region` → `BuilderEditor` (reuses the same component as pages)
- **Components**: `CraftBuilder.tsx` (unified component for both pages and globals), `Toolbar.tsx` (unified toolbar for both pages and globals with context-aware UI)
- **PageSwitcher**: Shows "Globals" section with Header/Footer entries that navigate to globals builder route

### Storefront

- **Query**: `getPublishedBuilderGlobalsQuery` in `packages/storefront/lib/queries/page.ts`
- **Layout**: `app/shop/[shopcode]/layout.tsx` — fetches globals, renders `GlobalHeaderRenderer` / `GlobalFooterRenderer` around `{children}`
- **Renderers**: `packages/storefront/lib/renderer/globals.tsx` — walks global Craft trees to find and render Header/Footer
- **Page renderer**: Skips Header/Footer components in page trees (handled by layout)

## Storefront Blocks (Pure Components)

### Directory Structure

```
storefront-blocks/src/
  atoms/
    root-container/   → RootContainer (theme CSS vars wrapper)
  compounds/
    header/           → Header component
    footer/           → Footer component
    hero/             → HeroBanner
    showcase/         → FeaturedCollections
    product/          → ProductPage, Gallery, Info, AddToCart
    checkout/         → CheckoutPage, OrderSummary, CustomerInfo, etc.
    shop/             → ShopPage, ProductGrid, Filters, Toolbar, Pagination
    index.ts          → Barrel export for all compounds
  components-map.ts   → ComponentMap (name → component mapping)
  design-system/      → Design system context/provider
  lib/utils.ts        → cn() utility (clsx + tailwind-merge)
```

### Import Aliases

- **Dashboard**: `@/builder-blocks/...` → `packages/storefront-blocks/src/...`
- **Dashboard**: `@/vdb/...` → `packages/dashboard/src/lib/...`
- **Storefront**: `@vendure/storefront-blocks/compounds` (package export)
- **Storefront**: `@vendure/storefront-blocks/atoms` (package export)
- **Storefront**: `@vendure/storefront-blocks/types` (rolled-up .d.ts)
- **Storefront**: `@vendure/storefront-blocks/components-map` (package export)
