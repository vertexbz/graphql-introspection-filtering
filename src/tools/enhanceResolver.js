// @flow
import { defaultFieldResolver } from 'graphql';
import FilteredSchema from '../symbol';

import type { SchemaFilterSig, FieldType, ArgsType, InfoType } from '../types';

export default (subject: FieldType, filter: SchemaFilterSig) => {
    const originalResolver = subject.resolve  || defaultFieldResolver;

    subject.resolve = function(root: *, args: ArgsType, context: *, info: InfoType): * {
        const result = originalResolver(root, args, context, info);

        if (Object.prototype.hasOwnProperty.call(info.schema, FilteredSchema)) {
            if (Array.isArray(result)) {
                return result.reduce(<F, A: Array<F>>(acc: A, field: F): A => {
                    if (filter(field, root, args, context, info)) {
                        acc.push(field);
                    }

                    return acc;
                }, []);
            } else if (result && typeof result === 'object' && !filter(result, root, args, context, info)) {
                return null;
            }
        }

        return result;
    };
};
