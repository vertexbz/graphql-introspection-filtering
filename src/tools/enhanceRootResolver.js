// @flow
import { __Schema } from 'graphql/type/introspection';
import FilteredSchema from '../symbol';
import type { FieldType, ArgsType, InfoType } from '../types';
import type { GraphQLSchema } from 'graphql/type/schema';
import type { GraphQLNamedType } from 'graphql/type/definition';

export default (subject: FieldType, typeName: string) => {
    const originalResolver = subject.resolve;

    subject.resolve = function(root: GraphQLSchema, args: ArgsType, context: *, info: InfoType): * {
        const resolver = originalResolver(root, args, context, info);

        if (Object.prototype.hasOwnProperty.call(info.schema, FilteredSchema)) {
            const types = __Schema.getFields().types.resolve(root, args, context, info);

            if (!types.some((field: GraphQLNamedType) => field.name === typeName)) {
                return null;
            }
        }

        return resolver;
    };

};
