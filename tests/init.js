expect.extend({
    toContainOnly(received, expected) {
        const pass = received.every((subject) => subject === expected);

        if (pass) {
            return {
                message: () => (`expected ${this.utils.printReceived(received)} not to contain only ${this.utils.printExpected(expected)}`),
                pass: true
            };
        } else {
            return {
                message: () => (`expected ${this.utils.printReceived(received)} to only ${this.utils.printExpected(expected)}`),
                pass: false
            };
        }
    }
});
