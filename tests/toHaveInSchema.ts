// eslint-disable-next-line @typescript-eslint/no-var-requires
import { buildClientSchema, printSchema } from 'graphql';
import type { IntrospectionQuery } from 'graphql';


declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace jest {
        interface Matchers<R> {
            toHaveInSchema(expected: string | RegExp): R;
        }
    }
}

const cache = new Map();
const getStringForSchema = (schema: IntrospectionQuery) => {
    if (cache.has(schema)) {
        return cache.get(schema);
    }

    const str = String(printSchema(buildClientSchema(schema)));
    cache.set(schema, str);
    return str;
};

expect.extend({
    toHaveInSchema(received: IntrospectionQuery, expected: string | RegExp) {
        const schema = getStringForSchema(received);

        const pass = schema.match(expected); // todo improve

        if (pass) {
            return {
                message: () => (`expected that provided schema not to contain ${this.utils.printExpected(expected)}`),
                pass: true
            };
        } else {
            return {
                message: () => (`expected that provided schema to contain ${this.utils.printExpected(expected)}`),
                pass: false
            };
        }
    }
});
