// @flow
import FilteredSchema from '../symbol';

import type { GraphQLSchema } from 'graphql';
import type { FiltersType } from '../types';

export default <S: GraphQLSchema>(schema: S, filters: FiltersType): S => {
    (schema: any)[FilteredSchema] = filters;
    return schema;
};
