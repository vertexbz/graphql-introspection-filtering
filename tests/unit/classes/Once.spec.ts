import Once from '../../../src/classes/Once';
import OnceSession from '../../../src/classes/OnceSession';

jest.useFakeTimers();

describe('Once', () => {
    test('Creates session per context', () => {
        const once = new Once(1000);
        
        const context1 = { ctx: 1 };
        const session1 = once.session(context1);
        const session1b = once.session(context1);

        expect(session1).toBeInstanceOf(OnceSession);
        expect(session1b).toBeInstanceOf(OnceSession);
        expect(session1b).toBe(session1);

        const context2 = { ctx: 2 };
        const session2 = once.session(context2);
        const session2b = once.session(context2);

        expect(session2).toBeInstanceOf(OnceSession);
        expect(session2b).toBeInstanceOf(OnceSession);
        expect(session2b).toBe(session2);

        expect(session1).not.toBe(session2);
    });

    test('Session dies after _cacheTtl', () => {
        const once = new Once(1500);

        const context1 = { ctx: 1 };
        const session1 = once.session(context1);
        const session1b = once.session(context1);

        expect(session1).toBeInstanceOf(OnceSession);
        expect(session1b).toBeInstanceOf(OnceSession);
        expect(session1b).toBe(session1);

        jest.advanceTimersByTime((once as any)._cacheTtl);

        const session1c = once.session(context1);
        expect(session1c).toBeInstanceOf(OnceSession);
        expect(session1c).not.toBe(session1);
    });
});
