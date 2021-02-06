import type {
    GraphQLArgument,
    GraphQLDirective,
    GraphQLEnumType,
    GraphQLEnumValue,
    GraphQLField,
    GraphQLInputField,
    GraphQLInputObjectType,
    GraphQLInterfaceType,
    GraphQLObjectType,
    GraphQLResolveInfo,
    GraphQLScalarType,
    GraphQLSchema,
    GraphQLUnionType
} from 'graphql';
import type { SchemaDirectiveVisitor, VisitableSchemaType } from 'graphql-tools/dist/schemaVisitor';

export type VisitableIntrospectionType = GraphQLScalarType
    | GraphQLObjectType
    | GraphQLInputField
    | GraphQLField<any, any>
    | GraphQLEnumType
    | GraphQLInterfaceType
    | GraphQLUnionType
    | GraphQLEnumValue
    | GraphQLArgument
    | GraphQLInputObjectType
    | GraphQLDirective;

export type IntrospectionVisitor<T> = (result: T, info: GraphQLResolveInfo) =>  Promise<T|null> | T|null;

export interface IntrospectionDirectiveVisitor extends SchemaDirectiveVisitor {
    visitIntrospectionScalar?: IntrospectionVisitor<GraphQLScalarType>;
    visitIntrospectionObject?: IntrospectionVisitor<GraphQLObjectType>;
    visitIntrospectionInputField?: IntrospectionVisitor<GraphQLInputField>;
    visitIntrospectionField?: IntrospectionVisitor<GraphQLField<any, any>>;
    visitIntrospectionEnum?: IntrospectionVisitor<GraphQLEnumType>;
    visitIntrospectionInterface?: IntrospectionVisitor<GraphQLInterfaceType>;
    visitIntrospectionUnion?: IntrospectionVisitor<GraphQLUnionType>;
    visitIntrospectionEnumValue?: IntrospectionVisitor<GraphQLEnumValue>;
    visitIntrospectionArgument?: IntrospectionVisitor<GraphQLArgument>;
    visitIntrospectionInputObject?: IntrospectionVisitor<GraphQLInputObjectType>;
    visitIntrospectionDirective?: IntrospectionVisitor<GraphQLDirective>;
}

export interface IntrospectionDirectiveVisitorStatic {
    new(config: {
        name: string;
        args: {
            [name: string]: any;
        };
        visitedType: VisitableSchemaType;
        schema: GraphQLSchema;
        context: {
            [key: string]: any;
        };
    }): IntrospectionDirectiveVisitor;
}

export interface IntrospectionDirectiveVisitorCls {
    new(config: {
        name: string;
        args: {
            [name: string]: any;
        };
        visitedType: VisitableSchemaType;
        schema: GraphQLSchema;
        context: {
            [key: string]: any;
        };
    }): IntrospectionDirectiveVisitor|typeof SchemaDirectiveVisitor;
}

export interface DirectiveConfig {
    name: string;
    args: Record<string, any>;
}

export interface ClassDirectiveConfig extends DirectiveConfig {
    cls: IntrospectionDirectiveVisitorStatic;
}
