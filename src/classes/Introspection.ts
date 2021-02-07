import { __Schema, defaultFieldResolver, introspectionTypes } from 'graphql';
import Manager from './Manager';

import type { GraphQLResolveInfo , GraphQLField, GraphQLNamedType } from 'graphql';
import type { VisitableIntrospectionType } from '../types';

const HOOK = Symbol('HOOK');

export default
class Introspection {
    public static hook(subject: any) {
        if ((subject as any)[HOOK]) {
            return;
        }
        (subject as any)[HOOK] = true;

        subject.resolve = Introspection.resolve.bind(subject.resolve || defaultFieldResolver);
    }

    protected static async resolve<R, C, A>(root: R, args: A, context: C, info: GraphQLResolveInfo) {
        const result = (this as any)(root, args, context, info);
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

    protected static isExcluded(item: VisitableIntrospectionType) {
        if ((item as any)[HOOK]) {
            return true;
        }

        if (!item.astNode) {// todo rules out queryType, mutationType, and subscriptionType
            return true;
        }

        return introspectionTypes.includes(item);
    }

    public static hookRoot<S, TContext, TArgs = { [key: string]: any }>(subject: GraphQLField<S, TContext, TArgs>, typeName: string) {
        const originalResolver = subject.resolve || defaultFieldResolver;

        subject.resolve = async function(root: S, args: TArgs, context: TContext, info: GraphQLResolveInfo) {
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
}
