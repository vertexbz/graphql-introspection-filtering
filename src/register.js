// @flow
import { TypeMetaFieldDef, __Schema, __Type } from 'graphql/type/introspection';
import enhanceResolver from './tools/enhanceResolver';
import schemaFilter from './tools/schemaFilter';

enhanceResolver(TypeMetaFieldDef, schemaFilter('type'));
enhanceResolver(__Schema.getFields().types, schemaFilter('type'));
enhanceResolver(__Type.getFields().fields, schemaFilter('field'));
enhanceResolver(__Schema.getFields().directives, schemaFilter('directive'));
