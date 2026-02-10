import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const createApolloClient = () => {
    return new ApolloClient({
        link: new HttpLink({
            uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
            credentials: 'include',
        }),
        cache: new InMemoryCache(),
        ssrMode: typeof window === 'undefined',
    });
};
