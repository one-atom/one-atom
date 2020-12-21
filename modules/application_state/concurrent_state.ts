import { Flow, FlowState } from './flow_state';
import { ValidStateData } from './_data_struct';

export class ConcurrentState<T extends ValidStateData> {
  private readonly state: FlowState<T>;
  private suspender: Promise<void> | null = null;
  private error: unknown | null = null;

  constructor(state: T) {
    this.state = new FlowState({
      state,
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

  public suspend<K>(promise: Promise<T>): void;
  public suspend<K>(promise: Promise<K>, parseFn: (data: K) => T): void;
  public suspend<K>(promise: Promise<K>, parseFn?: (data: K) => T): void {
    this.createPromise();
    this.error = null;
    this.state.flowState = Flow.PENDING;

    promise.then(
      (response) => {
        this.state.write(() => (parseFn ? parseFn(response) : response));
      },
      (error: unknown) => {
        this.error = error;
        this.state.changeFlowTo(Flow.ERROR);
      },
    );
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

export function createConcurrentState<T extends ValidStateData>(state: T): ConcurrentState<T> {
  const concurrentState = new ConcurrentState<T>(state);

  return concurrentState;
}
