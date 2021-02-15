// eslint-disable-next-line import/no-unassigned-import
import '../toHaveInSchema';
import { graphql } from 'graphql';
import { introspectionQuery } from '../helper';
import createSchema from './_mocks_/schemas/filtered-roots';

describe('Filtered roots',  () => {
    test('Guest', async () => {
        const schema = createSchema(['GUEST']);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        expect(introspectionResult.data).toHaveInSchema('hello');
        expect(introspectionResult.data).not.toHaveInSchema('mutate');
        expect(introspectionResult.data).not.toHaveInSchema('subscribe');
        expect(introspectionResult.data).toMatchSnapshot();
    });

    test('User', async () => {
        const schema = createSchema(['GUEST', 'USER']);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        expect(introspectionResult.data).toHaveInSchema('hello');
        expect(introspectionResult.data).toHaveInSchema('mutate');
        expect(introspectionResult.data).toHaveInSchema('subscribe');
        expect(introspectionResult.data).toMatchSnapshot();
    });
});

