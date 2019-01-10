// @flow
import type { FiltersType, FilterType, SchemaFilterSig } from '../types';

export default (filters: FiltersType, type: FilterType, visitor: SchemaFilterSig) => {
    if (!(type in filters)) {
        filters[type] = [];
    }

    (filters[type]: any).push(visitor);
};
