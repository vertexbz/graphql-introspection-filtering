# graphql-introspection-filtering

Extend `SchemaDirectiveVisitor`'s abilities and filter/modify introspection query results.

> **NOTE:** For successful introspection all dependent types must be returned.
If any of dependent types is missing, it's not possible to rebuild graph on
client side, for example graphql playground is unable to build an interactive documentation. 

> **NOTE:** `Query` type definition is required

> **NOTE:** Object types must contain at least one visible field

> **Tested with GraphQL 14.0.0 - 15.5.0**


## Installation
```bash
npm install --save graphql-introspection-filtering
```
or
```bash
yarn add graphql-introspection-filtering
```


## Usage

### Create schema
Filtering is possible on schemas created with `makeExecutableSchema`, provided by `graphql-introspection-filtering`.
```
import makeExecutableSchema from 'graphql-introspection-filtering';

const schema = makeExecutableSchema(schemaConfig[, builder]);
```

- `schemaConfig` - schema configuration, extended original `makeExecutableSchema`'s config object
  
  Additional options
  
  | Option              | Type                                     | Default | Description | 
  |---------------------|------------------------------------------|---------|-------------|
  | **shouldSkipQuery** | `null`, `number`, `(context) => boolean` | `null`  | When positive number provided, this number of introspection queries will be unfiltered. Alternatively callback can be provided, it takes `context` as an argument, and should return boolean. |
  

- `builder` - builder function (default: original graphql `makeExecutableSchema`)

### Create introspection schema visitor
Every object and field is visited by a directive visitor, where corresponding directive is applied on it in
a schema definition (directives on directives are not allowed, so all directives pass this requirement)
**AND** assigned directive visitor contains a corresponding introspection visitor method.

Directive visitor instance is created for every object and field it was applied to (and all directive definitions).

When *falsy* value is returned by a visitor, the field / object is excluded from introspection result.

Example introspection directive visitor below.
```ts
class AuthenticationDirective<TArgs = any, TContext = any> extends SchemaDirectiveVisitor<TArgs, TContext> implements IntrospectionDirectiveVisitor<TArgs, TContext> {
    name: string; // name of the directive used in schema
    args: TArgs; // arguments provided to directive
    visitedType: VisitableSchemaType; // parent of visited object/field/...
    context: TContext; // current query context

    // (optional) If defined instance can visit field argument definitions
    visitIntrospectionArgument(result: GraphQLArgument, info: GraphQLResolveInfo): IntrospectionVisitor<GraphQLArgument> {
        return this.authenticate(result);
    }

    // (optional) If defined instance can visit `directive` definitions
    visitIntrospectionDirective(result: GraphQLDirective, info: GraphQLResolveInfo): IntrospectionVisitor<GraphQLDirective> {
        return this.authenticate(result);
    }

    // (optional) If defined instance can visit `enum` definitions
    visitIntrospectionEnum(result: GraphQLEnumType, info: GraphQLResolveInfo): IntrospectionVisitor<GraphQLEnumType> {
        return this.authenticate(result);
    }

    // (optional) If defined instance can visit enum value definitions
    visitIntrospectionEnumValue(result: GraphQLEnumValue, info: GraphQLResolveInfo): IntrospectionVisitor<GraphQLEnumValue> {
        return this.authenticate(result);
    }

    // (optional) If defined instance can visit object field definitions
    visitIntrospectionField(result: GraphQLField<any, any>, info: GraphQLResolveInfo): IntrospectionVisitor<GraphQLField<any, any>> {
        return this.authenticate(result);
    }

    // (optional) If defined instance can visit input field definitions
    visitIntrospectionInputField(result: GraphQLInputField, info: GraphQLResolveInfo): IntrospectionVisitor<GraphQLInputField> {
        return this.authenticate(result);
    }

    // (optional) If defined instance can visit `input` object definitions
    visitIntrospectionInputObject(result: GraphQLInputObjectType, info: GraphQLResolveInfo): IntrospectionVisitor<GraphQLInputObjectType> {
        return this.authenticate(result);
    }

    // (optional) If defined instance can visit `interface` definitions
    visitIntrospectionInterface(result: GraphQLInterfaceType, info: GraphQLResolveInfo): IntrospectionVisitor<GraphQLInterfaceType> {
        return this.authenticate(result);
    }

    // (optional) If defined instance can visit object `type` definitions
    visitIntrospectionObject(result: GraphQLObjectType, info: GraphQLResolveInfo): IntrospectionVisitor<GraphQLObjectType> {
        return this.authenticate(result);
    }

    // (optional) If defined instance can visit `scalar` definitions
    visitIntrospectionScalar(result: GraphQLScalarType, info: GraphQLResolveInfo): IntrospectionVisitor<GraphQLScalarType> {
        return this.authenticate(result);
    }

    // (optional) If defined instance can visit `union` definitions
    visitIntrospectionUnion(result: GraphQLUnionType, info: GraphQLResolveInfo): IntrospectionVisitor<GraphQLUnionType> {
        return this.authenticate(result);
    }
}
```


## Examples

### Integration tests
There are working examples available, to start local server
use `npm run example` or `yarn example`.
Those examples use schema mocks from `tests/integration/__mocks__`.

### Authentication example
This example provides simple authentication based on roles provided in context.

#### Schema
```graphql
enum Role @auth(requires: ADMIN) {
    ADMIN
    REVIEWER
    USER
    UNKNOWN
}

directive @auth(
    requires: Role = ADMIN,
) on OBJECT | FIELD_DEFINITION | ENUM

type Book @auth(requires: ADMIN) {
    title: String
    author: String
}

type Query {
    me: User
    books: [Book] @auth(requires: ADMIN)
}
```

#### AuthenticationDirective 
```ts
class AuthenticationDirective extends SchemaDirectiveVisitor implements IntrospectionDirectiveVisitor {
    async authenticate(result: any) {
        if (!this.context.roles.includes(this.args.requires || 'ADMIN')) {
            return null;
        }
        return result;
    }

    visitIntrospectionArgument(result: GraphQLArgument, info: GraphQLResolveInfo): IntrospectionVisitor<GraphQLArgument> {
        return this.authenticate(result);
    }

    visitIntrospectionDirective(result: GraphQLDirective, info: GraphQLResolveInfo): IntrospectionVisitor<GraphQLDirective> {
        return this.authenticate(result);
    }

    visitIntrospectionEnum(result: GraphQLEnumType, info: GraphQLResolveInfo): IntrospectionVisitor<GraphQLEnumType> {
        return this.authenticate(result);
    }

    visitIntrospectionEnumValue(result: GraphQLEnumValue, info: GraphQLResolveInfo): IntrospectionVisitor<GraphQLEnumValue> {
        return this.authenticate(result);
    }

    visitIntrospectionField(result: GraphQLField<any, any>, info: GraphQLResolveInfo): IntrospectionVisitor<GraphQLField<any, any>> {
        return this.authenticate(result);
    }

    visitIntrospectionInputField(result: GraphQLInputField, info: GraphQLResolveInfo): IntrospectionVisitor<GraphQLInputField> {
        return this.authenticate(result);
    }

    visitIntrospectionInputObject(result: GraphQLInputObjectType, info: GraphQLResolveInfo): IntrospectionVisitor<GraphQLInputObjectType> {
        return this.authenticate(result);
    }

    visitIntrospectionInterface(result: GraphQLInterfaceType, info: GraphQLResolveInfo): IntrospectionVisitor<GraphQLInterfaceType> {
        return this.authenticate(result);
    }

    visitIntrospectionObject(result: GraphQLObjectType, info: GraphQLResolveInfo): IntrospectionVisitor<GraphQLObjectType> {
        return this.authenticate(result);
    }

    visitIntrospectionScalar(result: GraphQLScalarType, info: GraphQLResolveInfo): IntrospectionVisitor<GraphQLScalarType> {
        return this.authenticate(result);
    }

    visitIntrospectionUnion(result: GraphQLUnionType, info: GraphQLResolveInfo): IntrospectionVisitor<GraphQLUnionType> {
        return this.authenticate(result);
    }

    // ....
}
```

#### Make it executable
```ts
import makeExecutableSchema from 'graphql-introspection-filtering';

const schema = makeExecutableSchema({
    typeDefs: ...schema...,
    ...,
    schemaDirectives: {
        auth: AuthenticationDirective
    },
    shouldSkipQuery: 1 // skip initial query, which is executeted to hash schema
});
```
