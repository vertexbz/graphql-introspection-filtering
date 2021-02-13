import isPromise from '../../../src/tools/isPromise';

describe('isPromise', () => {
    test('is', () => {
        expect(isPromise(Promise.resolve())).toBeTruthy();

        let finish;
        const promise = new Promise((res) => finish = res);
        expect(isPromise(promise)).toBeTruthy();

        // @ts-ignore
        finish(); return promise;
    });

    test('isn\'t', () => {
        expect(isPromise('')).toBeFalsy();
        expect(isPromise('asdasda')).toBeFalsy();
        expect(isPromise(0)).toBeFalsy();
        expect(isPromise(1234)).toBeFalsy();
        expect(isPromise('1234')).toBeFalsy();
        expect(isPromise([])).toBeFalsy();
        expect(isPromise({})).toBeFalsy();
        expect(isPromise(null)).toBeFalsy();
        expect(isPromise(undefined)).toBeFalsy();
    });
});
