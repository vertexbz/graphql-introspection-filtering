import { makeExecutableSchema } from 'graphql-tools';
import Manager from '../classes/Manager';

import type { GraphQLSchema } from 'graphql';
import type { IExecutableSchemaDefinition } from 'graphql-tools';
import type { SchemaDirectiveVisitor } from 'graphql-tools/dist/schemaVisitor';
import type { IntrospectionDirectiveVisitorCls } from '../types';

export type BuilderSig<TContext = any> = (config: IExecutableSchemaDefinition<TContext>) => GraphQLSchema;

const INTROSPECTION_VISITOR_METHODS = [
    'visitIntrospectionScalar',
    'visitIntrospectionObject',
    'visitIntrospectionInputField',
    'visitIntrospectionField',
    'visitIntrospectionEnum',
    'visitIntrospectionInterface',
    'visitIntrospectionUnion',
    'visitIntrospectionEnumValue',
    'visitIntrospectionArgument',
    'visitIntrospectionInputObject',
    'visitIntrospectionDirective'
];

const filterIntrospectionDirectives = (directives: Record<string, typeof SchemaDirectiveVisitor>) => {
    const filtered: Record<string, IntrospectionDirectiveVisitorCls> = {};
    for (const [name, directive] of Object.entries(directives)) {
        if (INTROSPECTION_VISITOR_METHODS.some((method) => !!(directive.prototype as any)[method]))
            filtered[name] = directive as any as IntrospectionDirectiveVisitorCls;
    }

    return filtered;
};

export default <TContext = any>(
    config: IExecutableSchemaDefinition<TContext>,
    builder: BuilderSig<TContext> = makeExecutableSchema
): GraphQLSchema => {
    const schema = builder(config);
    if (config.schemaDirectives) {
        Manager.inject(new Manager(filterIntrospectionDirectives(config.schemaDirectives), schema));
    }
    return schema;
};
