import appendVisitor from './appendVisitor';

import type { SchemaFilterAndVisitorDirectives, FiltersType } from '../types';

export default <TSource, TContext, TArgs = { [key: string]: any }>(
    schemaDirectives: SchemaFilterAndVisitorDirectives
): FiltersType<TSource, TContext, TArgs> => {
    const result = {};

    for (const visitor of (Object.values(schemaDirectives) as any[])) {
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
