import { GraphQLScalarType, introspectionTypes } from 'graphql';

import FilteredSchema from '../symbol';
import type { SchemaFilterSig, FilterType } from '../types';

export default <TSource, TContext, TArgs = { [key: string]: any }>(filterType: FilterType): SchemaFilterSig<TSource, TContext, TArgs> =>
    async (field, root, args, context, info): Promise<boolean> => {
        if (field instanceof GraphQLScalarType || introspectionTypes.includes(field)) {
            return true;
        }

        const filters: SchemaFilterSig<TSource, TContext, TArgs>[]|undefined = (info.schema as any)[FilteredSchema][filterType];

        if (Array.isArray(filters)) {
            for (const filter of filters) {
                if (!await filter(field, root, args, context, info)) {
                    return false;
                }
            }
        }

        return true;
    };
