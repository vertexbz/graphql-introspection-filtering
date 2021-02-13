import { graphql } from 'graphql';
import createSchema from './_mocks_/schemas/visitors';
import createAuthDirective from './_mocks_/createAuthDirective';
import { introspectionQuery } from '../helper';
import type { IntrospectionQuery } from 'graphql';

const check = (required: string, context: any): boolean => {
    return context.includes(required);
};

describe('Multiple calls',  () => {
    describe('visitIntrospectionScalar', () => {
        test('with same context', async () => {
            const contextValue = ['USER'];

            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionScalar');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).toEqual(introspectionResult2.data);
        });

        test('with same context, after timeout', async () => {
            const contextValue = ['USER'];

            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionScalar');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).toEqual(introspectionResult2.data);
        });

        test('with different context', async () => {
            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionScalar');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, ['USER']);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, []);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).not.toEqual(introspectionResult2.data);
        });
    });

    describe('visitIntrospectionObject', () => {
        test('with same context', async () => {
            const contextValue = ['USER'];

            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionObject');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(4);

            expect(introspectionResult.data).toEqual(introspectionResult2.data);
        });

        test('with same context, after timeout', async () => {
            const contextValue = ['USER'];

            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionObject');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(4);

            expect(introspectionResult.data).toEqual(introspectionResult2.data);
        });

        test('with different context', async () => {
            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionObject');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, ['USER']);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, []);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(4);

            expect(introspectionResult.data).not.toEqual(introspectionResult2.data);
        });
    });

    describe('visitIntrospectionInputField', () => {
        test('with same context', async () => {
            const contextValue = ['USER'];

            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionInputField');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).toEqual(introspectionResult2.data);
        });

        test('with same context, after timeout', async () => {
            const contextValue = ['USER'];

            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionInputField');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).toEqual(introspectionResult2.data);
        });

        test('with different context', async () => {
            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionInputField');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, ['USER', 'ADMIN']);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, ['USER']);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).not.toEqual(introspectionResult2.data);
        });
    });

    describe('visitIntrospectionField', () => {
        test('with same context', async () => {
            const contextValue = ['USER'];

            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionField');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).toEqual(introspectionResult2.data);
        });

        test('with same context, after timeout', async () => {
            const contextValue = ['USER'];

            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionField');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).toEqual(introspectionResult2.data);
        });

        test('with different context', async () => {
            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionField');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, ['USER']);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, []);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).not.toEqual(introspectionResult2.data);
        });
    });

    describe('visitIntrospectionEnum', () => {
        test('with same context', async () => {
            const contextValue = ['USER'];

            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionEnum');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).toEqual(introspectionResult2.data);
        });

        test('with same context, after timeout', async () => {
            const contextValue = ['USER'];

            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionEnum');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).toEqual(introspectionResult2.data);
        });

        test('with different context', async () => {
            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionEnum');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, ['USER']);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, []);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).not.toEqual(introspectionResult2.data);
        });
    });

    describe('visitIntrospectionInterface', () => {
        test('with same context', async () => {
            const contextValue = ['USER'];

            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionInterface');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).toEqual(introspectionResult2.data);
        });

        test('with same context, after timeout', async () => {
            const contextValue = ['USER'];

            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionInterface');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).toEqual(introspectionResult2.data);
        });

        test('with different context', async () => {
            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionInterface');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, ['USER']);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, []);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).not.toEqual(introspectionResult2.data);
        });
    });

    describe('visitIntrospectionUnion', () => {
        test('with same context', async () => {
            const contextValue = ['USER'];

            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionUnion');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).toEqual(introspectionResult2.data);
        });

        test('with same context, after timeout', async () => {
            const contextValue = ['USER'];

            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionUnion');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).toEqual(introspectionResult2.data);
        });

        test('with different context', async () => {
            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionUnion');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, ['USER']);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, []);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).not.toEqual(introspectionResult2.data);
        });
    });

    describe('visitIntrospectionEnumValue', () => {
        test('with same context', async () => {
            const contextValue = ['USER'];

            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionEnumValue');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).toEqual(introspectionResult2.data);
        });

        test('with same context, after timeout', async () => {
            const contextValue = ['USER'];

            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionEnumValue');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).toEqual(introspectionResult2.data);
        });

        test('with different context', async () => {
            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionEnumValue');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, ['USER', 'ADMIN']);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, ['USER']);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).not.toEqual(introspectionResult2.data);
        });
    });

    describe('visitIntrospectionArgument', () => {
        test('with same context', async () => {
            const contextValue = ['USER'];

            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionArgument');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).toEqual(introspectionResult2.data);
        });

        test('with same context, after timeout', async () => {
            const contextValue = ['USER'];

            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionArgument');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).toEqual(introspectionResult2.data);
        });

        test('with different context', async () => {
            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionArgument');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, ['USER', 'ADMIN']);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, ['USER']);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).not.toEqual(introspectionResult2.data);
        });
    });

    describe('visitIntrospectionInputObject', () => {
        test('with same context', async () => {
            const contextValue = ['USER'];

            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionInputObject');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).toEqual(introspectionResult2.data);
        });

        test('with same context, after timeout', async () => {
            const contextValue = ['USER'];

            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionInputObject');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).toEqual(introspectionResult2.data);
        });

        test('with different context', async () => {
            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionInputObject');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, ['USER']);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, []);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).not.toEqual(introspectionResult2.data);
        });
    });

    describe('visitIntrospectionDirective', () => {
        test('with same context', async () => {
            const contextValue = ['USER'];

            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionDirective');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).toEqual(introspectionResult2.data);
        });

        test('with same context, after timeout', async () => {
            const contextValue = ['USER'];

            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionDirective');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, contextValue);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).toEqual(introspectionResult2.data);
        });

        test('with different context', async () => {
            const Directive = createAuthDirective(check);
            const spy = jest.spyOn(Directive.prototype, 'visitIntrospectionDirective');

            const schema = createSchema(Directive);

            const introspectionResult = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, ['USER']);
            expect(introspectionResult.errors).toBeFalsy();

            const introspectionResult2 = await graphql<IntrospectionQuery>(schema, introspectionQuery, null, []);
            expect(introspectionResult2.errors).toBeFalsy();

            expect(spy).toBeCalledTimes(2);

            expect(introspectionResult.data).not.toEqual(introspectionResult2.data);
        });
    });
});

