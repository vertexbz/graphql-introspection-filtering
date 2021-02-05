import { makeExecutableSchema } from 'graphql-tools';
import FilteredSchema from '../symbol';

import schemaDirectivesToFilters from './schemaDirectivesToFilters';

import type { GraphQLSchema } from 'graphql';
import type { IExecutableSchemaDefinition } from 'graphql-tools';

export type BuilderSig<TContext = any> = (config: IExecutableSchemaDefinition<TContext>) => GraphQLSchema;

export default <TContext = any>(
    config: IExecutableSchemaDefinition<TContext>,
    builder: BuilderSig<TContext> = makeExecutableSchema
): GraphQLSchema => {
    const schema = builder(config);
    (schema as any)[FilteredSchema] = schemaDirectivesToFilters(config.schemaDirectives || ({} as any));
    return schema;
};
