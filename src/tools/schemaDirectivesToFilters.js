// @flow
import appendVisitor from './appendVisitor';

import type { SchemaDirectiveVisitorsType, FiltersType, FilteringSchemaDirectiveVisitorInterface } from '../types';

export default (schemaDirectives: SchemaDirectiveVisitorsType): FiltersType => {
    const result = {};

    for (const visitor of ((Object.values(schemaDirectives): any): Array<FilteringSchemaDirectiveVisitorInterface>)) {
        if (typeof visitor.visitTypeIntrospection === 'function') {
            appendVisitor(result, 'type', visitor.visitTypeIntrospection.bind(visitor));
        }
        if (typeof visitor.visitFieldIntrospection === 'function') {
            appendVisitor(result, 'field', visitor.visitFieldIntrospection.bind(visitor));
        }
        if (typeof visitor.visitDirectiveIntrospection === 'function') {
            appendVisitor(result, 'directive', visitor.visitDirectiveIntrospection.bind(visitor));
        }
    }

    return result;
};
