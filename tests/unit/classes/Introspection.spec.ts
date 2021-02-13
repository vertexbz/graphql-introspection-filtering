import { __Directive, __Field } from 'graphql/type/introspection';
import Introspection from '../../../src/classes/Introspection';
import { INTROSPECTION_HOOK, SCHEMA_MANAGER, SHOULD_HOOK_QUERY } from '../../../src/constants';

describe('Introspection', () => {
    describe('hook', () => {
        describe('success', () => {
            describe('not managed schema', () => {
                test('without resolver', () => {
                    const resolution = { asd: 123 };
                    const mockSubject: any = { };

                    Introspection.hook(mockSubject as any);

                    expect(typeof mockSubject.resolve).toBe('function');

                    const result = mockSubject.resolve({ resolution }, { }, null, { operation: { }, schema: { }, fieldName: 'resolution' });

                    expect(result).toBe(resolution);
                });

                test('resolved', () => {
                    const resolution = { asd: 123 };
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const resolve = jest.fn((a, b, c, d) => resolution);
                    const mockSubject = { resolve };

                    Introspection.hook(mockSubject as any);

                    expect(mockSubject.resolve).not.toStrictEqual(resolve);
                    expect(typeof mockSubject.resolve).toBe('function');

                    const result = mockSubject.resolve(null, { }, null, { operation: { }, schema: { } });

                    expect(resolve).toBeCalled();
                    expect(result).toBe(resolution);
                });

                test('null', () => {
                    const resolution = null;
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const resolve = jest.fn((a, b, c, d) => resolution);
                    const mockSubject = { resolve };

                    Introspection.hook(mockSubject as any);

                    expect(mockSubject.resolve).not.toStrictEqual(resolve);
                    expect(typeof mockSubject.resolve).toBe('function');

                    const result = mockSubject.resolve(null, { }, null, { operation: { }, schema: { } });

                    expect(resolve).toBeCalled();
                    expect(result).toBe(resolution);
                });

                test('not object', () => {
                    const resolution = 123456;
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const resolve = jest.fn((a, b, c, d) => resolution);
                    const mockSubject = { resolve };

                    Introspection.hook(mockSubject as any);

                    expect(mockSubject.resolve).not.toStrictEqual(resolve);
                    expect(typeof mockSubject.resolve).toBe('function');

                    const result = mockSubject.resolve(null, { }, null, { operation: { }, schema: { } });

                    expect(resolve).toBeCalled();
                    expect(result).toBe(resolution);
                });
            });

            describe('managed schema', () => {
                test('should not hook', () => {
                    const resolution = { asd: 123 };
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const resolve = jest.fn((a, b, c, d) => resolution);
                    const mockSubject = { resolve };

                    Introspection.hook(mockSubject as any);

                    expect(mockSubject.resolve).not.toStrictEqual(resolve);
                    expect(typeof mockSubject.resolve).toBe('function');

                    const result = mockSubject.resolve(null, { }, null, { operation: { [SHOULD_HOOK_QUERY]: false }, schema: { } });

                    expect(resolve).toBeCalled();
                    expect(result).toBe(resolution);
                });

                test('should not hook, late', () => {
                    const resolution = { asd: 123 };
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const resolve = jest.fn((a, b, c, d) => resolution);
                    const mockSubject = { resolve };

                    Introspection.hook(mockSubject as any);

                    expect(mockSubject.resolve).not.toStrictEqual(resolve);
                    expect(typeof mockSubject.resolve).toBe('function');

                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const shouldHookQuery = jest.fn((a) => false);
                    const mockManager = { shouldHookQuery };

                    const mockInfo = { operation: { }, schema: { [SCHEMA_MANAGER]: mockManager } };

                    const result = mockSubject.resolve(null, { }, null, mockInfo);

                    expect(resolve).toBeCalled();
                    expect(shouldHookQuery).toBeCalled();
                    expect(result).toBe(resolution);
                });

                test('should hook', () => {
                    const resolution = { asd: 123 };
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const resolve = jest.fn((a, b, c, d) => resolution);
                    const mockSubject = { resolve };

                    Introspection.hook(mockSubject as any);

                    expect(mockSubject.resolve).not.toStrictEqual(resolve);
                    expect(typeof mockSubject.resolve).toBe('function');

                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const shouldHookQuery = jest.fn((a) => true);
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const managerResolve = jest.fn((a, b, c, d) => null);
                    const mockManager = { shouldHookQuery, resolve: managerResolve };

                    const mockInfo = { operation: { [SHOULD_HOOK_QUERY]: true }, schema: { [SCHEMA_MANAGER]: mockManager } };

                    const result = mockSubject.resolve(null, { }, null, mockInfo);

                    expect(resolve).toBeCalled();
                    expect(shouldHookQuery).not.toBeCalled();
                    expect(managerResolve).not.toBeCalled();
                    expect(result).toBe(resolution);
                });

                test('should hook, late', () => {
                    const resolution = { asd: 123 };
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const resolve = jest.fn((a, b, c, d) => resolution);
                    const mockSubject = { resolve };

                    Introspection.hook(mockSubject as any);

                    expect(mockSubject.resolve).not.toStrictEqual(resolve);
                    expect(typeof mockSubject.resolve).toBe('function');

                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const shouldHookQuery = jest.fn((a) => true);
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const managerResolve = jest.fn((a, b, c, d) => null);
                    const mockManager = { shouldHookQuery, resolve: managerResolve };

                    const mockInfo = { operation: { }, schema: { [SCHEMA_MANAGER]: mockManager } };

                    const result = mockSubject.resolve(null, { }, null, mockInfo);

                    expect(resolve).toBeCalled();
                    expect(shouldHookQuery).toBeCalled();
                    expect(managerResolve).not.toBeCalled();
                    expect(result).toBe(resolution);
                });

                test('should hook, without resolver', () => {
                    const resolution = { asd: 123 };
                    const mockSubject: any = { };

                    Introspection.hook(mockSubject as any);

                    expect(typeof mockSubject.resolve).toBe('function');

                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const managerResolve = jest.fn((a, b, c, d) => null);
                    const mockManager = { resolve: managerResolve };

                    const mockInfo = {
                        operation: { [SHOULD_HOOK_QUERY]: true },
                        schema: { [SCHEMA_MANAGER]: mockManager },
                        fieldName: 'resolution'
                    };

                    const result = mockSubject.resolve({ resolution }, { }, null, mockInfo);

                    expect(managerResolve).not.toBeCalled();
                    expect(result).toBe(resolution);
                });
            });
        });

        test('already hooked', () => {
            const resolution = { asd: 123 };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const resolve = jest.fn((a, b, c, d) => resolution);
            const mockSubject = { resolve };

            Introspection.hook(mockSubject as any);

            const hookedResolve = mockSubject.resolve;
            expect(mockSubject.resolve).not.toStrictEqual(resolve);
            expect(typeof mockSubject.resolve).toBe('function');

            Introspection.hook(mockSubject as any);
            expect(mockSubject.resolve).not.toStrictEqual(resolve);
            expect(mockSubject.resolve).toStrictEqual(hookedResolve);

            const result = mockSubject.resolve(null, { }, null, { operation: { }, schema: { } });
            expect(resolve).toBeCalled();
            expect(result).toBe(resolution);
        });
    });

    describe('resolve', () => {
        test('already hooked field', () => {
            const resolution = { asd: 123, [INTROSPECTION_HOOK]: true };
            const mockSubject: any = { };

            Introspection.hook(mockSubject as any);

            expect(typeof mockSubject.resolve).toBe('function');

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const managerResolve = jest.fn((a, b, c, d) => null);
            const mockManager = { resolve: managerResolve };

            const mockInfo = {
                operation: { [SHOULD_HOOK_QUERY]: true },
                schema: { [SCHEMA_MANAGER]: mockManager },
                fieldName: 'resolution'
            };

            const result = mockSubject.resolve({ resolution }, { }, null, mockInfo);

            expect(managerResolve).not.toBeCalled();
            expect(result).toBe(resolution);
        });

        test('already hooked fields', () => {
            const resolution = [{ asd: 123, [INTROSPECTION_HOOK]: true }, { asd: 987, [INTROSPECTION_HOOK]: true }];
            const mockSubject: any = { };

            Introspection.hook(mockSubject as any);

            expect(typeof mockSubject.resolve).toBe('function');

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const managerResolve = jest.fn((a, b, c, d) => null);
            const mockManager = { resolve: managerResolve };

            const mockInfo = {
                operation: { [SHOULD_HOOK_QUERY]: true },
                schema: { [SCHEMA_MANAGER]: mockManager },
                fieldName: 'resolution'
            };

            const result = mockSubject.resolve({ resolution }, { }, null, mockInfo);

            expect(managerResolve).not.toBeCalled();
            expect(result).toStrictEqual(resolution);
        });

        test('introspection schema field', () => {
            const resolution = __Field;
            const mockSubject: any = { };

            Introspection.hook(mockSubject as any);

            expect(typeof mockSubject.resolve).toBe('function');

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const managerResolve = jest.fn((a, b, c, d) => null);
            const mockManager = { resolve: managerResolve };

            const mockInfo = {
                operation: { [SHOULD_HOOK_QUERY]: true },
                schema: { [SCHEMA_MANAGER]: mockManager },
                fieldName: 'resolution'
            };

            const result = mockSubject.resolve({ resolution }, { }, null, mockInfo);

            expect(managerResolve).not.toBeCalled();
            expect(result).toBe(resolution);
        });

        test('introspection schema fields', () => {
            const resolution = [__Field, __Directive];
            const mockSubject: any = { };

            Introspection.hook(mockSubject as any);

            expect(typeof mockSubject.resolve).toBe('function');

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const managerResolve = jest.fn((a, b, c, d) => null);
            const mockManager = { resolve: managerResolve };

            const mockInfo = {
                operation: { [SHOULD_HOOK_QUERY]: true },
                schema: { [SCHEMA_MANAGER]: mockManager },
                fieldName: 'resolution'
            };

            const result = mockSubject.resolve({ resolution }, { }, null, mockInfo);

            expect(managerResolve).not.toBeCalled();
            expect(result).toStrictEqual(resolution);
        });

        test('custom object definition', async () => {
            const resolution = { asd: 123, astNode: { } };
            const mockSubject: any = { };

            Introspection.hook(mockSubject as any);

            expect(typeof mockSubject.resolve).toBe('function');

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const managerResolve = jest.fn((a, b, c, d) => Promise.resolve({ ...a, from: 'manager' })); // todo value
            const mockManager = { resolve: managerResolve };

            const mockInfo = {
                operation: { [SHOULD_HOOK_QUERY]: true },
                schema: { [SCHEMA_MANAGER]: mockManager },
                fieldName: 'resolution'
            };

            const result = mockSubject.resolve({ resolution }, { }, null, mockInfo);

            expect(managerResolve).toBeCalled();
            expect(result).toBeInstanceOf(Promise);
            expect(await result).toStrictEqual({ ...resolution, from: 'manager' });
        });

        test('custom objects definition', async () => {
            const resolution = [{ asd: 123, astNode: { } }, { asd: 321, astNode: { } }];
            const mockSubject: any = { };

            Introspection.hook(mockSubject as any);

            expect(typeof mockSubject.resolve).toBe('function');

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const managerResolve = jest.fn((a, b, c, d) => {
                if (a.asd === 123) {
                    return null;
                }
                return Promise.resolve({ ...a, from: 'manager' });  // todo value
            });
            const mockManager = { resolve: managerResolve };

            const mockInfo = {
                operation: { [SHOULD_HOOK_QUERY]: true },
                schema: { [SCHEMA_MANAGER]: mockManager },
                fieldName: 'resolution'
            };

            const result = mockSubject.resolve({ resolution }, { }, null, mockInfo);

            expect(managerResolve).toBeCalled();
            expect(result).toBeInstanceOf(Promise);
            expect(await result).toStrictEqual([{ asd: 321, astNode: { }, from: 'manager' }]);
        });
    });

    // todo test resolve via manager array and object, maybe exclusions
});
