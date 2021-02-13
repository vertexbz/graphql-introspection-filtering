import { buildClientSchema, graphql, printSchema } from 'graphql';
import createSchema from './_mocks_/schemas/filtered-roots';
import { introspectionQuery } from '../helper';
import type { IntrospectionQuery } from 'graphql';

describe('Filtered roots',  () => {
    test('Guest', async () => {
        const schema = createSchema(['GUEST']);

        const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        const textSchema = printSchema(buildClientSchema(introspectionResult.data!));
        expect(textSchema).toMatch('hello');
        expect(textSchema).not.toMatch('mutate');
        expect(textSchema).not.toMatch('subscribe');
        expect(textSchema).toMatchSnapshot();
    });

    test('User', async () => {
        const schema = createSchema(['GUEST', 'USER']);

        const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        const textSchema = printSchema(buildClientSchema(introspectionResult.data!));
        expect(textSchema).toMatch('hello');
        expect(textSchema).toMatch('mutate');
        expect(textSchema).toMatch('subscribe');
        expect(textSchema).toMatchSnapshot();
    });
});

