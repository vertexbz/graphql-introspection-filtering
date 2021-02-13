import { buildClientSchema, graphql, printSchema } from 'graphql';
import createSchema from './_mocks_/schemas/skip-hooks-for-query';
import { introspectionQuery } from '../helper';

describe('Skip hooks for query',  () => {
    test('empty (default)', async () => {
        const schema = createSchema();

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        const textSchema = printSchema(buildClientSchema(introspectionResult.data as any));
        expect(textSchema).toMatch('hello');
        expect(textSchema).not.toMatch('mutate');
        expect(textSchema).not.toMatch('subscribe');
        expect(textSchema).toMatchSnapshot();
    });

    test('countdown = 0', async () => {
        const schema = createSchema(0);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        const textSchema = printSchema(buildClientSchema(introspectionResult.data as any));
        expect(textSchema).toMatch('hello');
        expect(textSchema).not.toMatch('mutate');
        expect(textSchema).not.toMatch('subscribe');
        expect(textSchema).toMatchSnapshot();
    });

    // eslint-disable-next-line max-statements
    test('countdown > 0', async () => {
        const schema = createSchema(2);

        { // first skipped query, counter 2 => 1
            const introspectionResult = await graphql(schema, introspectionQuery);
            expect(introspectionResult.errors).toBeFalsy();

            const textSchema = printSchema(buildClientSchema(introspectionResult.data as any));
            expect(textSchema).toMatch('hello');
            expect(textSchema).toMatch('mutate');
            expect(textSchema).toMatch('subscribe');
            expect(textSchema).toMatchSnapshot();
        }
        { // second skipped query, counter 1 => 0
            const introspectionResult = await graphql(schema, introspectionQuery);
            expect(introspectionResult.errors).toBeFalsy();

            const textSchema = printSchema(buildClientSchema(introspectionResult.data as any));
            expect(textSchema).toMatch('hello');
            expect(textSchema).toMatch('mutate');
            expect(textSchema).toMatch('subscribe');
            expect(textSchema).toMatchSnapshot();
        }
        { // hooked query, counter at 0
            const introspectionResult = await graphql(schema, introspectionQuery);
            expect(introspectionResult.errors).toBeFalsy();

            const textSchema = printSchema(buildClientSchema(introspectionResult.data as any));
            expect(textSchema).toMatch('hello');
            expect(textSchema).not.toMatch('mutate');
            expect(textSchema).not.toMatch('subscribe');
            expect(textSchema).toMatchSnapshot();
        }
        { // hooked query, counter at 0
            const introspectionResult = await graphql(schema, introspectionQuery);
            expect(introspectionResult.errors).toBeFalsy();

            const textSchema = printSchema(buildClientSchema(introspectionResult.data as any));
            expect(textSchema).toMatch('hello');
            expect(textSchema).not.toMatch('mutate');
            expect(textSchema).not.toMatch('subscribe');
            expect(textSchema).toMatchSnapshot();
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

            const textSchema = printSchema(buildClientSchema(introspectionResult.data as any));
            expect(textSchema).toMatch('hello');
            expect(textSchema).not.toMatch('mutate');
            expect(textSchema).not.toMatch('subscribe');
            expect(textSchema).toMatchSnapshot();
        }
        {
            const introspectionResult = await graphql(schema, introspectionQuery);
            expect(introspectionResult.errors).toBeFalsy();

            const textSchema = printSchema(buildClientSchema(introspectionResult.data as any));
            expect(textSchema).toMatch('hello');
            expect(textSchema).toMatch('mutate');
            expect(textSchema).toMatch('subscribe');
            expect(textSchema).toMatchSnapshot();
        }
    });
});

