'use client';
import { createApolloClient } from '@/lib/apolli-client';
import { ApolloProvider as _ApolloProvider } from '@apollo/client/react';

const client = createApolloClient();

export function ApolloProvider({ children }: { children: React.ReactNode }) {
    return <_ApolloProvider client={client}>{children}</_ApolloProvider>;
}
