import { graphql, introspectionQuery, } from "graphql";
import makeFilteredSchema from "../../src";
import createAuthDirective from "./__mocks__/createAuthDirective";
import typeDefs from "./__mocks__/schema";

test('integration', async () => {
    const testUser = { name: 'Test user 1', role: 'USER' };

    const schema = makeFilteredSchema({
        typeDefs,
        resolvers: {
            Query: {
                me: () => testUser
            },
            Public: {
                __resolveType: () => 'Empty'
            },
            Private: {
                __resolveType: () => 'Empty'
            },
            IPublic: {
                __resolveType: () => 'OPublic'
            },
            IPrivate: {
                __resolveType: () => 'OPrivate'
            },
            IEmpty: {
                __resolveType: () => 'OPrivate'
            }
        },
        schemaDirectives: {
            auth: createAuthDirective(['GUEST', 'USER'])
        }
    });

    const introspectionResult = await graphql(schema, introspectionQuery);
    expect(introspectionResult.data).toMatchSnapshot();
    expect(JSON.stringify(introspectionResult.data)).not.toMatch(/private/i);

    // test simple query
    const queryResult = await graphql(schema, '{ me { name role } }')
    expect(queryResult?.data?.me).toEqual(testUser);
});

