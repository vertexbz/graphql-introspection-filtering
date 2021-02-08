import isPromise from './isPromise';

export default <T>(resultOrPromise: Promise<T> | T, fn: (v: T) => T) => {
    if (isPromise(resultOrPromise)) {
        const promise = resultOrPromise as Promise<T>;

        return promise.then(fn);
    }

    return fn(resultOrPromise as T);
};
