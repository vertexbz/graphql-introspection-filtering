import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import createSchemaNoEmptyCommon from '../tests/integration/_mocks_/schemas/common-no-empty-cases';
import createSchemaFiltered from '../tests/integration/_mocks_/schemas/filtered-roots';
import type { Express } from 'express';
import type { GraphQLSchema } from 'graphql';

const PORT = 4000;

const app = express();
const urls: string[] = [];

const testUser = { name: 'Guest', roleProtected: 'GUEST' };
const testMutation = Math.random().toString(16).substr(2);
const testSubscription = Array(40).fill(0).map(() => Math.round(Math.random() * 40));

use(app, '/graphql/common-no-empty-cases/guest', createSchemaNoEmptyCommon(testUser, testMutation, testSubscription, ['GUEST']));
use(app, '/graphql/common-no-empty-cases/user', createSchemaNoEmptyCommon(testUser, testMutation, testSubscription, ['GUEST', 'USER']));
use(app, '/graphql/common-no-empty-cases/admin', createSchemaNoEmptyCommon(testUser, testMutation, testSubscription, ['GUEST', 'USER', 'ADMIN']));

use(app, '/graphql/filtered-cases/guest', createSchemaFiltered(['GUEST']));
use(app, '/graphql/filtered-cases/user', createSchemaFiltered(['GUEST', 'USER']));

app.listen(PORT);
for (const url of urls) {
    // eslint-disable-next-line no-console
    console.log(`Running a GraphQL API server at http://localhost:${PORT}${url}`);
}

function use(app: Express, url: string, schema: GraphQLSchema) {
    urls.push(url);
    app.use(url, graphqlHTTP({ schema, rootValue: null, graphiql: true }));
}
