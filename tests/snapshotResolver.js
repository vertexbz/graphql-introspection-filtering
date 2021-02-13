// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json');

const gqlVersion = pkg.devDependencies.graphql.split('.').shift().replace(/[^0-9]/, '');

module.exports = {
    // resolves from test to snapshot path
    resolveSnapshotPath: (testPath, snapshotExtension) => {
        const filename = path.basename(testPath) + snapshotExtension;
        const dirname = path.dirname(testPath);
        if (dirname.endsWith('integration')) {
            return path.join(dirname, '__snapshots__', gqlVersion, filename);
        }

        return path.join(dirname, '__snapshots__', filename);
    },

    // resolves from snapshot to test path
    resolveTestPath: (snapshotFilePath, snapshotExtension) => {
        const filename = path.basename(snapshotFilePath, snapshotExtension);
        let dirname = path.dirname(path.dirname(snapshotFilePath));
        if (path.basename(dirname) === '__snapshots__') {
            dirname = path.dirname(dirname);
        }

        return path.join(dirname, filename);
    },

    // Example test path, used for preflight consistency check of the implementation above
    testPathForConsistencyCheck: 'tests/integration/common-cases.spec.ts'
};
