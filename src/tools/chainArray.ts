import chain from './chain';
import isPromise from './isPromise';

/**
 * Maps array of items of given types with `fn` callback,
 * if callback returns promise for eny element,
 * result will be wrapped with `Promise.all`
 *
 * @param array array of values
 * @param fn function to transform values, can return promises
 */
export default <T = any>(array: T[], fn: (item: T) => T | Promise<T>): T[] | Promise<T[]> => {
    const items: any[] = [];

    let promise = false;
    for (const item of array) {
        const chained = chain(item, fn);
        if (isPromise(chained)) {
            promise = true;
        }
        items.push(chained);
    }

    if (promise) {
        return Promise.all(items);
    }

    return items;
};
