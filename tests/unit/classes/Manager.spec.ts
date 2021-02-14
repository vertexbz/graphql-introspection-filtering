import {
    GraphQLDirective,
    GraphQLEnumType,
    GraphQLInputObjectType,
    GraphQLInterfaceType,
    GraphQLObjectType,
    GraphQLScalarType,
    GraphQLUnionType
} from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';
import Hook from '../../../src/classes/Hook';
import Manager from '../../../src/classes/Manager';
import { SCHEMA_HOOK, SCHEMA_MANAGER } from '../../../src/constants';
import type { IntrospectionDirectiveVisitor } from '../../../src';

describe('Manager', () => {
    describe('extract', () => {
        test('Manager found', () => {
            const mockManager = { mocked: 'manager' };
            
            const manager = Manager.extract({
                [SCHEMA_MANAGER]: mockManager
            } as any);
            
            expect(manager).toBe(mockManager);
        });
        test('Manager not found', () => {
            const manager = Manager.extract({} as any);

            expect(manager).toBeUndefined();
        });
    });

    describe('shouldHookQuery', () => {
        test('default', () => {
            const manager = new Manager({ }, null as any, { } as any);

            expect(manager.shouldHookQuery({})).toBeTruthy();
            expect(manager.shouldHookQuery({})).toBeTruthy();
            expect(manager.shouldHookQuery({})).toBeTruthy();
            expect(manager.shouldHookQuery({})).toBeTruthy();
            expect(manager.shouldHookQuery({})).toBeTruthy();
        });

        test('countdown: 0', () => {
            const manager = new Manager({ }, null as any, { shouldSkipQuery: 0 } as any);

            expect(manager.shouldHookQuery({})).toBeTruthy();
            expect(manager.shouldHookQuery({})).toBeTruthy();
            expect(manager.shouldHookQuery({})).toBeTruthy();
            expect(manager.shouldHookQuery({})).toBeTruthy();
            expect(manager.shouldHookQuery({})).toBeTruthy();
        });

        test('countdown: 1', () => {
            const manager = new Manager({ }, null as any, { shouldSkipQuery: 1 } as any);

            expect(manager.shouldHookQuery({})).toBeFalsy();
            expect(manager.shouldHookQuery({})).toBeTruthy();
            expect(manager.shouldHookQuery({})).toBeTruthy();
            expect(manager.shouldHookQuery({})).toBeTruthy();
            expect(manager.shouldHookQuery({})).toBeTruthy();
        });

        test('countdown: 4', () => {
            const manager = new Manager({ }, null as any, { shouldSkipQuery: 4 } as any);

            expect(manager.shouldHookQuery({})).toBeFalsy();
            expect(manager.shouldHookQuery({})).toBeFalsy();
            expect(manager.shouldHookQuery({})).toBeFalsy();
            expect(manager.shouldHookQuery({})).toBeFalsy();
            expect(manager.shouldHookQuery({})).toBeTruthy();
            expect(manager.shouldHookQuery({})).toBeTruthy();
        });

        // eslint-disable-next-line max-statements
        test('callback', () => {
            const shouldSkipQuery = jest.fn(({ result }) => !result);

            const manager = new Manager({ }, null as any, { shouldSkipQuery } as any);

            expect(manager.shouldHookQuery({ result: true })).toBeTruthy();
            expect(shouldSkipQuery).toBeCalled();
            shouldSkipQuery.mockClear();

            expect(manager.shouldHookQuery({ result: false })).toBeFalsy();
            expect(shouldSkipQuery).toBeCalled();
            shouldSkipQuery.mockClear();

            expect(manager.shouldHookQuery({ result: true })).toBeTruthy();
            expect(shouldSkipQuery).toBeCalled();
            shouldSkipQuery.mockClear();

            expect(manager.shouldHookQuery({ result: false })).toBeFalsy();
            expect(shouldSkipQuery).toBeCalled();
            shouldSkipQuery.mockClear();

            expect(manager.shouldHookQuery({ result: false })).toBeFalsy();
            expect(shouldSkipQuery).toBeCalled();
            shouldSkipQuery.mockClear();

            expect(manager.shouldHookQuery({ result: true })).toBeTruthy();
            expect(shouldSkipQuery).toBeCalled();
            shouldSkipQuery.mockClear();

            expect(manager.shouldHookQuery({ result: true })).toBeTruthy();
            expect(shouldSkipQuery).toBeCalled();
            shouldSkipQuery.mockClear();
        });
    });

    describe('resolve', () => {
        test('skipped', () => {
            const manager = new Manager({ }, null as any, { } as any);

            const subject = { sub: 'ject', [SCHEMA_HOOK]: false };
            const result = manager.resolve(subject as any, null as any, null, {} as any);

            expect(result).toBe(subject);
        });

        test('prepared', () => {
            const manager = new Manager({ }, null as any, { } as any);

            const resolve = jest.fn((s) => ({ ...s, hook: 'ed' }));
            const mockedHook = { resolve };
            const subject = { sub: 'ject', [SCHEMA_HOOK]: mockedHook };
            const root = { root: 'mock' };
            const context = { context: 'mock' };
            const info = { info: 'mock' };
            const result = manager.resolve(subject as any, root as any, context, info as any);

            expect(result).toStrictEqual({ ...subject, hook: 'ed' });
            expect(resolve).toBeCalled();
            expect(resolve).toBeCalledWith(subject, root, context, info);
        });

        describe('prepare', () => {
            describe('no directives', () => {
                test.each([
                    ['visitIntrospectionScalar' , new GraphQLScalarType({ name: 'scalar' }), {}],
                    ['visitIntrospectionObject' , new GraphQLObjectType({ name: '123', fields: {} }), {}],
                    ['visitIntrospectionInputField' , { astNode: { kind: 'InputValueDefinition' } },
                        new GraphQLInputObjectType({ name: 'input', fields: {} })],
                    ['visitIntrospectionField' , { astNode: { kind: 'FieldDefinition' } }, {}],
                    ['visitIntrospectionEnum' , new GraphQLEnumType({ name: 'enum', values: {} }), {}],
                    ['visitIntrospectionInterface' , new GraphQLInterfaceType({ name: 'interface', fields: {} }), {}],
                    ['visitIntrospectionUnion' , new GraphQLUnionType({ name: 'union', types: [] }), {}],
                    ['visitIntrospectionEnumValue' , { astNode: { kind: 'EnumValueDefinition' } }, {}],
                    ['visitIntrospectionArgument' , { astNode: { kind: 'InputValueDefinition' } }, {}],
                    ['visitIntrospectionInputObject', new GraphQLInputObjectType({ name: 'input', fields: {} }), {}]
                ])('%s', (method: string, subject, root) => {
                    // @ts-ignore
                    subject.astNode = {
                        ...(subject as any).astNode,
                        directives: [
                        ]
                    };

                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const spy = jest.fn((subject, info, instance) => ({ ...subject, visited: instance.name }));

                    class Directive extends SchemaDirectiveVisitor implements IntrospectionDirectiveVisitor {
                        // @ts-ignore
                        [method](subject, info) {
                            return spy(subject, info, this);
                        }
                    }

                    const directives = { notApplied: Directive as any };
                    const manager = new Manager(directives, null as any, { } as any);

                    const context = { context: 'mock' };
                    const info = { operation: { } };
                    const result = manager.resolve(subject as any, root as any, context, info as any);

                    expect(spy).not.toBeCalled();
                    expect(result).toStrictEqual(subject);
                    expect((subject as any)[SCHEMA_HOOK]).toBe(false);
                });
            });

            describe('no matching directives', () => {
                test.each([
                    ['visitIntrospectionScalar' , new GraphQLScalarType({ name: 'scalar' }), {}],
                    ['visitIntrospectionObject' , new GraphQLObjectType({ name: '123', fields: {} }), {}],
                    ['visitIntrospectionInputField' , { astNode: { kind: 'InputValueDefinition' } },
                        new GraphQLInputObjectType({ name: 'input', fields: {} })],
                    ['visitIntrospectionField' , { astNode: { kind: 'FieldDefinition' } }, {}],
                    ['visitIntrospectionEnum' , new GraphQLEnumType({ name: 'enum', values: {} }), {}],
                    ['visitIntrospectionInterface' , new GraphQLInterfaceType({ name: 'interface', fields: {} }), {}],
                    ['visitIntrospectionUnion' , new GraphQLUnionType({ name: 'union', types: [] }), {}],
                    ['visitIntrospectionEnumValue' , { astNode: { kind: 'EnumValueDefinition' } }, {}],
                    ['visitIntrospectionArgument' , { astNode: { kind: 'InputValueDefinition' } }, {}],
                    ['visitIntrospectionInputObject', new GraphQLInputObjectType({ name: 'input', fields: {} }), {}]
                ])('%s', (method: string, subject, root) => {
                    // @ts-ignore
                    subject.astNode = {
                        ...(subject as any).astNode,
                        directives: [
                            { kind: 'Directive', name: { kind: 'Name', value: 'applied' } }
                        ]
                    };

                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const spy = jest.fn((subject, info, instance) => ({ ...subject, visited: instance.name }));

                    class Directive extends SchemaDirectiveVisitor implements IntrospectionDirectiveVisitor {
                        // @ts-ignore
                        [method](subject, info) {
                            return spy(subject, info, this);
                        }
                    }

                    const directives = { notApplied: Directive as any };
                    const manager = new Manager(directives, null as any, { } as any);

                    const context = { context: 'mock' };
                    const info = { operation: { } };
                    const result = manager.resolve(subject as any, root as any, context, info as any);

                    expect(spy).not.toBeCalled();
                    expect(result).toStrictEqual(subject);
                    expect((subject as any)[SCHEMA_HOOK]).toBe(false);
                });
            });

            test.each([
                ['visitIntrospectionScalar' , new GraphQLScalarType({ name: 'scalar' }), {}],
                ['visitIntrospectionObject' , new GraphQLObjectType({ name: '123', fields: {} }), {}],
                ['visitIntrospectionInputField' , { astNode: { kind: 'InputValueDefinition' } },
                    new GraphQLInputObjectType({ name: 'input', fields: {} })],
                ['visitIntrospectionField' , { astNode: { kind: 'FieldDefinition' } }, {}],
                ['visitIntrospectionEnum' , new GraphQLEnumType({ name: 'enum', values: {} }), {}],
                ['visitIntrospectionInterface' , new GraphQLInterfaceType({ name: 'interface', fields: {} }), {}],
                ['visitIntrospectionUnion' , new GraphQLUnionType({ name: 'union', types: [] }), {}],
                ['visitIntrospectionEnumValue' , { astNode: { kind: 'EnumValueDefinition' } }, {}],
                ['visitIntrospectionArgument' , { astNode: { kind: 'InputValueDefinition' } }, {}],
                ['visitIntrospectionInputObject' , new GraphQLInputObjectType({ name: 'input', fields: {} }), {}]
            ])('%s', (method: string, subject, root) => {
                // @ts-ignore
                subject.astNode = {
                    ...(subject as any).astNode,
                    directives: [
                        { kind: 'Directive', name: { kind: 'Name', value: 'applied' } }
                    ]
                };

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const spy = jest.fn((subject, info, instance) => ({ ...subject, visited: instance.name }));
                const skippedSpy = jest.fn((subject) => subject);

                class Directive extends SchemaDirectiveVisitor implements IntrospectionDirectiveVisitor {
                    // @ts-ignore
                    [method](subject, info) {
                        return spy(subject, info, this);
                    }
                }

                class SkippedDirective extends SchemaDirectiveVisitor implements IntrospectionDirectiveVisitor {
                    // @ts-ignore
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    [method](subject, info) {
                        return skippedSpy(subject);
                    }
                }

                const directives = { skipped: SkippedDirective as any, applied: Directive as any };
                const manager = new Manager(directives, null as any, { } as any);

                const context = { context: 'mock' };
                const info = { operation: { } };
                const result = manager.resolve(subject as any, root as any, context, info as any);

                expect(skippedSpy).not.toBeCalled();
                expect(spy).toBeCalledWith(subject, info, expect.anything());
                expect({ ...result }).toStrictEqual({ ...subject, visited: 'applied' });
                expect((subject as any)[SCHEMA_HOOK]).toBeInstanceOf(Hook);
            });

            test('visitIntrospectionDirective', () => {
                const subject = new GraphQLDirective({
                    name: 'whatever',
                    locations: []
                });

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const spy = jest.fn((subject, info, instance) => ({ ...subject, visited: instance.name }));
                const otherSpy = jest.fn((subject) => subject);

                class Directive extends SchemaDirectiveVisitor implements IntrospectionDirectiveVisitor {
                    // @ts-ignore
                    visitIntrospectionDirective(subject, info) {
                        return spy(subject, info, this);
                    }
                }

                class OtherDirective extends SchemaDirectiveVisitor implements IntrospectionDirectiveVisitor {
                    // @ts-ignore
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    visitIntrospectionDirective(subject, info) {
                        return otherSpy(subject);
                    }
                }

                const directives = { other: OtherDirective as any, applied: Directive as any };
                const manager = new Manager(directives, null as any, { } as any);

                const context = { context: 'mock' };
                const info = { operation: { } };
                const result = manager.resolve(subject as any, null as any, context, info as any);

                expect(otherSpy).toBeCalled();
                expect(spy).toBeCalledWith(subject, info, expect.anything());
                expect({ ...result }).toStrictEqual({ ...subject, visited: 'applied' });
                expect((subject as any)[SCHEMA_HOOK]).toBeInstanceOf(Hook);
            });

            test.each([
                [{
                    astNode: {
                        kind: 'different',
                        directives: [
                            { kind: 'Directive', name: { kind: 'Name', value: 'applied' } }
                        ]
                    }
                }],
                [{
                    astNode: {
                        directives: [
                            { kind: 'Directive', name: { kind: 'Name', value: 'applied' } }
                        ]
                    }
                }]
            ])('unknown', (subject) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const spy = jest.fn((subject, info, instance) => ({ ...subject, visited: instance.name }));

                class Directive extends SchemaDirectiveVisitor implements IntrospectionDirectiveVisitor {
                    visitIntrospectionDirective(subject: any, info: any) {
                        return spy(subject, info, this);
                    }
                }

                const directives = { applied: Directive as any };
                const manager = new Manager(directives, null as any, { } as any);

                const context = { context: 'mock' };
                const info = { operation: { } };

                expect(() => {
                    manager.resolve(subject as any, null as any, context, info as any);
                }).toThrow(Error);
            });
        });
    });
});
