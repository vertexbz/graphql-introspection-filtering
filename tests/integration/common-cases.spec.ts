import { graphql, introspectionQuery, } from "graphql";
import createSchema from "./__mocks__/schemas/common-cases";

test('Common cases', async () => {
    const testUser = { name: 'Test user 1', role: 'USER' };

    const schema = createSchema(testUser, ['GUEST', 'USER']);

    const introspectionResult = await graphql(schema, introspectionQuery);
    expect(introspectionResult.errors).toBeFalsy();
    expect(introspectionResult.data).toMatchSnapshot();
    expect(JSON.stringify(introspectionResult.data)).not.toMatch(/private/i);

    // test simple query
    const queryResult = await graphql(schema, '{ me { name role } }')
    expect(queryResult?.data?.me).toEqual(testUser);
});

