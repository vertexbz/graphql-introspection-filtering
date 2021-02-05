import { TypeMetaFieldDef, __Schema, __Type } from 'graphql/type/introspection';
import enhanceListResolver from './tools/enhanceListResolver';
import enhanceRootResolver from './tools/enhanceRootResolver';
import schemaFilter from './tools/schemaFilter';

enhanceListResolver(TypeMetaFieldDef, schemaFilter('type'));
enhanceListResolver(__Schema.getFields().types, schemaFilter('type'));
enhanceListResolver(__Type.getFields().fields, schemaFilter('field'));
enhanceListResolver(__Schema.getFields().directives, schemaFilter('directive'));

// enhanceRootResolver(__Schema.getFields().queryType, 'Query');
enhanceRootResolver(__Schema.getFields().mutationType, 'Mutation');
enhanceRootResolver(__Schema.getFields().subscriptionType, 'Subscription');
