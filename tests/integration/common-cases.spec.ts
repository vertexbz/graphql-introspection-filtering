import { graphql, introspectionQuery, } from "graphql";
import createSchema from "./__mocks__/schemas/common-cases";

describe('Common cases',  () => {
    test('Guest', async () => {
        const testUser = { name: 'Guest', roleProtected: 'GUEST' };

        const schema = createSchema(testUser, ['GUEST']);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();
        expect(JSON.stringify(introspectionResult.data)).not.toMatch(/private/i);
        expect(JSON.stringify(introspectionResult.data)).not.toMatch(/protected/i);
        expect(introspectionResult.data).toMatchSnapshot();

        // test simple query
        const queryResult = await graphql(schema, '{ me { name roleProtected } }')
        expect(queryResult?.data?.me).toEqual(testUser);
    });

    test('User', async () => {
        const testUser = { name: 'Test user 1', roleProtected: 'USER' };

        const schema = createSchema(testUser, ['GUEST', 'USER']);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();
        expect(JSON.stringify(introspectionResult.data)).not.toMatch(/private/i);
        expect(introspectionResult.data).toMatchSnapshot();

        // test simple query
        const queryResult = await graphql(schema, '{ me { name roleProtected } }')
        expect(queryResult?.data?.me).toEqual(testUser);
    });

    test('Admin', async () => {
        const testUser = { name: 'Test admin 1', roleProtected: 'ADMIN' };

        const schema = createSchema(testUser, ['GUEST', 'USER', 'ADMIN']);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();
        expect(JSON.stringify(introspectionResult.data)).toMatch(/private/i);
        expect(JSON.stringify(introspectionResult.data)).toMatch(/protected/i);
        expect(introspectionResult.data).toMatchSnapshot();

        // test simple query
        const queryResult = await graphql(schema, '{ me { name roleProtected } }')
        expect(queryResult?.data?.me).toEqual(testUser);
    });
});

