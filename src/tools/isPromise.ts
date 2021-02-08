export default <T = any>(subject: Promise<T> | T) => {
    return subject instanceof Promise;
};
