import OnceSession from './OnceSession';

const CACHE = Symbol('CACHE');

export default
class Once {
    // protected _store = new Map();
    // protected _cacheTtl: number;

    // constructor(cacheTtl: number) {
    //     this._cacheTtl = cacheTtl;
    // }

    protected newSession() {
        return new OnceSession();
    }

    protected getStore(context: any): Map<Once, OnceSession> {
        if (!context[CACHE]) {
            context[CACHE] = new Map();
        }

        return context[CACHE];
    }

    public session(context: any): OnceSession {
        const store = this.getStore(context);
        if (store.has(this)) {
            return store.get(this)!;
        }

        const ses = this.newSession();

        store.set(this, ses);
        // setTimeout(() => this._store.delete(context), this._cacheTtl);
        return ses;
    }
}
