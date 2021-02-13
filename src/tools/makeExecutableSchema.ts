import { makeExecutableSchema } from 'graphql-tools';
import Manager from '../classes/Manager';
import { INTROSPECTION_VISITOR_METHODS, SCHEMA_MANAGER } from '../constants';
import hasOwn from './hasOwn';

import type { GraphQLSchema } from 'graphql';
import type { IExecutableSchemaDefinition, SchemaDirectiveVisitor } from 'graphql-tools';
import type { BuilderSig, IntrospectionDirectiveVisitorStatic } from '../types';

/**
 * Filter Introspection directive visitors from directive map
 *
 * @param directives introspection and regular directives map
 */
const filterIntrospectionDirectives = (directives: Record<string, IntrospectionDirectiveVisitorStatic | typeof SchemaDirectiveVisitor>) => {
    const filtered: Record<string, IntrospectionDirectiveVisitorStatic> = {};
    for (const [name, directive] of Object.entries(directives)) {
        if (INTROSPECTION_VISITOR_METHODS.some((method) => !!directive.prototype[method]))
            filtered[name] = directive as IntrospectionDirectiveVisitorStatic;
    }

    return filtered;
};

/**
 * Create graphql executable schema with injected Manager
 *
 * @param config schema configuration
 * @param builder original schema builder
 */
export default <TContext = any>(
    config: IExecutableSchemaDefinition<TContext>,
    builder: BuilderSig<TContext> = makeExecutableSchema
): GraphQLSchema => {
    const schema = builder(config);
    if (config.schemaDirectives) {
        const introspectionDirectives = filterIntrospectionDirectives(config.schemaDirectives);
        if (Object.keys(introspectionDirectives).length > 0) {
            if (hasOwn(schema, SCHEMA_MANAGER)) {
                throw new Error('Already injected!');
            }

            (schema as any)[SCHEMA_MANAGER] = new Manager(introspectionDirectives, schema);
        }
    }
    return schema;
};
