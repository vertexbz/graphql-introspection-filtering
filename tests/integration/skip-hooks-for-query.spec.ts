// eslint-disable-next-line import/no-unassigned-import
import '../toHaveInSchema';
import { graphql } from 'graphql';
import createSchema from './_mocks_/schemas/skip-hooks-for-query';
import { introspectionQuery } from '../helper';

describe('Skip hooks for query',  () => {
    test('empty (default)', async () => {
        const schema = createSchema();

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        expect(introspectionResult.data).toHaveInSchema('hello');
        expect(introspectionResult.data).not.toHaveInSchema('mutate');
        expect(introspectionResult.data).not.toHaveInSchema('subscribe');
        expect(introspectionResult.data).toMatchSnapshot();
    });

    test('countdown = 0', async () => {
        const schema = createSchema(0);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        expect(introspectionResult.data).toHaveInSchema('hello');
        expect(introspectionResult.data).not.toHaveInSchema('mutate');
        expect(introspectionResult.data).not.toHaveInSchema('subscribe');
        expect(introspectionResult.data).toMatchSnapshot();
    });

    // eslint-disable-next-line max-statements
    test('countdown > 0', async () => {
        const schema = createSchema(2);

        { // first skipped query, counter 2 => 1
            const introspectionResult = await graphql(schema, introspectionQuery);
            expect(introspectionResult.errors).toBeFalsy();

            expect(introspectionResult.data).toHaveInSchema('hello');
            expect(introspectionResult.data).toHaveInSchema('mutate');
            expect(introspectionResult.data).toHaveInSchema('subscribe');
            expect(introspectionResult.data).toMatchSnapshot();
        }
        { // second skipped query, counter 1 => 0
            const introspectionResult = await graphql(schema, introspectionQuery);
            expect(introspectionResult.errors).toBeFalsy();

            expect(introspectionResult.data).toHaveInSchema('hello');
            expect(introspectionResult.data).toHaveInSchema('mutate');
            expect(introspectionResult.data).toHaveInSchema('subscribe');
            expect(introspectionResult.data).toMatchSnapshot();
        }
        { // hooked query, counter at 0
            const introspectionResult = await graphql(schema, introspectionQuery);
            expect(introspectionResult.errors).toBeFalsy();

            expect(introspectionResult.data).toHaveInSchema('hello');
            expect(introspectionResult.data).not.toHaveInSchema('mutate');
            expect(introspectionResult.data).not.toHaveInSchema('subscribe');
            expect(introspectionResult.data).toMatchSnapshot();
        }
        { // hooked query, counter at 0
            const introspectionResult = await graphql(schema, introspectionQuery);
            expect(introspectionResult.errors).toBeFalsy();

            expect(introspectionResult.data).toHaveInSchema('hello');
            expect(introspectionResult.data).not.toHaveInSchema('mutate');
            expect(introspectionResult.data).not.toHaveInSchema('subscribe');
            expect(introspectionResult.data).toMatchSnapshot();
        }
    });

    test('callback', async () => {
        const hookedContext = { hook: 'this' };

        const schema = createSchema((context) => {
            return context !== hookedContext;
        });

        {
            const introspectionResult = await graphql(schema, introspectionQuery, null, hookedContext);
            expect(introspectionResult.errors).toBeFalsy();

            expect(introspectionResult.data).toHaveInSchema('hello');
            expect(introspectionResult.data).not.toHaveInSchema('mutate');
            expect(introspectionResult.data).not.toHaveInSchema('subscribe');
            expect(introspectionResult.data).toMatchSnapshot();
        }
        {
            const introspectionResult = await graphql(schema, introspectionQuery);
            expect(introspectionResult.errors).toBeFalsy();

            expect(introspectionResult.data).toHaveInSchema('hello');
            expect(introspectionResult.data).toHaveInSchema('mutate');
            expect(introspectionResult.data).toHaveInSchema('subscribe');
            expect(introspectionResult.data).toMatchSnapshot();
        }
    });
});

