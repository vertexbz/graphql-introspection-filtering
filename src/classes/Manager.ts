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

export default class Manager {
    public static extract(schema: GraphQLSchema): Manager|undefined {
        if (hasOwn(schema, SCHEMA_MANAGER)) {
            return (schema as any)[SCHEMA_MANAGER];
        }

        return undefined;
    }

    public static inject(manager: Manager) {
        if (hasOwn(manager._schema, SCHEMA_MANAGER)) {
            throw new Error('Already injected!');
        }

        (manager._schema as any)[SCHEMA_MANAGER] = manager;
    }

    protected _directives: Record<string, IntrospectionDirectiveVisitorStatic>;
    protected _schema: GraphQLSchema;

    public constructor(directives: Record<string, IntrospectionDirectiveVisitorStatic>, schema: GraphQLSchema) {
        this._directives = directives;
        this._schema = schema;
    }

    public resolve<T extends VisitableIntrospectionType, R extends VisitableSchemaType = any, C = any>(
        result: T, root: R, context: C, info: GraphQLResolveInfo
    ): Promise<T|null> | T|null {
        if (!hasOwn(result, SCHEMA_HOOK)) {
            (result as any)[SCHEMA_HOOK] = this.prepare(result, root);
        }
        if ((result as any)[SCHEMA_HOOK] === false) {
            return result;
        }

        return (result as any)[SCHEMA_HOOK].resolve(result, root, context, info);
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
                throw new Error('Visited unknown object!');
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

        const directives: ReadonlyArray<DirectiveNode> = (result.astNode as any)?.directives || [];
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
