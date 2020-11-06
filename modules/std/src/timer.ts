/* eslint-disable @typescript-eslint/no-explicit-any*/

type AnyFunction = (args?: any) => any;

export class Timer {
  private disposers = new Map<number, Timer.Disposer>();
  private registered_id = 0;

  public wait(callback: AnyFunction, duration: number): Timer.Disposer {
    const timeout = setTimeout(callback, duration);

    const disposer = () => {
      clearTimeout(timeout);
    };

    return this.register_disposer(disposer);
  }

  public repeat(callback: AnyFunction, duration: number, callOnceOnInvoke = false): Timer.Disposer {
    if (callOnceOnInvoke) {
      callback();
    }

    const interval = setInterval(callback, duration);

    const disposer = () => {
      clearInterval(interval);
    };

    return this.register_disposer(disposer);
  }

  public flush(): void {
    this.disposers.forEach((disposer) => disposer());
  }

  private register_disposer(disposer: Timer.Disposer): Timer.Disposer {
    const local_id = this.registered_id++;

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
  type GetArgumentTypes<T> = T extends (...x: infer argumentsType) => any ? argumentsType : never;

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
