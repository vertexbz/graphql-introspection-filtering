import isPromise from './isPromise';

/**
 * Executes fn on resolver value or Promise
 * @param valueOrPromise value or promise to chain
 * @param fn function to process value or promises result
 */
export default <T>(valueOrPromise: Promise<T> | T, fn: (v: T) => T) => {
    if (isPromise(valueOrPromise)) {
        const promise = valueOrPromise as Promise<T>;

        return promise.then(fn);
    }

    return fn(valueOrPromise as T);
};
