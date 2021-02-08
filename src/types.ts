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
    GraphQLUnionType,
    GraphQLNamedType
} from 'graphql';
import type { SchemaDirectiveVisitor, IExecutableSchemaDefinition } from 'graphql-tools';

export type VisitableSchemaType = GraphQLSchema
    | GraphQLObjectType
    | GraphQLInterfaceType
    | GraphQLInputObjectType
    | GraphQLNamedType
    | GraphQLScalarType
    | GraphQLField<any, any>
    | GraphQLArgument
    | GraphQLUnionType
    | GraphQLEnumType
    | GraphQLEnumValue
    | GraphQLInputField;

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

export type VisitorResult<T> = Promise<T | null> | T | null;
export type IntrospectionVisitor<T> = (result: T, info: GraphQLResolveInfo) => VisitorResult<T>;

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
        args: Record<string, any>;
        visitedType: VisitableSchemaType;
        schema: GraphQLSchema;
        context: Record<string, any>;
    }): IntrospectionDirectiveVisitor;
}

export interface DirectiveConfig {
    name: string;
    args: Record<string, any>;
}

export interface ClassDirectiveConfig extends DirectiveConfig {
    cls: IntrospectionDirectiveVisitorStatic;
}

export type BuilderSig<TContext = any> = (config: IExecutableSchemaDefinition<TContext>) => GraphQLSchema;
