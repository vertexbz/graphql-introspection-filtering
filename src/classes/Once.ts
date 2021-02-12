import OnceSession from './OnceSession';

export default
class Once {
    protected _store = new Map();
    protected static _ttl = 5000;

    protected newSession() {
        return new OnceSession();
    }

    public session(context: any): OnceSession {
        if (this._store.has(context)) {
            return this._store.get(context);
        }

        const ses = this.newSession();

        this._store.set(context, ses);
        setTimeout(() => this._store.delete(context), (this.constructor as typeof Once)._ttl);
        return ses;
    }
}
