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

export type FilterType = 'field' | 'type' | 'directive' | 'args' | 'enumValues' | 'inputFields' | 'possibleTypes';

export type FiltersType<TSource, TContext, TArgs = { [key: string]: any }> = Record<FilterType, SchemaFilterSig<TSource, TContext, TArgs>[]>;

export class SchemaFilterDirective {
    public static visitTypeIntrospection: SchemaFilterSig<any, any>|undefined;
    public static visitFieldIntrospection: SchemaFilterSig<any, any>|undefined;
    public static visitDirectiveIntrospection: SchemaFilterSig<any, any>|undefined;
    public static visitArgsIntrospection: SchemaFilterSig<any, any>|undefined;
    public static visitEnumValuesIntrospection: SchemaFilterSig<any, any>|undefined;
    public static visitInputFieldsIntrospection: SchemaFilterSig<any, any>|undefined;
    public static visitPossibleTypesIntrospection: SchemaFilterSig<any, any>|undefined;
}

export type SchemaFilterAndVisitorDirectives = Record<any, SchemaFilterDirective | SchemaDirectiveVisitor>;
