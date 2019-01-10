// @flow
import { SchemaDirectiveVisitor } from 'graphql-tools';

import type { GraphQLResolveInfo, GraphQLField } from 'graphql/type/definition';

export type FieldType = GraphQLField<*, *>;

export type InfoType = GraphQLResolveInfo;

export type ArgsType = { [argument: string]: any };

export type SchemaFilterSig = (field: *, root: *, args: ArgsType, context: *, info: InfoType) => boolean;

export type FilterType = 'field' | 'type' | 'directive';

export type FiltersType = {
    field?: Array<SchemaFilterSig>,
    type?: Array<SchemaFilterSig>,
    directive?: Array<SchemaFilterSig>
};

declare class FilteringSchemaDirectiveVisitor {
    static visitTypeIntrospection?: SchemaFilterSig,
    static visitFieldIntrospection?: SchemaFilterSig,
    static visitDirectiveIntrospection?: SchemaFilterSig
}

export type FilteringSchemaDirectiveVisitorInterface = Class<FilteringSchemaDirectiveVisitor>;

export type SchemaDirectiveVisitorsType = {
    [name: string]: FilteringSchemaDirectiveVisitorInterface | SchemaDirectiveVisitor
};
