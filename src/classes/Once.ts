import { ONCE_CACHE } from '../constants';
import OnceSession from './OnceSession';

/**
 * Resolves (and creates when needed) introspection query session managers from current request
 */
export default class Once<C> {
    /**
     * Creates new session manager
     * @protected
     */
    protected newSession(): OnceSession {
        return new OnceSession();
    }

    /**
     * Extracts store from given queryContext (operation context)
     * @param queryContext
     * @protected
     */
    protected getStore(queryContext: C): Map<Once<C>, OnceSession> {
        if (!(queryContext as any)[ONCE_CACHE]) {
            (queryContext as any)[ONCE_CACHE] = new Map();
        }

        return (queryContext as any)[ONCE_CACHE];
    }

    /**
     * Resolve session manager for given queryContext (operation context)
     * @param queryContext
     */
    public session(queryContext: C): OnceSession {
        const store = this.getStore(queryContext);
        if (store.has(this)) {
            return store.get(this)!;
        }

        const ses = this.newSession();

        store.set(this, ses);
        return ses;
    }
}
