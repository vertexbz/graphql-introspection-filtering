import { buildClientSchema, graphql, parse, printSchema, subscribe } from 'graphql';
import createSchema from './_mocks_/schemas/common-no-empty-cases';
import { introspectionQuery } from '../helper';
import type { ExecutionResult, IntrospectionQuery } from 'graphql';

describe('Common (no empty) cases',  () => {
    test('Guest', async () => {
        const testUser = { name: 'Guest', roleProtected: 'GUEST' };
        const testMutation = Math.random().toString(16).substr(2);
        const testSubscription = Array(40).fill(0).map(() => Math.round(Math.random() * 40));

        const schema = createSchema(testUser, testMutation, testSubscription, ['GUEST']);

        const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        const textSchema = printSchema(buildClientSchema(introspectionResult.data!));
        expect(textSchema).not.toMatch(/private/i);
        expect(textSchema).not.toMatch(/protected/i);
        expect(textSchema).toMatchSnapshot();

        // test simple query
        const queryResult = await graphql(schema, '{ me { name roleProtected } }');
        expect(queryResult?.data?.me).toEqual(testUser);

        // test simple mutation
        const mutationResult = await graphql(schema, 'mutation Mutate { mutate }');
        expect(mutationResult?.data?.mutate).toEqual(testMutation);

        // test simple subscription
        const subscriptionResult = await subscribe(schema, parse('subscription Subscribe { subscribe }'));
        expect((subscriptionResult as ExecutionResult).errors).toBeFalsy();
        const subscribed = [];
        for await (const result of subscriptionResult as AsyncIterator<number> as any) {
            subscribed.push(result.data.subscribe);
        }
        expect(subscribed).toEqual(testSubscription);
    });

    test('User', async () => {
        const testUser = { name: 'Test user 1', roleProtected: 'USER' };
        const testMutation = Math.random().toString(16).substr(2);
        const testSubscription = Array(40).fill(0).map(() => Math.round(Math.random() * 40));

        const schema = createSchema(testUser, testMutation, testSubscription, ['GUEST', 'USER']);

        const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        const textSchema = printSchema(buildClientSchema(introspectionResult.data!));
        expect(textSchema).not.toMatch(/private/i);
        expect(textSchema).toMatch(/protected/i);
        expect(textSchema).toMatchSnapshot();

        // test simple query
        const queryResult = await graphql(schema, '{ me { name roleProtected } }');
        expect(queryResult?.data?.me).toEqual(testUser);

        // test simple mutation
        const mutationResult = await graphql(schema, 'mutation Mutate { mutate }');
        expect(mutationResult?.data?.mutate).toEqual(testMutation);

        // test simple subscription
        const subscriptionResult = await subscribe(schema, parse('subscription Subscribe { subscribe }'));
        expect((subscriptionResult as ExecutionResult).errors).toBeFalsy();
        const subscribed = [];
        for await (const result of subscriptionResult as AsyncIterator<number> as any) {
            subscribed.push(result.data.subscribe);
        }
        expect(subscribed).toEqual(testSubscription);
    });

    test('Admin', async () => {
        const testUser = { name: 'Test admin 1', roleProtected: 'ADMIN' };
        const testMutation = Math.random().toString(16).substr(2);
        const testSubscription = Array(40).fill(0).map(() => Math.round(Math.random() * 40));

        const schema = createSchema(testUser, testMutation, testSubscription, ['GUEST', 'USER', 'ADMIN']);

        const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        const textSchema = printSchema(buildClientSchema(introspectionResult.data!));
        expect(textSchema).toMatch(/private/i);
        expect(textSchema).toMatch(/protected/i);
        expect(textSchema).toMatchSnapshot();

        // test simple query
        const queryResult = await graphql(schema, '{ me { name roleProtected } }');
        expect(queryResult?.data?.me).toEqual(testUser);

        // test simple mutation
        const mutationResult = await graphql(schema, 'mutation Mutate { mutate }');
        expect(mutationResult?.data?.mutate).toEqual(testMutation);

        // test simple subscription
        const subscriptionResult = await subscribe(schema, parse('subscription Subscribe { subscribe }'));
        expect((subscriptionResult as ExecutionResult).errors).toBeFalsy();
        const subscribed = [];
        for await (const result of subscriptionResult as AsyncIterator<number> as any) {
            subscribed.push(result.data.subscribe);
        }
        expect(subscribed).toEqual(testSubscription);
    });
});

