import type { IntrospectionDirectiveVisitor } from './types';

export const INTROSPECTION_VISITOR_METHODS: (keyof IntrospectionDirectiveVisitor)[] = [
    'visitIntrospectionScalar',
    'visitIntrospectionObject',
    'visitIntrospectionInputField',
    'visitIntrospectionField',
    'visitIntrospectionEnum',
    'visitIntrospectionInterface',
    'visitIntrospectionUnion',
    'visitIntrospectionEnumValue',
    'visitIntrospectionArgument',
    'visitIntrospectionInputObject',
    'visitIntrospectionDirective'
];

export const INTROSPECTION_HOOK = Symbol('INTROSPECTION_HOOK');

export const SCHEMA_MANAGER = Symbol('SCHEMA_HOOK');

export const SCHEMA_HOOK = Symbol('SCHEMA_HOOK');

export const SHOULD_HOOK_QUERY = Symbol('SHOULD_HOOK_QUERY');
