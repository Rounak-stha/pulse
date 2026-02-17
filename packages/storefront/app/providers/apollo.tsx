'use client';

import { HttpLink } from '@apollo/client';
import {
    ApolloClient,
    ApolloNextAppProvider,
    InMemoryCache,
} from '@apollo/client-integration-nextjs';

function makeClient() {
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
            credentials: 'include',
        }),
    });
}

export function ApolloProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
