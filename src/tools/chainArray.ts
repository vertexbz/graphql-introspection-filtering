import chain from './chain';
import isPromise from './isPromise';

export default <T = any>(array: T[], fn: (item: T) => T): T[] | Promise<T[]> => {
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
