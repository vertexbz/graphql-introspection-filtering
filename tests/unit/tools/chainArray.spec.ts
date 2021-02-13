import chainArray from '../../../src/tools/chainArray';

describe('chainArray', () => {
    test('empty', () => {
        const fn = jest.fn((a) => a);

        const result = chainArray([], fn);

        expect(result).toStrictEqual([]);
        expect(fn).not.toBeCalled();
    });

    test('all values', () => {
        const values = [1, 2, 3, 4, 5];

        const impl = (a: number) => a + 10;
        const fn = jest.fn(impl);

        const result = chainArray(values, fn);

        expect(result).toStrictEqual(values.map(impl));
        expect(fn).toBeCalledTimes(values.length);
    });

    test('all promises', async () => {
        const values = [1, 2, 3, 4, 5];

        const impl = (a: number) => Promise.resolve(a + 10);
        const fn = jest.fn(impl);

        const result = chainArray(values, fn);

        expect(result).toBeInstanceOf(Promise);
        expect(await result).toStrictEqual([11, 12, 13, 14, 15]);
        expect(fn).toBeCalledTimes(values.length);
    });

    test('values and promises', async () => {
        const values = [1, 2, 3, 4, 5];

        const impl = (a: number) => {
            if (a % 2 == 0) {
                return a;
            }
            return Promise.resolve(a + 10);
        };
        const fn = jest.fn(impl);

        const result = chainArray(values, fn);

        expect(result).toBeInstanceOf(Promise);
        expect(await result).toStrictEqual([11, 2, 13, 4, 15]);
        expect(fn).toBeCalledTimes(values.length);
    });
});
