# graphql-introspection-filtering

Filter graphql schema introspection result to hide restricted fields and types. 
It allows using extended `SchemaDirectiveVisitor`s or filter functions to decide which
schema nodes will be returned with introspection result  

> **NOTE:** For successful introspection all dependent types must be returned.
If any of dependent types is missing it won't be possible to rebuild graph on
client side i.e. graphql playground is unable to build interactive documentation. 

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
You need to create your executable schema with `makeFilteredSchema` instead of usual `makeExecutableSchema`
```
const schema = makeFilteredSchema(schemaConfig[, builder]);
```
- `schemaConfig` - schema configuration like for `makeExecutableSchema`
- `builder` - builder function (default: `makeExecutableSchema`)

### Filters definition
Object that holds a set of schema node filters

```
const filters = {
    field: [],
    type: [],
    directive: []
};
```
- `field` - (optional) Array of _filter functions_ to filter fields
- `type` - (optional) Array of _filter functions_ to filter types
- `directive` - (optional) Array of _filter functions_ to filter directives

### Filter function
Node filtering function, when result of this function is `true` the node will be returned
```
(field, root, args, context, info) => boolean;
```
- `field` - Schema node to be returned, the node we decide whether we want to show it or not
- `root` - Root node for this introspection request as for regular query
- `args` - Arguments for this introspection request as for regular query
- `context` - Query context for this introspection request as for regular query
- `info` - Query info for this introspection request as for regular query

### Pick filters from schema visitors
This function creates filters definition from `schemaDirectives` based on static methods in 
`SchemaDirectiveVisitor`s.
```
const filters = schemaDirectivesToFilters(schemaDirectives);
```
- `schemaDirectives` - Set of schemaDirectives provided to `makeExecutableSchema`

## Example with directives
Example filtering schema introspection and checking permissions on fields,
objects and enums with directives

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

#### Make filtered schema
```js
import makeFilteredSchema, { schemaDirectivesToFilters } from 'graphql-introspection-filtering';

const schema = makeFilteredSchema({
   typeDefs,
   resolvers,
   schemaDirectives
});
```

#### AuthenticationDirective 
```js
class AuthenticationDirective extends SchemaDirectiveVisitor {
    static RequiredRole = Symbol('RequiredRole');
    
    _wrappedSymbol = Symbol('wrapped');

    // filter introspection types
    static visitTypeIntrospection(field, _, __, context) {
        return AuthenticationDirective.isAccessible(field, context);
    }

    // filter introspection fields
    static visitFieldIntrospection(field, _, __, context) {
        return AuthenticationDirective.isAccessible(field, context);
    }

    // filter introspection directives
    static visitDirectiveIntrospection({ name }) {
        return name !== 'auth';
    }

    // decide if user has access to the node
    static isAccessible(field, context) {
        const requiredAuthRole = field[AuthenticationDirective.RequiredRole];

        if (requiredAuthRole) {
            if (!context || !context.user || !context.user.roles.includes(requiredAuthRole)) {
                return false;
            }
        }

        return true;
    }
    
    constructor(...args) {
        super(...args);

        this.ensureFieldWrapped = this.ensureFieldWrapped.bind(this);
    }

    ensureFieldWrapped(field) {
        if (field[this._wrappedSymbol]) return;
        field[this._wrappedSymbol] = true;

        const { resolve = defaultFieldResolver } = field;

        field.resolve = this.wrapField.call(this, resolve, field);
    }

    visitObject(obj) {
        this.ensureFieldWrapped(obj);
        obj[AuthenticationDirective.RequiredRole] = this.args.requires;
    }

    visitEnum(en) {
        this.ensureFieldWrapped(en);
        en[AuthenticationDirective.RequiredRole] = this.args.requires;
    }

    visitFieldDefinition(field) {
        this.ensureFieldWrapped(field);
        field[AuthenticationDirective.RequiredRole] = this.args.requires;
    }

    wrapField(resolve, field) {
        return async (root, args, context, info) => {
            if (!AuthenticationDirective.isAccessible(field, context)) {
                throw new Error('Not authorized!');
            }

            return resolve.call(this, root, args, context, info);
        };
    }
}
```

# TODO
* test subscriptions and empty objects
* empty root objects (unions, interfaces)

* split visit intorspection type to object/enum/union/interface/input
* ability to remove self (Directive) from a field/type/enum/etc.
* instantiate class
* split list enhancer field/type/..?

* custom scalars?
* query, mutation, subscription, variable, fragment??
* cleanup unused children
* cleanup children of filtered parent

* test gql 15
* update docs
* unit tests
* test if visitors get all data
* directive test dummy?
* ability to manipulate ast???
* check for privates before snapshot
* mutate description??

# DONE
* inputs, arguments (integration tests)

