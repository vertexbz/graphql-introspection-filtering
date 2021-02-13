/* eslint-disable import/no-unassigned-import, max-len */
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import '../../../../src/register';
import makeFilteredSchema from '../../../../src/tools/makeExecutableSchema';
import createAuthDirective from '../createAuthDirective';

// language=GraphQL
const typeDefs = `
directive @auth(requires: Role = USER) on OBJECT | FIELD_DEFINITION | ENUM | ENUM_VALUE | INTERFACE | UNION | INPUT_OBJECT | INPUT_FIELD_DEFINITION | ARGUMENT_DEFINITION
enum Role @auth(requires: USER) {
    USER
    GUEST
}

type Query {
    hello: String!
}

type Mutation @auth(requires: USER) {
    mutate: String!
}

type Subscription @auth(requires: USER) {
    subscribe: Int!
}
`;

export default (roles: string[]) =>  makeFilteredSchema({
    typeDefs,
    resolvers: {
    },
    schemaDirectives: {
        auth: createAuthDirective(roles)
    }
});
