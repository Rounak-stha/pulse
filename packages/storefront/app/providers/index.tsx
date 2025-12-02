import { DesignSystemProvider } from '@vendure/storefront-blocks/design-system/context.js';
import { ApolloProvider } from './apollo';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ApolloProvider>
            <DesignSystemProvider>{children}</DesignSystemProvider>
        </ApolloProvider>
    );
}
