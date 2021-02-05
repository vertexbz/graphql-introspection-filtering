import type { FiltersType, FilterType, SchemaFilterSig } from '../types';

export default <TSource, TContext, TArgs = { [key: string]: any }>(
    filters: FiltersType<TSource, TContext, TArgs>,
    type: FilterType,
    visitor: SchemaFilterSig<TSource, TContext, TArgs>
) => {
    if (!(type in filters) || !Array.isArray(filters[type])) {
        filters[type] = [];
    }

    (filters[type] as SchemaFilterSig<TSource, TContext, TArgs>[]).push(visitor);
};
