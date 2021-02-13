import { defaultFieldResolver, introspectionTypes } from 'graphql';
import { INTROSPECTION_HOOK } from '../constants';
import chainArray from '../tools/chainArray';
import chain from '../tools/chain';
import Manager from './Manager';

import type { GraphQLResolveInfo } from 'graphql';
import type { VisitableIntrospectionType, VisitableSchemaType } from '../types';

export default class Introspection {
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
    protected static resolve<R extends VisitableSchemaType, C, A>(
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
                const resolved = chainArray(subject, (item) => {
                    if (Introspection.isExcluded(item)) {
                        return item;
                    }

                    return manager.resolve(item, root, context, info);
                });

                return chain(resolved, (items) => items.filter(Boolean));
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
