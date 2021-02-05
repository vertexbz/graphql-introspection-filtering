import type { GraphQLField, GraphQLResolveInfo } from 'graphql';
import { defaultFieldResolver } from 'graphql';
import FilteredSchema from '../symbol';

import type { SchemaFilterSig } from '../types';

export default <TSource, TContext, TArgs = { [key: string]: any }>(
    subject: GraphQLField<TSource, TContext, TArgs>,
    filter: SchemaFilterSig<TSource, TContext, TArgs>
) => {
    const originalResolver = subject.resolve || defaultFieldResolver;

    subject.resolve = async function(root: TSource, args: TArgs, context: TContext, info: GraphQLResolveInfo) {
        const result = await originalResolver(root, args, context, info);

        if (Object.prototype.hasOwnProperty.call(info.schema, FilteredSchema)) {
            if (Array.isArray(result)) {
                const fields = [];
                for (const field of result) {
                    if (await filter(field, root, args, context, info)) {
                        fields.push(field);
                    }
                }

                return fields;
            } else if (result && typeof result === 'object' && !await filter(result, root, args, context, info)) {
                return null;
            }
        }

        return result;
    };
};
