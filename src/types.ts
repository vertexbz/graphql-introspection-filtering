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

/**
 * Copy of VisitableSchemaType from graphql-tools for compatibility
 * Usually represents root of visited introspection type/filed/directive
 */
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

/**
 * Represents visited introspection type/filed/directive
 */
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

/**
 * Introspection visitor result template
 * Internal helper type
 */
export type VisitorResult<T> = Promise<T | null> | T | null;

/**
 * Visitor method template
 */
export type IntrospectionVisitor<T> = (result: T, info: GraphQLResolveInfo) => VisitorResult<T>;

/**
 * Introspection visitor interface, extends SchemaDirectiveVisitor
 * is instantiated per field/type and context combination
 */
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

/**
 * IntrospectionDirectiveVisitor's static interface
 */
export interface IntrospectionDirectiveVisitorStatic {
    /**
     * IntrospectionDirectiveVisitor constructor
     * (derived from SchemaDirectiveVisitor)
     * @param config
     */
    new(config: {
        name: string;
        args: Record<string, any>;
        visitedType: VisitableSchemaType;
        schema: GraphQLSchema;
        context: Record<string, any>;
    }): IntrospectionDirectiveVisitor;
}

/**
 * Parsed directive entry form schema AST
 * Internal helper type
 */
export interface DirectiveConfig {
    /**
     * Directive name
     */
    name: string;
    /**
     * Directive arguments
     * (unavailable for directive visitor!)
     */
    args: Record<string, any>;
}

/**
 * Parsed directive entry form schema AST with resolved class
 * Internal helper type
 */
export interface ClassDirectiveConfig extends DirectiveConfig {
    /**
     * Introspection schema visitor class constructor
     * (matched by name)
     */
    cls: IntrospectionDirectiveVisitorStatic;
}

/**
 * Decides whether query should be hooked
 */
export type ShouldSkipQueryPredicate<TContext = any> = (context: TContext) => boolean;

/**
 * Executable schema definition (config) with introspection Manager config
 */
export interface ExecutableSchemaDefinition<TContext = any> extends IExecutableSchemaDefinition<TContext> {
    /**
     * Skip query predicate or counter
     */
    shouldSkipQuery?: null | undefined | number | ShouldSkipQueryPredicate<TContext>
}

/**
 * makeExecutableSchema executable schema builder signature
 * Internal helper type
 */
export type BuilderSig<TContext = any> = (config: IExecutableSchemaDefinition<TContext>) => GraphQLSchema;
