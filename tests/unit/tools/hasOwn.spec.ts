import hasOwn from '../../../src/tools/hasOwn';

describe('hasOwn', () => {
    test('has', () => {
        const obj = {
            prop: undefined
        };

        expect(hasOwn(obj, 'prop')).toBeTruthy();
    });

    test('doesn\'t have', () => {
        const obj = {
        };

        expect(hasOwn(obj, 'prop')).toBeFalsy();
    });

    test('in prototype', () => {
        class Cls {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            prop() {
            }
        }

        expect(hasOwn(new Cls(), 'prop')).toBeFalsy();
    });
});
