export class Timer {
  private disposers = new Map<number, Timer.Disposer>();
  private registered_id: number = 0;

  public wait(callback: Function, duration: number): Timer.Disposer {
    // @ts-ignore TODO fix so node types does not interfere with DOM lib
    const timeout = setTimeout(callback, duration);

    const disposer = () => {
      clearTimeout(timeout);
    };

    return this.register_disposer(disposer);
  }

  public repeat(callback: Function, duration: number, callOnceOnInvoke = false): Timer.Disposer {
    if (callOnceOnInvoke) {
      callback();
    }

    // @ts-ignore TODO fix so node types does not interfere with DOM lib
    const interval = setInterval(callback, duration);

    const disposer = () => {
      clearInterval(interval);
    };

    return this.register_disposer(disposer);
  }

  public flush() {
    this.disposers.forEach((disposer) => disposer());
  }

  private register_disposer(disposer: Timer.Disposer): Timer.Disposer {
    let local_id = this.registered_id++;

    this.disposers.set(local_id, disposer);

    return () => {
      this.disposers.delete(local_id);

      disposer();
    };
  }
}

/**
 * change this
 */
export namespace Timer {
  export type Disposer = () => void;
  type GetArgumentTypes<T extends Function> = T extends (...x: infer argumentsType) => any ? argumentsType : never;

  export function wait(...args: GetArgumentTypes<Timer['wait']>): Disposer {
    const time = new Timer();

    time.wait(...args);

    return time.flush.bind(time);
  }

  export function repeat(...args: GetArgumentTypes<Timer['repeat']>): Disposer {
    const time = new Timer();

    time.repeat(...args);

    return time.flush.bind(time);
  }
}
