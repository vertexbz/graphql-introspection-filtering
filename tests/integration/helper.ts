import * as graphql from 'graphql';

export const introspectionQuery = (graphql as any).introspectionQuery || (graphql as any).getIntrospectionQuery();
