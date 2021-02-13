import OnceSession from './OnceSession';

export default
class Once {
    protected _store = new Map();
    protected _cacheTtl: number;

    constructor(cacheTtl: number) {
        this._cacheTtl = cacheTtl;
    }

    protected newSession() {
        return new OnceSession();
    }

    public session(context: any): OnceSession {
        if (this._store.has(context)) {
            return this._store.get(context);
        }

        const ses = this.newSession();

        this._store.set(context, ses);
        setTimeout(() => this._store.delete(context), this._cacheTtl);
        return ses;
    }
}
