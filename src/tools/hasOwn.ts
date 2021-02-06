export default (target: any, prop: string | number | symbol) => Object.prototype.hasOwnProperty.call(target, prop);
