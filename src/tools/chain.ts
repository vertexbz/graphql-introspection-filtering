import isPromise from './isPromise';

export default <T>(resultOrPromise: T | Promise<T>, fn: (v: T) => T) => {
    if (isPromise(resultOrPromise)) {
        const promise = resultOrPromise as Promise<T>;

        return promise.then(fn);
    }

    return fn(resultOrPromise as T);
};
