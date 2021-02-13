import parseDirectiveAst from '../../../src/tools/parseDirectiveAst';

describe('parseDirectiveAst', () => {
    test('parses empty array', () => {
        const result = parseDirectiveAst([]);

        expect(result).toStrictEqual([]);
    });

    test('parses single directives', () => {
        const result = parseDirectiveAst([
            {
                kind: 'Directive',
                name: { kind: 'Name', value: 'auth' },
                arguments: [
                    {
                        kind: 'Argument',
                        name: { kind: 'Name', value: 'requires' },
                        value: { kind: 'EnumValue', value: 'ADMIN' }
                    }
                ]
            }
        ]);

        expect(result).toStrictEqual([{ args: { requires: 'ADMIN' }, name: 'auth' }]);
    });

    test('parses multiple different directives', () => {
        const result = parseDirectiveAst([
            {
                kind: 'Directive',
                name: { kind: 'Name', value: 'auth' },
                arguments: [
                    {
                        kind: 'Argument',
                        name: { kind: 'Name', value: 'requires' },
                        value: { kind: 'EnumValue', value: 'ADMIN' }
                    }
                ]
            },
            {
                kind: 'Directive',
                name: { kind: 'Name', value: 'can' },
                arguments: [
                    {
                        kind: 'Argument',
                        name: { kind: 'Name', value: 'skill' },
                        value: { kind: 'EnumValue', value: 'juggle' }
                    }
                ]
            },
            {
                kind: 'Directive',
                name: { kind: 'Name', value: 'jumps' }
            },
            {
                kind: 'Directive',
                name: { kind: 'Name', value: 'knows' },
                arguments: [
                ]
            },
            {
                kind: 'Directive',
                name: { kind: 'Name', value: 'null' },
                arguments: [
                    {
                        kind: 'Argument',
                        name: { kind: 'Name', value: 'prop' },
                        value: { kind: 'NullValue' }
                    }
                ]
            }
        ]);

        expect(result).toStrictEqual([
            { args: { requires: 'ADMIN' }, name: 'auth' },
            { args: { skill: 'juggle' }, name: 'can' },
            { args: { }, name: 'jumps' },
            { args: { }, name: 'knows' },
            { args: { prop: null }, name: 'null' }
        ]);
    });

    test('parses multiple similar directives', () => {
        const result = parseDirectiveAst([
            {
                kind: 'Directive',
                name: { kind: 'Name', value: 'auth' },
                arguments: [
                    {
                        kind: 'Argument',
                        name: { kind: 'Name', value: 'requires' },
                        value: { kind: 'EnumValue', value: 'ADMIN' }
                    }
                ]
            },
            {
                kind: 'Directive',
                name: { kind: 'Name', value: 'auth' },
                arguments: [
                    {
                        kind: 'Argument',
                        name: { kind: 'Name', value: 'requires' },
                        value: { kind: 'EnumValue', value: 'USER' }
                    }
                ]
            }
        ]);

        expect(result).toStrictEqual([
            { args: { requires: 'ADMIN' }, name: 'auth' },
            { args: { requires: 'USER' }, name: 'auth' }
        ]);
    });
});
