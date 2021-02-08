import type { GraphQLField, GraphQLNamedType, GraphQLResolveInfo } from 'graphql';
import { __Schema, defaultFieldResolver, introspectionTypes } from 'graphql';
import { INTROSPECTION_HOOK } from '../constants';
import Manager from './Manager';

import type { VisitableSchemaType } from 'graphql-tools/dist/schemaVisitor';
import type { VisitableIntrospectionType } from '../types';

export default class Introspection {
    /**
     * Hook root type mapping to nullify reference when Mutation or Subscription types are empty
     * (all fields are filtered out)
     *
     * @param subject
     * @param typeName
     */
    public static hookRoot<R, C, A = Record<string, any>>(subject: GraphQLField<R, C, A>, typeName: string) {
        const originalResolver = subject.resolve || defaultFieldResolver;

        subject.resolve = async function (root: R, args: A, context: C, info: GraphQLResolveInfo) {
            const resolver = await originalResolver(root, args, context, info);
            const manager = Manager.extract(info.schema);
            if (manager) {
                const typesResolver = __Schema.getFields().types?.resolve;
                const types = typesResolver && await typesResolver(root, args, context, info);

                if (types && !types.some((field: GraphQLNamedType) => field.name === typeName)) {
                    return null;
                }
            }

            return resolver;
        };

    }

    /**
     * Hook Introspection schema resolver
     *
     * @param subject
     */
    public static hook(subject: any) {
        if ((subject as any)[INTROSPECTION_HOOK]) {
            return;
        }
        (subject as any)[INTROSPECTION_HOOK] = true;

        subject.resolve = Introspection.resolve.bind(subject.resolve || defaultFieldResolver);
    }

    /**
     * Hooked introspection object/field/arg... resolver
     *
     * @param root
     * @param args
     * @param context
     * @param info
     * @protected
     */
    protected static async resolve<R extends VisitableSchemaType, C, A>(
        this: typeof defaultFieldResolver,
        root: R,
        args: A,
        context: C,
        info: GraphQLResolveInfo
    ) {
        const result = this(root, args, context, info);
        if (!result || !(typeof result === 'object')) {
            return result;
        }

        const manager = Manager.extract(info.schema);

        if (manager) {
            if (Array.isArray(result)) {
                const items = [];
                for (const item of result) {
                    if (Introspection.isExcluded(item)) {
                        items.push(item);
                    } else {
                        items.push(await manager.resolve(item, root, context, info));
                    }
                }

                return items.filter(Boolean);
            } else if (!Introspection.isExcluded(result)) {
                return manager.resolve(result, root, context, info);
            }
        }

        return result;
    }

    /**
     * Exclude hooked and fundamental types
     *
     * @param item
     * @protected
     */
    protected static isExcluded(item: VisitableIntrospectionType) {
        // exclude already hooked
        if ((item as any)[INTROSPECTION_HOOK]) {
            return true;
        }

        // exclude nodes without ast (builtins)
        if (!item.astNode) {
            return true;
        }

        // exclude rest of fundamental introspection types
        return introspectionTypes.includes(item);
    }
}
