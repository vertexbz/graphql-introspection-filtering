/**
 * Manages introspection query request repeated resolutions queue and cache for single field
 */
export default class OnceSession<V = any> {
    protected _awaiters: ((cached: V) => void)[] = [];
    protected _started = false;
    protected _finished = false;
    protected _cache: V | undefined;

    /**
     * Tells whether session can be joined.
     *
     * Returns true is session was started and is running or finished.
     * Returns false if it wasn't started.
     */
    get canJoin(): boolean {
        return this._started || this._finished;
    }

    /**
     * Joins waiting session. If session was already finished session,
     * the result is returned, if session is not finished yet awaiter promise is returned.
     * Attempt to join not started session ends up in error.
     */
    public join(): Promise<V> | V {
        if (this._finished) {
            return this._cache!;
        }
        if (this._started) {
            return new Promise((res) => this._awaiters.push(res));
        }

        throw new Error('Session not started!');
    }

    /**
     * Starts session
     *
     * If session was already stated throws an error.
     */
    public start(): void {
        if (this._started) {
            throw new Error('Session already started!');
        }
        this._started = true;
    }

    /**
     * Completes session and saves it's result for late comers
     *
     * @param value
     */
    public complete(value: V): void {
        this._cache = value;
        this._finished = true;
        this._started = false;
        const awaiters = this._awaiters;
        this._awaiters = [];
        setImmediate(() => awaiters.forEach((res) => res(value)));
    }
}
