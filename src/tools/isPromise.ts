/**
 * Check whether provided subject is a Promise
 *
 * @param subject value or promise to check
 */
export default <T = any>(subject: Promise<T> | T) => {
    return subject && (subject as Promise<T>).then && typeof (subject as Promise<T>).then === 'function';
};
