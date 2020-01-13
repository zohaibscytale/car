import { HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from "apollo-cache-inmemory";

import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      console.log('graphQLErrors', graphQLErrors);
    }
    if (networkError) {
      console.log('networkError', networkError);
    }
  });

const makeApolloClient = () => {
    // create an apollo link instance, a network interface for apollo client
    const httpLink = new HttpLink({
        uri: 'https://32hu5x5zy9.execute-api.us-east-1.amazonaws.com/dev/graphql'
    });
    const link = ApolloLink.from([errorLink, httpLink]);
    const cache = new InMemoryCache()   
    const client = new ApolloClient({
        link,
        cache,
    });
    return client;
}
export default makeApolloClient;