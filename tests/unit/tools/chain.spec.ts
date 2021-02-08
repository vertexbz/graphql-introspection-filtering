import chain from '../../../src/tools/chain';

describe('chain', () => {
    test('value', () => {
        const result = chain('1234567890', (str) => str.split('').reverse().join(''));

        expect(result).toBe('0987654321');
    });

    test('promise', async () => {
        const promise = new Promise<string>((res) => setTimeout(res, 100, '1234567890'));

        const result = chain(promise, (str) => str.split('').reverse().join(''));
        expect(result).toBeInstanceOf(Promise);

        expect(await result).toBe('0987654321');
    });
});
