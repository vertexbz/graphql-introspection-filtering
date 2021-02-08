import * as graphql from 'graphql';

export const introspectionQuery: string = (graphql as any).introspectionQuery || (graphql as any).getIntrospectionQuery();
