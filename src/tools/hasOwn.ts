/**
 * Object.prototype.hasOwnProperty helper
 *
 * @param target object
 * @param prop expected property
 */
export default (target: any, prop: string | number | symbol) => Object.prototype.hasOwnProperty.call(target, prop);
