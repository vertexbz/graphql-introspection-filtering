// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildClientSchema, printSchema } = require('graphql');

module.exports = {
    test(val) {
        return val && val.__schema && typeof val.__schema === 'object';
    },
    serialize(val) {
        return printSchema(buildClientSchema(val));
    }
};
