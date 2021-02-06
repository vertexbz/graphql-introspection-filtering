import "../../../../src/register";
import makeFilteredSchema from "../../../../src/tools/makeExecutableSchema";
import createAuthDirective from "../createAuthDirective";

// language=GraphQL
const typeDefs = `
directive @auth(requires: Role = ADMIN) on OBJECT | FIELD_DEFINITION | ENUM | ENUM_VALUE | INTERFACE | UNION | INPUT_OBJECT | INPUT_FIELD_DEFINITION | ARGUMENT_DEFINITION
enum Role @auth(requires: USER) {
    ADMIN
    REVIEWER
    USER
    GUEST
}

enum EnumPublic {
    PUBLIC
    PUBLIC2
}
enum EnumPartial {
    PUBLIC
    PRIVATE @auth(requires: ADMIN)
}
enum EnumPrivate @auth(requires: ADMIN) {
    ValuePrivate1
    ValuePrivate2
}
enum EnumEmpty {
    PRIVATE1 @auth(requires: ADMIN)
    PRIVATE2 @auth(requires: ADMIN)
}

interface IPublic {
    id: ID!
    iPrivate: Int! @auth(requires: ADMIN)
}
type OPublic implements IPublic {
    id: ID!
    iPrivate: Int! @auth(requires: ADMIN)
    public: String!
}
type OPrivate implements IPublic @auth(requires: ADMIN) {
    id: ID!
    iPrivate: Int! @auth(requires: ADMIN)
    private: String!
}
interface IPrivate @auth(requires: ADMIN) {
    privateId: ID!
}
type OPrivate2 implements IPrivate @auth(requires: ADMIN) {
    privateId: ID!
    private2: String!
}
interface IEmpty {
    idEmptyPrivate: ID! @auth(requires: ADMIN)
    iEmptyPrivate: Int! @auth(requires: ADMIN)
}
type OEmpty implements IEmpty {
    idEmptyPrivate: ID! @auth(requires: ADMIN)
    iEmptyPrivate: Int! @auth(requires: ADMIN)
    filled: Boolean!
}

type PublicType {
    value: String!
}
type User {
    name: String!
    roleProtected: String! @auth(requires: USER)
    roleForAdmin: String! @auth(requires: ADMIN)
}
type Book @auth(requires: ADMIN) {
    title: String!
    author: String!
}
type Empty {
    idEmptyPrivate: ID! @auth(requires: ADMIN)
    emptyPrivate: Int! @auth(requires: ADMIN)
}

union Public = Empty | User | OEmpty
union Private @auth(requires: ADMIN) = Empty | User | OEmpty

input InPublic {
    param1: String
    param2: String
    param2private: String @auth(requires: ADMIN)
}
input InProtected @auth(requires: USER) {
    param1protected: String
    param2protected: String
}
input InPrivate @auth(requires: ADMIN) {
    param1private: String
    param2private: String
}
input InEmpty {
    empty1private: String @auth(requires: ADMIN)
    empty2private: String @auth(requires: ADMIN)
}

type Query {
    me: User!
    tPublic: PublicType!
    iPublic: IPublic!
    iPrivate: IPrivate! @auth(requires: ADMIN)
    iEmpty: IEmpty!
    empty: Empty!
    uPublic: [Public!]!
    uPrivate: [Private!]! @auth(requires: ADMIN)
    meProtected: User! @auth(requires: USER)
    books: [Book!]! @auth(requires: ADMIN)

    args1(argPublic: String!): Int!
    args2(argProtected: String! @auth(requires: USER)): Int!
    args3(argPrivate: String! @auth(requires: ADMIN)): Int!
    args4(argPublic: String!, argPrivate: String! @auth(requires: ADMIN)): Int!
    args5(argPublic: String!, argPrivate: String! @auth(requires: ADMIN), argLast: String!): Int!
    args6(argPrivate: String! @auth(requires: ADMIN), argLast: String!): Int!
    args7(argProtected: String! @auth(requires: USER), argPrivate: String! @auth(requires: ADMIN), argLast: String!): Int!
}
`;
export default (me: any, roles: string[]) =>  makeFilteredSchema({
    typeDefs,
    resolvers: {
        Query: {
            me: () => me
        },
        Public: {
            __resolveType: () => 'Empty'
        },
        Private: {
            __resolveType: () => 'Empty'
        },
        IPublic: {
            __resolveType: () => 'OPublic'
        },
        IPrivate: {
            __resolveType: () => 'OPrivate'
        },
        IEmpty: {
            __resolveType: () => 'OPrivate'
        }
    },
    schemaDirectives: {
        auth: createAuthDirective(roles)
    }
});
