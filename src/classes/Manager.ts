import {
    GraphQLDirective,
    GraphQLEnumType,
    GraphQLInputObjectType,
    GraphQLInterfaceType,
    GraphQLObjectType,
    GraphQLScalarType,
    GraphQLUnionType
} from 'graphql';
import { SCHEMA_HOOK, SCHEMA_MANAGER } from '../constants';
import hasOwn from '../tools/hasOwn';
import Hook from './Hook';

import type { DirectiveNode } from 'graphql/language/ast';
import type {
    GraphQLEnumValue,
    GraphQLField,
    GraphQLInputField,
    GraphQLResolveInfo,
    GraphQLSchema
} from 'graphql';
import type {
    ClassDirectiveConfig,
    DirectiveConfig,
    IntrospectionDirectiveVisitor,
    VisitableIntrospectionType,
    IntrospectionDirectiveVisitorStatic,
    VisitableSchemaType
} from '../types';

/**
 * Introspection schema hooks manager
 */
export default class Manager {
    /**
     * Extract Manager from schema
     *
     * @param schema graphql executable schema
     */
    public static extract(schema: GraphQLSchema): Manager | undefined {
        if (hasOwn(schema, SCHEMA_MANAGER)) {
            return (schema as any)[SCHEMA_MANAGER];
        }

        return undefined;
    }

    protected _directives: Record<string, IntrospectionDirectiveVisitorStatic>;
    protected _schema: GraphQLSchema;

    /**
     * Manager constructor
     * @param directives introspection directive visitors map
     * @param schema graphql schema want to visit
     */
    public constructor(directives: Record<string, IntrospectionDirectiveVisitorStatic>, schema: GraphQLSchema) {
        this._directives = directives;
        this._schema = schema;
    }

    /**
     * Enhanced schema resolver
     *
     * @param subject resolved field/type
     * @param root subject's root
     * @param context current graphql context
     * @param info graphql resolve info
     */
    public resolve<T extends VisitableIntrospectionType, R extends VisitableSchemaType = any, C = any>(
        subject: T, root: R, context: C, info: GraphQLResolveInfo
    ): Promise<T|null> | T|null {
        if (!hasOwn(subject, SCHEMA_HOOK)) {
            (subject as any)[SCHEMA_HOOK] = this.prepare(subject, root);
        }
        if ((subject as any)[SCHEMA_HOOK] === false) {
            return subject;
        }

        return (subject as any)[SCHEMA_HOOK].resolve(subject, root, context, info);
    }

    /**
     * It may be useful to occasionally not hook the introspection query
     * For example to hash it by apollo, which requires sync resolution
     * It's always the first introspection query made o the instance
     */
    public shouldHookQuery() {
        return true;
    }

    /**
     * Resolve visitor method for subject
     *
     * @param subject type/field for which we want to get visitor method name
     * @param root subject's root
     * @protected
     */
    // eslint-disable-next-line complexity
    protected expectedMethodFor(subject: VisitableIntrospectionType, root: VisitableSchemaType): keyof IntrospectionDirectiveVisitor {
        switch (true) {
            case subject instanceof GraphQLScalarType:
                return 'visitIntrospectionScalar';
            case subject instanceof GraphQLDirective:
                return 'visitIntrospectionDirective';
            case subject instanceof GraphQLInputObjectType:
                return 'visitIntrospectionInputObject';
            case subject instanceof GraphQLEnumType:
                return 'visitIntrospectionEnum';
            case subject instanceof GraphQLInterfaceType:
                return 'visitIntrospectionInterface';
            case subject instanceof GraphQLUnionType:
                return 'visitIntrospectionUnion';
            case subject instanceof GraphQLObjectType:
                return 'visitIntrospectionObject';
            case (subject as GraphQLField<any, any>).astNode?.kind === 'FieldDefinition':
                return 'visitIntrospectionField';
            case (subject as GraphQLEnumValue).astNode?.kind === 'EnumValueDefinition':
                return 'visitIntrospectionEnumValue';
            case (subject as GraphQLInputField).astNode?.kind === 'InputValueDefinition':
                if (root instanceof GraphQLInputObjectType) {
                    return 'visitIntrospectionInputField';
                }
                return 'visitIntrospectionArgument';
            default:
                throw new Error('Visited unknown object!');
        }
    }

    protected prepareDirectives(subject: VisitableIntrospectionType) {
        if (subject instanceof GraphQLDirective) {
            return Object.entries(this._directives)
                .map<ClassDirectiveConfig>(([name, cls]) => ({
                    name, args: {}, cls: cls as IntrospectionDirectiveVisitorStatic
                }));
        }

        const directives: ReadonlyArray<DirectiveNode> = (subject.astNode as any)?.directives || [];
        if (directives.length > 0) {
            return this.parseDirectiveAst(directives)
                .filter(({ name }) => Object.keys(this._directives).includes(name))
                .map<ClassDirectiveConfig>((config) => ({
                    ...config,
                    cls: this._directives[config.name] as IntrospectionDirectiveVisitorStatic
                }));

        }

        return [];
    }

    /**
     * Prepare Hook for given class
     *
     * @param subject type/field that we are creating the Hook for
     * @param root subject's root
     * @protected
     */
    protected prepare(subject: VisitableIntrospectionType, root: VisitableSchemaType) {
        const parsedDirectives = this.prepareDirectives(subject);
        if (parsedDirectives.length > 0) {
            const method = this.expectedMethodFor(subject, root);

            const filteredDirectives = parsedDirectives
                .filter(({ cls }) => {
                    return method && (method in cls.prototype);
                });

            if (filteredDirectives.length > 0) {
                return new Hook(filteredDirectives, method);
            }
        }

        return false;
    }

    /**
     * Grabs directive name and arguments from AST
     *
     * @param directives array of AST definitions for directives applied to type/field
     * @protected
     */
    protected parseDirectiveAst(directives: ReadonlyArray<DirectiveNode>): DirectiveConfig[] {
        return directives
            .map(({ name: { value: name }, arguments: args = [] }) => {
                return {
                    name,
                    args: args.reduce((args: Record<string, any>, { name: { value: name }, value }) => {
                        args[name] = (value as any).value || null;
                        return args;
                    }, {})
                };
            });
    }
}
