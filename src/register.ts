import { TypeMetaFieldDef, __Schema, __Type, __Field } from 'graphql/type/introspection';
import Introspection from './classes/Introspection';

Introspection.hook(TypeMetaFieldDef);

Introspection.hook(__Schema.getFields().types);
Introspection.hook(__Schema.getFields().directives);

Introspection.hook(__Type.getFields().fields);
Introspection.hook(__Type.getFields().enumValues);
Introspection.hook(__Type.getFields().inputFields);
Introspection.hook(__Type.getFields().possibleTypes);

Introspection.hook(__Field.getFields().args);

Introspection.hookRoot(__Schema.getFields().mutationType, 'Mutation');
Introspection.hookRoot(__Schema.getFields().subscriptionType, 'Subscription');
