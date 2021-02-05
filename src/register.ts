import { TypeMetaFieldDef, __Schema, __Type } from 'graphql/type/introspection';
import enhanceListResolver from './tools/enhanceListResolver';
import enhanceRootResolver from './tools/enhanceRootResolver';
import schemaFilter from './tools/schemaFilter';
import { __Field } from "graphql";

enhanceListResolver(TypeMetaFieldDef, schemaFilter('type'));
enhanceListResolver(__Schema.getFields().types, schemaFilter('type'));

enhanceListResolver(__Schema.getFields().directives, schemaFilter('directive'));
enhanceListResolver(__Type.getFields().fields, schemaFilter('field'));
enhanceListResolver(__Type.getFields().enumValues, schemaFilter('enumValues'));
enhanceListResolver(__Type.getFields().inputFields, schemaFilter('inputFields'));
enhanceListResolver(__Type.getFields().possibleTypes, schemaFilter('possibleTypes'));
enhanceListResolver(__Field.getFields().args, schemaFilter('args'));

// enhanceRootResolver(__Schema.getFields().queryType, 'Query');
enhanceRootResolver(__Schema.getFields().mutationType, 'Mutation');
enhanceRootResolver(__Schema.getFields().subscriptionType, 'Subscription');
