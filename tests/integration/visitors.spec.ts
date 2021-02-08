import { graphql } from 'graphql';
import { INTROSPECTION_VISITOR_METHODS } from '../../src/constants';
import createSchema from './_mocks_/schemas/visitors';
import createAuthDirective from './_mocks_/createAuthDirective';
import { introspectionQuery } from '../helper';
import type { GraphQLResolveInfo } from 'graphql';

describe('Visitors',  () => {
    for (const method of INTROSPECTION_VISITOR_METHODS) {
        // method is always unique
        // eslint-disable-next-line jest/valid-title
        test(method, async () => {
            let lastCall: any = null;

            class Directive extends createAuthDirective([]) {
                [method](subject: any, info: GraphQLResolveInfo) {
                    lastCall = { args: { subject, info }, instance: this };
                    // @ts-ignore
                    return super[method](subject, info);
                }
            }
            const schema = createSchema(Directive);

            const introspectionResult = await graphql(schema, introspectionQuery);
            expect(introspectionResult.errors).toBeFalsy();

            expect(lastCall).toBeTruthy();
            expect(lastCall.args.subject).toBeTruthy();
            expect(lastCall.args.info).toBeTruthy();
            expect(lastCall.args.info.schema).toBe(lastCall.instance.schema);

            if (!['visitIntrospectionDirective'].includes(method)) {
                // directives are "force visited", there is no way to set directives on schema
                // eslint-disable-next-line jest/no-conditional-expect
                expect(lastCall.instance.args.requires).toMatch(/^ADMIN|USER$/);
            }
        });
    }
});

