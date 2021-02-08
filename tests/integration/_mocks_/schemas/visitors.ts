/* eslint-disable import/no-unassigned-import, max-len */
import '../../../../src/register';
import makeFilteredSchema from '../../../../src/tools/makeExecutableSchema';
import type { SchemaDirectiveVisitor } from 'graphql-tools';

// language=GraphQL
const typeDefs = `
directive @auth(requires: Role = ADMIN) on OBJECT | FIELD_DEFINITION | ENUM | ENUM_VALUE | INTERFACE | UNION | INPUT_OBJECT | INPUT_FIELD_DEFINITION | ARGUMENT_DEFINITION | SCALAR

enum Role @auth(requires: USER) {
    ADMIN @auth(requires: ADMIN)
    REVIEWER
    USER
    GUEST
}

interface IPrivate @auth(requires: ADMIN) {
    privateId: ID!
}

type OPrivate implements IPrivate @auth(requires: ADMIN) {
    privateId: ID!
    private2: String!
}

type Book @auth(requires: USER) {
    title: String!
    author: String!
}

union Private @auth(requires: ADMIN) = OPrivate | Book

input InProtected @auth(requires: USER) {
    param1protected: String
    param2protected: String @auth(requires: ADMIN)
}

scalar Text @auth(requires: ADMIN)

type Query {
    books(type: String! @auth(requires: ADMIN)): [Book!]! @auth(requires: USER)
}
`;

export default (directive: typeof SchemaDirectiveVisitor) =>  makeFilteredSchema({
    typeDefs,
    resolvers: {
    },
    schemaDirectives: {
        auth: directive
    }
});
