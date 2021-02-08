import { graphql } from 'graphql';
import createSchema from './_mocks_/schemas/filtered-roots';
import { introspectionQuery } from '../helper';

describe('Filtered roots',  () => {
    test('Guest', async () => {
        const schema = createSchema(['GUEST']);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();
        expect(JSON.stringify(introspectionResult.data)).toMatch('"hello"');
        expect(JSON.stringify(introspectionResult.data)).not.toMatch('"mutate"');
        expect(JSON.stringify(introspectionResult.data)).not.toMatch('"subscribe"');
        expect(introspectionResult.data).toMatchSnapshot();
    });

    test('User', async () => {
        const schema = createSchema(['GUEST', 'USER']);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();
        expect(JSON.stringify(introspectionResult.data)).toMatch('"hello"');
        expect(JSON.stringify(introspectionResult.data)).toMatch('"mutate"');
        expect(JSON.stringify(introspectionResult.data)).toMatch('"subscribe"');
        expect(introspectionResult.data).toMatchSnapshot();
    });
});

