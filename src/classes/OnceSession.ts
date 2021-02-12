export default
class OnceSession {
    protected _awaiters: any[] = [];
    protected _started = false;
    protected _finished = false;
    protected _cache: any;

    get isRunning() {
        return this._started || this._finished;
    }

    public join() {
        if (this._finished) {
            return this._cache;
        }
        if (this._started) {
            return new Promise((res) => this._awaiters.push(res));
        }
    }

    public start() {
        this._started = true;
    }

    public complete(value: any) {
        this._cache = value;
        this._finished = true;
        this._started = false;
        const awaiters = this._awaiters;
        this._awaiters = [];
        setImmediate(() => awaiters.forEach((res) => res(value)));
    }
}
