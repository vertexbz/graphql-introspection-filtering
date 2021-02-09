import { __Schema, defaultFieldResolver, introspectionTypes } from 'graphql';
import { INTROSPECTION_HOOK } from '../constants';
import Manager from './Manager';

import type { GraphQLField, GraphQLNamedType, GraphQLResolveInfo } from 'graphql';
import type { VisitableIntrospectionType, VisitableSchemaType } from '../types';

export default class Introspection {
    /**
     * Hook root type mapping to nullify reference when Mutation or Subscription types are empty
     * (all fields are filtered out)
     *
     * @param subject schema root field to hook
     * @param typeName designated root type for field
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
     * @param subject introspection field
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
     * @param root fields root type
     * @param args introspection arguments
     * @param context current graphql context
     * @param info graphql resolve info
     * @protected
     */
    protected static async resolve<R extends VisitableSchemaType, C, A>(
        this: typeof defaultFieldResolver,
        root: R,
        args: A,
        context: C,
        info: GraphQLResolveInfo
    ) {
        const subject = this(root, args, context, info);
        if (!subject || !(typeof subject === 'object')) {
            return subject;
        }

        const manager = Manager.extract(info.schema);

        if (manager) {
            if (Array.isArray(subject)) {
                const items = [];
                for (const item of subject) {
                    if (Introspection.isExcluded(item)) {
                        items.push(item);
                    } else {
                        items.push(await manager.resolve(item, root, context, info));
                    }
                }

                return items.filter(Boolean);
            } else if (!Introspection.isExcluded(subject)) {
                return manager.resolve(subject, root, context, info);
            }
        }

        return subject;
    }

    /**
     * Exclude hooked and fundamental types
     *
     * @param subject type/field to check
     * @protected
     */
    protected static isExcluded(subject: VisitableIntrospectionType) {
        // exclude already hooked
        if ((subject as any)[INTROSPECTION_HOOK]) {
            return true;
        }

        // exclude nodes without ast (builtins)
        if (!subject.astNode) {
            return true;
        }

        // exclude rest of fundamental introspection types
        return introspectionTypes.includes(subject as any);
    }
}
