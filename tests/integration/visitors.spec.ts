import { graphql } from 'graphql';
import createSchema from './_mocks_/schemas/visitors';
import createAuthDirective from './_mocks_/createAuthDirective';
import { introspectionQuery } from '../helper';
import type { SchemaDirectiveVisitor } from "graphql-tools";

declare global {
    namespace jest {
        interface Matchers<R> {
            toContainOnly(expected: any): R;
        }
    }
}

describe('Visitors',  () => {
    test('visitIntrospectionScalar', async () => {
        const Directive = createAuthDirective(['USER']);
        const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionScalar');

        const schema = createSchema(Directive);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        expect(spy).toBeCalledTimes(3);
        const calls = spy.mock.calls.map(([subject]) => subject);
        const reference = calls.pop();
        expect(calls).toContainOnly(reference);

        const [subject, info] = spy.mock.calls[0];
        const instance: SchemaDirectiveVisitor = spy.mock.instances[0] as any;

        expect(subject).toBeTruthy();
        expect(info).toBeTruthy();
        expect(info.schema).toBe(instance.schema);

        expect(instance.args.requires).toMatch(/^ADMIN|USER$/);
    });

    test('visitIntrospectionObject', async () => {
        const Directive = createAuthDirective(['USER']);
        const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionObject');

        const schema = createSchema(Directive);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        expect(spy).toBeCalledTimes(2 * 3);
        {
            const calls = spy.mock.calls.slice(0, 3).map(([subject]) => subject);
            const reference = calls.pop();
            expect(calls).toContainOnly(reference);
        }
        {
            const calls = spy.mock.calls.slice(3, 3).map(([subject]) => subject);
            const reference = calls.pop();
            expect(calls).toContainOnly(reference);
        }

        const [subject, info] = spy.mock.calls[0];
        const instance: SchemaDirectiveVisitor = spy.mock.instances[0] as any;

        expect(subject).toBeTruthy();
        expect(info).toBeTruthy();
        expect(info.schema).toBe(instance.schema);

        expect(instance.args.requires).toMatch(/^ADMIN|USER$/);
    });

    test('visitIntrospectionInputField', async () => {
        const Directive = createAuthDirective(['USER']);
        const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionInputField');

        const schema = createSchema(Directive);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        expect(spy).toBeCalledTimes(1);

        const [subject, info] = spy.mock.calls[0];
        const instance: SchemaDirectiveVisitor = spy.mock.instances[0] as any;

        expect(subject).toBeTruthy();
        expect(info).toBeTruthy();
        expect(info.schema).toBe(instance.schema);

        expect(instance.args.requires).toMatch(/^ADMIN|USER$/);
    });

    test('visitIntrospectionField', async () => {
        const Directive = createAuthDirective(['USER']);
        const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionField');

        const schema = createSchema(Directive);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        expect(spy).toBeCalledTimes(1);

        const [subject, info] = spy.mock.calls[0];
        const instance: SchemaDirectiveVisitor = spy.mock.instances[0] as any;

        expect(subject).toBeTruthy();
        expect(info).toBeTruthy();
        expect(info.schema).toBe(instance.schema);

        expect(instance.args.requires).toMatch(/^ADMIN|USER$/);
    });

    test('visitIntrospectionEnum', async () => {
        const Directive = createAuthDirective(['USER']);
        const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionEnum');

        const schema = createSchema(Directive);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        expect(spy).toBeCalledTimes(3);
        const calls = spy.mock.calls.map(([subject]) => subject);
        const reference = calls.pop();
        expect(calls).toContainOnly(reference);

        const [subject, info] = spy.mock.calls[0];
        const instance: SchemaDirectiveVisitor = spy.mock.instances[0] as any;

        expect(subject).toBeTruthy();
        expect(info).toBeTruthy();
        expect(info.schema).toBe(instance.schema);

        expect(instance.args.requires).toMatch(/^ADMIN|USER$/);
    });

    test('visitIntrospectionInterface', async () => {
        const Directive = createAuthDirective(['USER']);
        const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionInterface');

        const schema = createSchema(Directive);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        expect(spy).toBeCalledTimes(3);
        const calls = spy.mock.calls.map(([subject]) => subject);
        const reference = calls.pop();
        expect(calls).toContainOnly(reference);

        const [subject, info] = spy.mock.calls[0];
        const instance: SchemaDirectiveVisitor = spy.mock.instances[0] as any;

        expect(subject).toBeTruthy();
        expect(info).toBeTruthy();
        expect(info.schema).toBe(instance.schema);

        expect(instance.args.requires).toMatch(/^ADMIN|USER$/);
    });

    test('visitIntrospectionUnion', async () => {
        const Directive = createAuthDirective(['USER']);
        const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionUnion');

        const schema = createSchema(Directive);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        expect(spy).toBeCalledTimes(3);
        const calls = spy.mock.calls.map(([subject]) => subject);
        const reference = calls.pop();
        expect(calls).toContainOnly(reference);

        const [subject, info] = spy.mock.calls[0];
        const instance: SchemaDirectiveVisitor = spy.mock.instances[0] as any;

        expect(subject).toBeTruthy();
        expect(info).toBeTruthy();
        expect(info.schema).toBe(instance.schema);

        expect(instance.args.requires).toMatch(/^ADMIN|USER$/);
    });

    test('visitIntrospectionEnumValue', async () => {
        const Directive = createAuthDirective(['USER']);
        const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionEnumValue');

        const schema = createSchema(Directive);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        expect(spy).toBeCalledTimes(1);

        const [subject, info] = spy.mock.calls[0];
        const instance: SchemaDirectiveVisitor = spy.mock.instances[0] as any;

        expect(subject).toBeTruthy();
        expect(info).toBeTruthy();
        expect(info.schema).toBe(instance.schema);

        expect(instance.args.requires).toMatch(/^ADMIN|USER$/);
    });

    test('visitIntrospectionArgument', async () => {
        const Directive = createAuthDirective(['USER']);
        const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionArgument');

        const schema = createSchema(Directive);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        expect(spy).toBeCalledTimes(1);

        const [subject, info] = spy.mock.calls[0];
        const instance: SchemaDirectiveVisitor = spy.mock.instances[0] as any;

        expect(subject).toBeTruthy();
        expect(info).toBeTruthy();
        expect(info.schema).toBe(instance.schema);

        expect(instance.args.requires).toMatch(/^ADMIN|USER$/);
    });

    test('visitIntrospectionInputObject', async () => {
        const Directive = createAuthDirective(['USER']);
        const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionInputObject');

        const schema = createSchema(Directive);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        expect(spy).toBeCalledTimes(3);
        const calls = spy.mock.calls.map(([subject]) => subject);
        const reference = calls.pop();
        expect(calls).toContainOnly(reference);


        const [subject, info] = spy.mock.calls[0];
        const instance: SchemaDirectiveVisitor = spy.mock.instances[0] as any;

        expect(subject).toBeTruthy();
        expect(info).toBeTruthy();
        expect(info.schema).toBe(instance.schema);

        expect(instance.args.requires).toMatch(/^ADMIN|USER$/);
    });

    test('visitIntrospectionDirective', async () => {
        const Directive = createAuthDirective(['USER']);
        const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionDirective');

        const schema = createSchema(Directive);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        expect(spy).toBeCalledTimes(1);

        const [subject, info] = spy.mock.calls[0];
        const instance: SchemaDirectiveVisitor = spy.mock.instances[0] as any;

        expect(subject).toBeTruthy();
        expect(info).toBeTruthy();
        expect(info.schema).toBe(instance.schema);
    });
});

