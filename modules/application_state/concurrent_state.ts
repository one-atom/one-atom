/* eslint-disable @typescript-eslint/ban-types */
import { Flow, FlowState } from './flow_state';
import { MutationFn } from './_data_struct';

type Disposer = () => void;

export class ConcurrentState<T extends object> {
  private readonly state: FlowState<T>;
  private suspender: Promise<void> | null = null;
  private error: unknown | null = null;
  private fallback: ((error: unknown) => Promise<T | Error>) | null = null;

  constructor(initialState?: T) {
    this.state = new FlowState({
      initialState,
      designatedFlowState: Flow.UNSET,
    });
  }

  public read(): T {
    if (this.state.flowState === Flow.ACCESSIBLE) {
      return this.state.peekState();
    }

    if (this.state.flowState === Flow.ERROR) {
      throw this.error;
    }

    throw this.createPromise();
  }

  public gracefulDegradation<K extends object>(fallback: (error: unknown) => Promise<T>): void;
  public gracefulDegradation<K extends Error>(fallback: (error: unknown) => Promise<K>): void;
  public gracefulDegradation(fallback: (error: unknown) => Promise<T | Error>): void {
    this.fallback = fallback;
  }

  public suspend<K>(promise: Promise<T>): ConcurrentState<T>;
  public suspend<K>(promise: Promise<K>, parseFn: (data: K) => T): ConcurrentState<T>;
  public suspend<K>(promise: Promise<K>, parseFn?: (data: K) => T): ConcurrentState<T> {
    this.createPromise();
    this.error = null;
    this.state.flowState = Flow.PENDING;

    const writeBlock = (response: K): void => {
      const fn = (): T | K => (parseFn ? parseFn(response) : response);

      try {
        this.state.write(fn);
      } catch (error: unknown) {
        this.state.overwriteData(fn() as T);
        this.state.changeFlowTo(Flow.ACCESSIBLE);
      }
    };

    promise.then(writeBlock, async (error: unknown) => {
      if (!this.fallback) {
        this.error = error;
        this.state.changeFlowTo(Flow.ERROR);

        return;
      }

      try {
        const resolve = await this.fallback(error);
        if (resolve instanceof Error) throw resolve;

        if (!resolve) {
          this.error = error;
          this.state.changeFlowTo(Flow.ERROR);

          return;
        }

        writeBlock((resolve as unknown) as K);
      } catch (fallbackError: unknown) {
        this.error = fallbackError;
        this.state.changeFlowTo(Flow.ERROR);
      }
    });

    return this;
  }

  // TODO
  // This write needs be added to a queue or lock other writes to not have
  // issues with concurrency
  /** @depricated */
  public unsafeWrite(currentState: MutationFn<T>): void {
    this.state.write(currentState);
  }

  // Todo: change this api
  /** @depricated */
  public unsafeRead(): T {
    const [state] = this.state.read();

    return state;
  }

  public subscribe(event: () => void): Disposer {
    return this.state.subscribe(event);
  }

  private createPromise(): Promise<void> {
    if (!this.suspender) {
      this.suspender = new Promise<void>((resolve) => {
        const disposer = this.state.subscribe(() => {
          switch (this.state.flowState) {
            case Flow.UNSET:
            case Flow.PENDING:
              break;
            default: {
              disposer();
              resolve();
              this.suspender = null;
            }
          }
        });
      });
    }

    return this.suspender;
  }
}

export function createConcurrentState<T extends object>(initialState?: T): ConcurrentState<T> {
  const concurrentState = new ConcurrentState<T>(initialState);

  return concurrentState;
}
