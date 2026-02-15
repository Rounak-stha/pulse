# AGENTS.md

## Commands

- **Install**: `npm install`
- **Build all**: `npm run build`
- **Lint**: `npm run lint --fix`
- **Test all**: `npm run test` | Single package: `cd packages/<name> && npm run test`
- **E2E tests**: `npm run e2e` | Single: `cd packages/<name> && npm run e2e`
- **Dev server**: `cd packages/dev-server && npm run dev`
- **Codegen**: `npm run codegen` (regenerates GraphQL types)

## Architecture

Lerna monorepo with packages in `packages/`. Key packages: `core` (main framework), `common` (shared types), `dashboard` (React admin UI), `dev-server` (local dev), `testing` (e2e helpers). Plugins: `payments-plugin`, `email-plugin`, `elasticsearch-plugin`, `asset-server-plugin`. Uses TypeORM with MySQL/MariaDB/PostgreSQL/SQLite. GraphQL APIs: Admin API & Shop API.

**Read `documentation/builder/builder-architecture.md` FIRST** before making any changes to the website builder, storefront, or dashboard builder packages. It documents the full data model, rendering flow, globals system, file locations, and component structure.

## Code Style

- TypeScript with strict typing. Prettier for formatting. ESLint with `@typescript-eslint`.
- Imports: alphabetized, grouped (external → parent → sibling). Use `import/order` rule.
- Commits: Conventional Commits format `type(scope): message` (feat/fix/docs/perf/refactor/test/chore).
- Dashboard (packages/dashboard): React + TanStack Query/Router + Shadcn/Tailwind. Use `graphql()` from gql.tada, `api.query/mutate`. Localize with `<Trans>` and `useLingui`. Props must be `Readonly<>`.
- No `console.log`. Prefer `for-of` over `for-in`. Use `object-shorthand`.

## Website Builder

The dashboard has a website builder (Craft.js) with three packages that share components but have strict separation of concerns:

### Package Responsibilities

| Package                      | Role                                                                                                                                | Dependencies                                       | Framework    |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------ |
| `packages/storefront-blocks` | Pure, presentational React components. No data fetching, no routing, no mutations.                                                  | `clsx`, `tailwind-merge`, `lucide-react` (peer)    | React only   |
| `packages/dashboard`         | Builder wrappers that make blocks selectable/configurable in Craft.js editor. Provides settings panels. Uses mock data for preview. | `@craftjs/core`, `@tanstack/react-query`, gql.tada | React + Vite |
| `packages/storefront`        | Runtime renderers that wrap pure blocks with Next.js routing, Apollo Client mutations, and data fetching.                           | `@apollo/client`, `next`                           | Next.js      |

**Do not pollute across packages.** Storefront-blocks must never import from dashboard or storefront. Dashboard and storefront both import from storefront-blocks.

### Import Aliases

- **Dashboard** uses `@/builder-blocks/...` which maps to `packages/storefront-blocks/src/...`
- **Dashboard** uses `@/vdb/...` which maps to `packages/dashboard/src/lib/...`
- **Storefront** uses `@vendure/storefront-blocks/compounds` (package export from built output)
- **Storefront** uses `@vendure/storefront-blocks/types` (rolled-up `.d.ts` via rollup-plugin-dts)

### Adding a New Page (e.g., Checkout, Collection)

Follow the **product page** as the reference implementation. A new page requires work in all three packages:

#### 1. `storefront-blocks/src/compounds/<page>/` — Pure Components

Each page is a **compound** with sub-blocks. Structure:

```
compounds/<page>/
  context.tsx              # Shared preview context (createContext + Provider + useHook)
  index.tsx                # Barrel exports for all sub-blocks
  page/
    index.tsx              # Main layout component (FC, renders slots)
    types.ts               # All shared types: data models, BaseProps, RuntimeProps, BuilderProps
    constants/
      props.ts             # DefaultProps (used by builder + renderer as fallback)
      styles.ts            # Tailwind class maps (containerSize, spacing, etc.)
  <subBlock>/              # One directory per sub-block (e.g., orderSummary, customerInfo)
    index.tsx              # Pure component (FC, 'use client', uses cn() utility)
    types.ts               # Props interface for this sub-block
    constants/
      props.ts             # Default props for this sub-block
```

**Conventions:**

- Components are `FC` with destructured props. Use `'use client'` directive.
- Use `cn()` from `../../../lib/utils.js` for class merging.
- Use `lucide-react` for icons.
- Props include `ref?: React.Ref<HTMLDivElement>` and `selected?: boolean` for builder integration.
- Callbacks are optional (e.g., `onSubmit?: (data) => void`) — the pure component handles local state/validation, the renderer provides the callback.
- `types.ts` in `page/` must export: `<Page>BaseProps`, `<Page>RuntimeProps` (extends Base + data), `<Page>BuilderProps` (extends Base, no data).

**After creating:** Register in `compounds/index.ts` and `components-map.ts`.

#### 2. `dashboard/src/lib/components/builder/pages/<page>/` — Builder Wrappers

```
pages/<page>/
  index.tsx                # Main builder component (useNode, Element slots, PreviewProvider)
  settings.tsx             # Settings panel (SettingsTabs, SelectInput, ToggleInput)
  template.tsx             # Initial Craft template (<RootContainer><Page .../></RootContainer>)
  mock-data.ts             # Static mock data for builder preview (no API calls needed)
  <subBlock>/
    index.tsx              # Wraps pure component with useNode connector + craft metadata
    settings.tsx           # Settings panel for this sub-block
```

**Conventions:**

- Import pure components from `@/builder-blocks/compounds/index.js`.
- Each component uses `useNode` to get `connect` and `selected` state.
- Sub-blocks are rendered as `<Element id="..." is={SubBlock} {...DefaultProps} />` inside the page.
- Attach `craft` metadata: `(Component as any).craft = { displayName, props, rules: { canDrag: false, canDrop: false }, related: { settings } }`.
- Settings use `useNode` to get `setProp` + `props`, and render `SettingsTabs` with `SelectInput`/`ToggleInput` from `@/vdb/components/builder/common/index.js`.

**After creating:** Export from `pages/index.ts` and register in `builder/index.tsx` (`BuilderComponents` map).

#### 3. `storefront/lib/renderer/page/<page>/` — Runtime Renderers

```
renderer/page/<page>/
  index.tsx                # Main PageRenderer (Craft tree → slot mapping, data fetching)
  <sub-block>.tsx          # One file per sub-block (wraps pure component + Apollo mutation)
```

**Conventions:**

- All files use `'use client'` directive.
- Import pure components from `@vendure/storefront-blocks/compounds`.
- Import types from `@vendure/storefront-blocks/types`.
- The main renderer uses `useQuery`/`useMutation` from `@apollo/client/react`.
- Pass `shopcode` header via `context: { headers: { shopcode } }` on all Apollo calls.
- Sub-block renderers handle mutations and pass callbacks to pure components. On mutation success, call `onStepComplete?.()` or similar to advance state.
- Error handling: check `__typename` on union results, surface errors as `error` prop to pure component.

**GraphQL queries** go in `storefront/lib/queries/<page>.ts` using `gql` + `TypedDocumentNode` from `@apollo/client`. Define inline types for query/mutation results.

**Note:** The root `graphql.config.yml` points to `schema-admin.json`, so Shop API queries will show false GraphQL validation errors in the IDE — this is expected.

### Existing Pages

- **Product page**: `compounds/product/` (sub-blocks: `gallery`, `info`, `addToCart`, `page`)
- **Checkout page**: `compounds/checkout/` (sub-blocks: `orderSummary`, `customerInfo`, `shippingAddress`, `shippingMethod`, `payment`, `confirmation`, `page`)
