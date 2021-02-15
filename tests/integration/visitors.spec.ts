import { graphql } from 'graphql';
import { introspectionQuery } from '../helper';
import createSchema from './_mocks_/schemas/visitors';
import createAuthDirective from './_mocks_/createAuthDirective';
import type { SchemaDirectiveVisitor } from 'graphql-tools';

describe('Visitors',  () => {
    test('visitIntrospectionScalar', async () => {
        const Directive = createAuthDirective(['USER']);
        const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionScalar');

        const schema = createSchema(Directive);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        expect(spy).toBeCalledTimes(1);

        const [subject, info] = spy.mock.calls[0];
        const instance: SchemaDirectiveVisitor = spy.mock.instances[0] as any;

        expect(subject).toBeTruthy();
        expect(info).toBeTruthy();
        expect(info.schema).toBe(instance.schema);

        expect(subject.name).toBe('Text');

        expect(instance.args.requires).toMatch(/^ADMIN|USER$/);
    });

    test('visitIntrospectionObject', async () => {
        const Directive = createAuthDirective(['USER']);
        const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionObject');

        const schema = createSchema(Directive);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        expect(spy).toBeCalledTimes(2);

        const [subject, info] = spy.mock.calls[0];
        const [subject2] = spy.mock.calls[1];
        const instance: SchemaDirectiveVisitor = spy.mock.instances[0] as any;

        // should be two different objects
        expect(instance).not.toBe(spy.mock.instances[1]);
        expect(subject).not.toBe(subject2);

        expect(subject).toBeTruthy();
        expect(info).toBeTruthy();
        expect(info.schema).toBe(instance.schema);

        expect([subject.name, subject2.name].sort()).toStrictEqual(['Book', 'OPrivate']);

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

        expect(subject.name).toBe('param2protected');

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

        expect(subject.name).toBe('books');

        expect(instance.args.requires).toMatch(/^ADMIN|USER$/);
    });

    test('visitIntrospectionEnum', async () => {
        const Directive = createAuthDirective(['USER']);
        const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionEnum');

        const schema = createSchema(Directive);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        expect(spy).toBeCalledTimes(1);

        const [subject, info] = spy.mock.calls[0];
        const instance: SchemaDirectiveVisitor = spy.mock.instances[0] as any;

        expect(subject).toBeTruthy();
        expect(info).toBeTruthy();
        expect(info.schema).toBe(instance.schema);

        expect(subject.name).toBe('Role');

        expect(instance.args.requires).toMatch(/^ADMIN|USER$/);
    });

    test('visitIntrospectionInterface', async () => {
        const Directive = createAuthDirective(['USER']);
        const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionInterface');

        const schema = createSchema(Directive);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        expect(spy).toBeCalledTimes(1);

        const [subject, info] = spy.mock.calls[0];
        const instance: SchemaDirectiveVisitor = spy.mock.instances[0] as any;

        expect(subject).toBeTruthy();
        expect(info).toBeTruthy();
        expect(info.schema).toBe(instance.schema);

        expect(subject.name).toBe('IPrivate');

        expect(instance.args.requires).toMatch(/^ADMIN|USER$/);
    });

    test('visitIntrospectionUnion', async () => {
        const Directive = createAuthDirective(['USER']);
        const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionUnion');

        const schema = createSchema(Directive);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        expect(spy).toBeCalledTimes(1);

        const [subject, info] = spy.mock.calls[0];
        const instance: SchemaDirectiveVisitor = spy.mock.instances[0] as any;

        expect(subject).toBeTruthy();
        expect(info).toBeTruthy();
        expect(info.schema).toBe(instance.schema);

        expect(subject.name).toBe('Private');

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

        expect(subject.name).toBe('ADMIN');

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

        expect(subject.name).toBe('type');

        expect(instance.args.requires).toMatch(/^ADMIN|USER$/);
    });

    test('visitIntrospectionInputObject', async () => {
        const Directive = createAuthDirective(['USER']);
        const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionInputObject');

        const schema = createSchema(Directive);

        const introspectionResult = await graphql(schema, introspectionQuery);
        expect(introspectionResult.errors).toBeFalsy();

        expect(spy).toBeCalledTimes(1);


        const [subject, info] = spy.mock.calls[0];
        const instance: SchemaDirectiveVisitor = spy.mock.instances[0] as any;

        expect(subject).toBeTruthy();
        expect(info).toBeTruthy();
        expect(info.schema).toBe(instance.schema);

        expect(subject.name).toBe('InProtected');

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

        expect(subject.name).toBe('auth');
    });
});

