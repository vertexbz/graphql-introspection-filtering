export default `
directive @auth(
    requires: Role = ADMIN,
) on OBJECT | FIELD_DEFINITION | ENUM | INTERFACE | UNION

enum Role @auth(requires: USER) {
    ADMIN
    REVIEWER
    USER
    GUEST
}
enum RolePrivate @auth(requires: ADMIN) {
    ADMIN
    REVIEWER
    USER
    GUEST
}

type Book @auth(requires: ADMIN) {
    title: String!
    author: String!
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
    id: ID! @auth(requires: ADMIN)
    iEmpty: Int! @auth(requires: ADMIN)
}

type OEmpty implements IEmpty {
    id: ID! @auth(requires: ADMIN)
    iEmpty: Int! @auth(requires: ADMIN)
    filled: Boolean!
}

type Empty {
    id: ID! @auth(requires: ADMIN)
    empty: Int! @auth(requires: ADMIN)
}

type User {
    name: String!
    role: String! @auth(requires: USER)
    roleForAdmin: String! @auth(requires: ADMIN)
}

union Public = Empty | User | OEmpty

union Private @auth(requires: ADMIN) = Empty | User | OEmpty

type Query {
    me: User!
    iPublic: IPublic!
    iPrivate: IPrivate! @auth(requires: ADMIN)
    iEmpty: IEmpty!
    empty: Empty!
    uPublic: [Public!]!
    uPrivate: [Private!]! @auth(requires: ADMIN)
    meAuth: User! @auth(requires: USER)
    books: [Book!]! @auth(requires: ADMIN)
}
`;
