"use client"
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: 'http://localhost:8080/graphql',
});

const authLink = setContext((_, { headers }) => {
    // Get the authentication token from local storage if it exists
    const token = localStorage.getItem('auth-token');
    // Return the headers to the context so httpLink can read them

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${JSON.parse(token)}` : "",
        }
    }
});
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})

export default function ApolloWrapper({ children }) {
    return <ApolloProvider client={client}>{children}</ApolloProvider>
}
