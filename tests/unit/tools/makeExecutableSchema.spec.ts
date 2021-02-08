import { SchemaDirectiveVisitor } from 'graphql-tools';
import { makeExecutableSchema as realMakeExecutableSchema } from 'graphql-tools';
import makeExecutableSchema from '../../../src/tools/makeExecutableSchema';
import { SCHEMA_MANAGER } from '../../../src/constants';
import createAuthDirective from '../../integration/_mocks_/createAuthDirective';

const typeDefs = `
type Query {
    dummy: String
}
`;

describe('makeExecutableSchema', () => {
    test('with introspection directive', () => {
        const schema = makeExecutableSchema({
            typeDefs,
            schemaDirectives: {
                auth: createAuthDirective([])
            }
        });

        expect(SCHEMA_MANAGER in schema).toBeTruthy();
    });

    test('without directives', () => {
        const schema = makeExecutableSchema({
            typeDefs
        });

        expect(SCHEMA_MANAGER in schema).toBeFalsy();
    });

    test('with regular directive', () => {
        const schema = makeExecutableSchema({
            typeDefs,
            schemaDirectives: {
                auth: SchemaDirectiveVisitor
            }
        });

        expect(SCHEMA_MANAGER in schema).toBeFalsy();
    });

    test('already has manager', () => {
        const t = () => {
            makeExecutableSchema({
                typeDefs, schemaDirectives: {
                    auth: createAuthDirective([])
                }
            }, (config) => {
                const schema = realMakeExecutableSchema(config);
                (schema as any)[SCHEMA_MANAGER] = 'whatever';
                return schema;
            });
        };

        expect(t).toThrow(Error);
    });
});
