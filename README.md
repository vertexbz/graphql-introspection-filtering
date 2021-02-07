# graphql-introspection-filtering

Filter graphql schema introspection result to hide restricted fields and types. 
It allows using extended `SchemaDirectiveVisitor`s or filter functions to decide which
schema nodes will be returned with introspection result  

> **NOTE:** For successful introspection all dependent types must be returned.
If any of dependent types is missing it won't be possible to rebuild graph on
client side i.e. graphql playground is unable to build an interactive documentation. 

> **NOTE:** `Query` type definition is required

> **NOTE:** Object types must contain at least one visible field

**Tested with GraphQL 14.0.0 - ...**

## Installation
```bash
npm install --save graphql-introspection-filtering
```
or
```bash
yarn add graphql-introspection-filtering
```

## Usage

### Make filtered schema
You need to create your executable schema with `makeExecutableSchema` provided by `graphql-introspection-filtering`
```
import makeExecutableSchema from 'graphql-introspection-filtering';

const schema = makeExecutableSchema(schemaConfig[, builder]);
```

- `schemaConfig` - schema configuration like for original `makeExecutableSchema`
- `builder` - builder function (default: original `makeExecutableSchema`)

## Example

### Integration tests
There are working examples available in `tests/integration/__mocks__`.

### Minimal example
Minimal schema and auth introspection visitor

#### Configure graphql schema structure
```graphql schema
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
    async validate(result: any) {
        if (!roles.includes(this.args.requires || 'ADMIN')) {
            return null;
        }
        return result;
    }

    visitIntrospectionArgument<TSource, TContext, TArgs>(
        result: GraphQLArgument,
        info: GraphQLResolveInfo
    ): Promise<GraphQLArgument | null> | GraphQLArgument | null {
        return this.validate(result);
    }

    visitIntrospectionDirective<TSource, TContext, TArgs>(
        result: GraphQLDirective,
        info: GraphQLResolveInfo
    ): Promise<GraphQLDirective | null> | GraphQLDirective | null {
        console.log(result);
        return this.validate(result);
    }

    visitIntrospectionEnum<TSource, TContext, TArgs>(
        result: GraphQLEnumType,
        info: GraphQLResolveInfo
    ): Promise<GraphQLEnumType | null> | GraphQLEnumType | null {
        return this.validate(result);
    }

    visitIntrospectionEnumValue<TSource, TContext, TArgs>(
        result: GraphQLEnumValue,
        info: GraphQLResolveInfo
    ): Promise<GraphQLEnumValue | null> | GraphQLEnumValue | null {
        return this.validate(result);
    }

    visitIntrospectionField<TSource, TContext, TArgs>(
        result: GraphQLField<any, any>,
        info: GraphQLResolveInfo
    ): Promise<GraphQLField<any, any> | null> | GraphQLField<any, any> | null {
        return this.validate(result);
    }

    visitIntrospectionInputField<TSource, TContext, TArgs>(
        result: GraphQLInputField,
        info: GraphQLResolveInfo
    ): Promise<GraphQLInputField | null> | GraphQLInputField | null {
        return this.validate(result);
    }

    visitIntrospectionInputObject<TSource, TContext, TArgs>(
        result: GraphQLInputObjectType,
        info: GraphQLResolveInfo
    ): Promise<GraphQLInputObjectType | null> | GraphQLInputObjectType | null {
        return this.validate(result);
    }

    visitIntrospectionInterface<TSource, TContext, TArgs>(
        result: GraphQLInterfaceType,
        info: GraphQLResolveInfo
    ): Promise<GraphQLInterfaceType | null> | GraphQLInterfaceType | null {
        return this.validate(result);
    }

    visitIntrospectionObject<TSource, TContext, TArgs>(
        result: GraphQLObjectType,
        info: GraphQLResolveInfo
    ): Promise<GraphQLObjectType | null> | GraphQLObjectType | null {
        return this.validate(result);
    }

    visitIntrospectionScalar<TSource, TContext, TArgs>(
        result: GraphQLScalarType,
        info: GraphQLResolveInfo
    ): Promise<GraphQLScalarType | null> | GraphQLScalarType | null {
        return this.validate(result);
    }

    visitIntrospectionUnion<TSource, TContext, TArgs>(
        result: GraphQLUnionType,
        info: GraphQLResolveInfo
    ): Promise<GraphQLUnionType | null> | GraphQLUnionType | null {
        return this.validate(result);
    }

    // ....
}
```
