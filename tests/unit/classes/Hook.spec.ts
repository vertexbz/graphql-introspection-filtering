import Hook from '../../../src/classes/Hook';

describe('Hook.resolve', () => {
    test('no directives', () => {
        const hook = new Hook<any>([], 'visit' as any);

        const subject = { hello: 'subject' };
        const mockInfo = { variableValues: {} };
        const result = hook.resolve(subject as any, null as any, null, mockInfo as any);

        expect(result).toStrictEqual({ hello: 'subject' });
    });

    test('single directive', () => {
        class Directive {
            protected config: any;

            constructor(config: any) {
                this.config = config;
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            visit(subject: any, info: any) {
                return { ...subject, visited: true };
            }
        }

        const visitSpy = jest.spyOn(Directive.prototype, 'visit');

        const mockDirectiveArgs = { arg: 'value' };
        const hook = new Hook<any>([{ name: 'test1a', cls: Directive, args: mockDirectiveArgs }] as any, 'visit' as any);

        const subject = { hello: 'subject' };
        const mockSchema = { schema: [1, 2, 3] };
        const mockInfo = { variableValues: {}, schema: mockSchema };
        const mockRoot = { root: 'qwe' };
        const mockContext = { context: 5345 };
        const result = hook.resolve(subject as any, mockRoot as any, mockContext, mockInfo as any);

        expect(result).toStrictEqual({ hello: 'subject', visited: true });
        expect(visitSpy).toHaveBeenCalledTimes(1);
        expect(visitSpy).toHaveBeenCalledWith(subject, mockInfo);

        const instance = visitSpy.mock.instances[0];
        expect(instance.config.args).toBe(mockDirectiveArgs);
        expect(instance.config.name).toBe('test1a');
        expect(instance.config.visitedType).toBe(mockRoot);
        expect(instance.config.schema).toBe(mockSchema);
        expect(instance.config.context).toBe(mockContext);
    });

    // eslint-disable-next-line max-statements
    test('multiple directives', () => {
        class Directive {
            protected config: any;

            constructor(config: any) {
                this.config = config;
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            visit(subject: any, info: any) {
                return { ...subject, visited: (subject.visited || 0) + 1 };
            }
        }

        const visitSpy = jest.spyOn(Directive.prototype, 'visit');

        const mockDirectiveArgs = { arg: 'value' };
        const mockDirectiveArgs2 = { arg: 'value2' };
        const hook = new Hook<any>([
            { name: 'test1a', cls: Directive, args: mockDirectiveArgs },
            { name: 'test2b', cls: Directive, args: mockDirectiveArgs2 }
        ] as any, 'visit' as any);

        const subject = { hello: 'subject' };
        const mockSchema = { schema: [1, 2, 3] };
        const mockInfo = { variableValues: {}, schema: mockSchema };
        const mockRoot = { root: 'qwe' };
        const mockContext = { context: 5345 };
        const result = hook.resolve(subject as any, mockRoot as any, mockContext, mockInfo as any);

        expect(result).toStrictEqual({ hello: 'subject', visited: 2 });
        expect(visitSpy).toHaveBeenCalledTimes(2);
        expect(visitSpy).toHaveBeenCalledWith(subject, mockInfo);

        {
            const instance = visitSpy.mock.instances[0];
            expect(instance.config.args).toBe(mockDirectiveArgs);
            expect(instance.config.name).toBe('test1a');
            expect(instance.config.visitedType).toBe(mockRoot);
            expect(instance.config.schema).toBe(mockSchema);
            expect(instance.config.context).toBe(mockContext);
        }
        {
            const instance = visitSpy.mock.instances[1];
            expect(instance.config.args).toBe(mockDirectiveArgs2);
            expect(instance.config.name).toBe('test2b');
            expect(instance.config.visitedType).toBe(mockRoot);
            expect(instance.config.schema).toBe(mockSchema);
            expect(instance.config.context).toBe(mockContext);
        }
    });

    describe('twice with', () => {
        test('same request', async () => {
            class Directive {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                async visit(subject: any, info: any) {
                    await new Promise((res) => setTimeout(res, 50));
                    return { ...subject, visited: true };
                }
            }

            const visitSpy = jest.spyOn(Directive.prototype, 'visit');

            const mockDirectiveArgs = { arg: 'value' };
            const hook = new Hook<any>([{ name: 'test1a', cls: Directive, args: mockDirectiveArgs }] as any, 'visit' as any);

            const subject = { hello: 'subject' };
            const mockInfo = { variableValues: {} };

            const result = hook.resolve(subject as any, null as any, null, mockInfo as any);
            expect(result).toBeInstanceOf(Promise);

            const result2 = hook.resolve(subject as any, null as any, null, mockInfo as any);
            expect(result2).toBeInstanceOf(Promise);

            expect(await result).toStrictEqual({ hello: 'subject', visited: true });
            expect(await result2).toStrictEqual({ hello: 'subject', visited: true });
            expect(await result).toBe(await result2);
            expect(visitSpy).toHaveBeenCalledTimes(1);
            expect(visitSpy).toHaveBeenCalledWith(subject, mockInfo);
        });

        test('different requests', async () => {
            class Directive {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                async visit(subject: any, info: any) {
                    await new Promise((res) => setTimeout(res, 50));
                    return { ...subject, visited: true };
                }
            }

            const visitSpy = jest.spyOn(Directive.prototype, 'visit');

            const mockDirectiveArgs = { arg: 'value' };
            const hook = new Hook<any>([{ name: 'test1a', cls: Directive, args: mockDirectiveArgs }] as any, 'visit' as any);

            const subject = { hello: 'subject' };

            const mockInfo = { variableValues: {} };
            const result = hook.resolve(subject as any, null as any, null, mockInfo as any);
            expect(result).toBeInstanceOf(Promise);

            const mockInfo2 = { variableValues: {} };
            const result2 = hook.resolve(subject as any, null as any, null, mockInfo2 as any);
            expect(result2).toBeInstanceOf(Promise);

            expect(await result).toStrictEqual({ hello: 'subject', visited: true });
            expect(await result2).toStrictEqual({ hello: 'subject', visited: true });
            expect(await result).not.toBe(await result2);
            expect(visitSpy).toHaveBeenCalledTimes(2);
            expect(visitSpy).toHaveBeenCalledWith(subject, mockInfo);
        });
    });

    test('two instances with same request', async () => {
        class Directive {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            async visit(subject: any, info: any) {
                await new Promise((res) => setTimeout(res, 50));
                return { ...subject, visited: true };
            }
        }

        const visitSpy = jest.spyOn(Directive.prototype, 'visit');

        const mockDirectiveArgs = { arg: 'value' };
        const hook = new Hook<any>([{ name: 'test1a', cls: Directive, args: mockDirectiveArgs }] as any, 'visit' as any);

        const hook2 = new Hook<any>([{ name: 'test1a', cls: Directive, args: mockDirectiveArgs }] as any, 'visit' as any);

        const subject = { hello: 'subject' };
        const mockInfo = { variableValues: {} };

        const result = hook.resolve(subject as any, null as any, null, mockInfo as any);
        expect(result).toBeInstanceOf(Promise);

        const result2 = hook2.resolve(subject as any, null as any, null, mockInfo as any);
        expect(result2).toBeInstanceOf(Promise);

        expect(await result).toStrictEqual({ hello: 'subject', visited: true });
        expect(await result2).toStrictEqual({ hello: 'subject', visited: true });
        expect(await result).not.toBe(await result2);
        expect(visitSpy).toHaveBeenCalledTimes(2);
        expect(visitSpy).toHaveBeenCalledWith(subject, mockInfo);
        expect(visitSpy.mock.instances[0]).not.toBe(visitSpy.mock.instances[1]);

    });
});
