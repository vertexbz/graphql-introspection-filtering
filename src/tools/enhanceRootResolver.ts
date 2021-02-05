import { __Schema } from 'graphql/type/introspection';
import { defaultFieldResolver } from 'graphql';
import FilteredSchema from '../symbol';
import type { GraphQLField } from 'graphql';
import type { GraphQLNamedType, GraphQLResolveInfo } from 'graphql/type/definition';

export default <TSource, TContext, TArgs = { [key: string]: any }>(subject: GraphQLField<TSource, TContext, TArgs>, typeName: string) => {
    const originalResolver = subject.resolve || defaultFieldResolver;

    subject.resolve = async function(root: TSource, args: TArgs, context: TContext, info: GraphQLResolveInfo) {
        const resolver = await originalResolver(root, args, context, info);

        if (Object.prototype.hasOwnProperty.call(info.schema, FilteredSchema)) {
            const typesResolver = __Schema.getFields().types?.resolve;
            const types = typesResolver && await typesResolver(root, args, context, info);

            if (types && !types.some((field: GraphQLNamedType) => field.name === typeName)) {
                return null;
            }
        }

        return resolver;
    };

};
