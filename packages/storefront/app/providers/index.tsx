import { DesignSystemProvider } from '@vendure/storefront-blocks/design-system/context.js';

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
    return <DesignSystemProvider>{children}</DesignSystemProvider>;
}
