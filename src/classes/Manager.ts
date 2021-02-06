import {
    GraphQLDirective,
    GraphQLEnumType,
    GraphQLInputObjectType,
    GraphQLInterfaceType,
    GraphQLObjectType,
    GraphQLScalarType,
    GraphQLUnionType
} from 'graphql';
import hasOwn from '../tools/hasOwn';
import Hook from './Hook';

import type { DirectiveNode } from 'graphql/language/ast';
import type { VisitableSchemaType } from 'graphql-tools/dist/schemaVisitor';
import type {
    GraphQLEnumValue,
    GraphQLField,
    GraphQLInputField,
    GraphQLResolveInfo,
    GraphQLSchema } from 'graphql';
import type {
    ClassDirectiveConfig,
    DirectiveConfig,
    IntrospectionDirectiveVisitor,
    IntrospectionDirectiveVisitorCls,
    VisitableIntrospectionType,
    IntrospectionDirectiveVisitorStatic
} from '../types';

const ManagerSymbol = Symbol('Manager');
const HOOK = Symbol('HOOK');

export default class Manager {
    public static extract(schema: GraphQLSchema): Manager|undefined {
        if (hasOwn(schema, ManagerSymbol)) {
            return (schema as any)[ManagerSymbol];
        }

        return undefined;
    }

    public static inject(manager: Manager) {
        if (hasOwn(manager._schema, ManagerSymbol)) {
            throw new Error('Already injected!');
        }

        (manager._schema as any)[ManagerSymbol] = manager;
    }

    protected _directives: Record<string, IntrospectionDirectiveVisitorCls>;
    protected _schema: GraphQLSchema;

    public constructor(directives: Record<string, IntrospectionDirectiveVisitorCls>, schema: GraphQLSchema) {
        this._directives = directives;
        this._schema = schema;
    }

    public resolve<T extends VisitableIntrospectionType, TSource = any, TContext = any>(
        result: T, root: TSource, context: TContext, info: GraphQLResolveInfo
    ): Promise<T|null> | T|null {
        if (!hasOwn(result, HOOK)) {
            (result as any)[HOOK] = this.prepare(result, root as any);
        }
        if ((result as any)[HOOK] === false) {
            return result;
        }

        return (result as any)[HOOK].resolve(result, root, context, info);
    }

    // eslint-disable-next-line complexity
    protected expectedMethodFor(result: VisitableIntrospectionType, root: VisitableSchemaType): keyof IntrospectionDirectiveVisitor {
        switch (true) {
            case result instanceof GraphQLScalarType:
                return 'visitIntrospectionScalar';
            case result instanceof GraphQLDirective:
                return 'visitIntrospectionDirective';
            case result instanceof GraphQLInputObjectType:
                return 'visitIntrospectionInputObject';
            case result instanceof GraphQLEnumType:
                return 'visitIntrospectionEnum';
            case result instanceof GraphQLInterfaceType:
                return 'visitIntrospectionInterface';
            case result instanceof GraphQLUnionType:
                return 'visitIntrospectionUnion';
            case result instanceof GraphQLObjectType:
                return 'visitIntrospectionObject';
            case (result as GraphQLField<any, any>).astNode?.kind === 'FieldDefinition':
                return 'visitIntrospectionField';
            case (result as GraphQLEnumValue).astNode?.kind === 'EnumValueDefinition':
                return 'visitIntrospectionEnumValue';
            case (result as GraphQLInputField).astNode?.kind === 'InputValueDefinition':
                if (root instanceof GraphQLInputObjectType) {
                    return 'visitIntrospectionInputField';
                }
                return 'visitIntrospectionArgument';
            default:
                throw new Error('We shouldn\'t get here!');
        }
    }

    protected prepare(result: VisitableIntrospectionType, root: VisitableSchemaType) {
        if (result instanceof GraphQLDirective) {
            const method = this.expectedMethodFor(result, root);
            const parsedDirectives = Object.entries(this._directives)
                .map<ClassDirectiveConfig>(([name, cls]) => ({
                    name, args: {}, cls: cls as IntrospectionDirectiveVisitorStatic
                }))
                .filter(({ cls }) => {
                    return method && (method in cls.prototype);
                });

            if (parsedDirectives.length > 0) {
                return new Hook(parsedDirectives, method);
            }
        }

        const directives: ReadonlyArray<DirectiveNode> = (result as any)?.astNode?.directives || [];
        if (directives.length > 0) {
            const method = this.expectedMethodFor(result, root);

            const parsedDirectives = this.parseDirectiveAst(directives)
                .filter(({ name }) => Object.keys(this._directives).includes(name))
                .map<ClassDirectiveConfig>((config) => ({
                    ...config,
                    cls: this._directives[config.name] as IntrospectionDirectiveVisitorStatic
                }))
                .filter(({ cls }) => {
                    return method && (method in cls.prototype);
                });

            if (parsedDirectives.length > 0) {
                return new Hook(parsedDirectives, method);
            }
        }
        return false;
    }

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
