// @flow
import FilteredSchema from '../symbol';

import type { SchemaFilterSig, FilterType, ArgsType, InfoType } from '../types';

export default (filterType: FilterType): * => (field: *, root: *, args: ArgsType, context: *, info: InfoType): boolean => {
    const filters: Array<SchemaFilterSig> = (info.schema: any)[FilteredSchema][filterType];

    if (Array.isArray(filters)) {
        for (const filter of filters) {
            if (!filter(field, root, args, context, info)) {
                return false;
            }
        }
    }

    return true;
};
