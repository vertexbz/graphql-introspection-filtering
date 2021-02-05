import type { SchemaDirectiveVisitor } from 'graphql-tools';

import type { GraphQLField, GraphQLObjectType } from 'graphql';
import type { GraphQLResolveInfo } from 'graphql/type/definition';

export type SchemaFilterSig<TSource, TContext, TArgs = { [key: string]: any }> = (
    field: GraphQLField<TSource, TContext, TArgs> | GraphQLObjectType,
    root: TSource,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
) => Promise<boolean> | boolean

export type FilterType = 'field' | 'type' | 'directive';

export type FiltersType<TSource, TContext, TArgs = { [key: string]: any }> = {
    field?: Array<SchemaFilterSig<TSource, TContext, TArgs>>,
    type?: Array<SchemaFilterSig<TSource, TContext, TArgs>>,
    directive?: Array<SchemaFilterSig<TSource, TContext, TArgs>>
};

export class SchemaFilterDirective {
    public static visitTypeIntrospection: SchemaFilterSig<any, any>|undefined;
    public static visitFieldIntrospection: SchemaFilterSig<any, any>|undefined;
    public static visitDirectiveIntrospection: SchemaFilterSig<any, any>|undefined;
}

export type SchemaFilterAndVisitorDirectives = Record<any, SchemaFilterDirective | SchemaDirectiveVisitor>;
