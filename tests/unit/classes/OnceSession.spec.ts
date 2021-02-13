import OnceSession from '../../../src/classes/OnceSession';

describe('OnceSession', () => {
    test('session started twice', () => {
        const session = new OnceSession();
        session.start();

        expect(() => {
            session.start();
        }).toThrow(Error);
    });

    test('join fresh session', () => {
        const session = new OnceSession();

        expect(session.canJoin).toBeFalsy();
        expect(() => {
            session.join();
        }).toThrow(Error);
    });

    test('join ongoing session', async () => {
        const session = new OnceSession();
        session.start();

        const awaiter = session.join();
        expect(awaiter).toBeInstanceOf(Promise);

        const result = { data: 'blah' };
        session.complete(result);

        expect(await awaiter).toBe(result);

    });
    test('join finished session', () => {
        const session = new OnceSession();
        session.start();

        const result = { data: 'blah' };
        session.complete(result);

        expect(session.join()).toBe(result);
    });
});
