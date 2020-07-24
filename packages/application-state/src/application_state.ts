type CurrStateFn<T> = (curr_state: T) => T;

export type Disposer = () => void;

export enum FlowState {
  ACCESSIBLE,
  UNSET,
  PENDING,
  ERROR,
}

export type Wrapped<T> = [Readonly<T>, FlowState];

export interface IState<T> {
  flow_state: FlowState;
  in_flow(action: FlowState): void;
  subscribe(event: () => void): Disposer;
  mutate(fn: CurrStateFn<T>): void;
  read(): Wrapped<T>;
}

let ids = 0;

class State<T> implements IState<T> {
  public flow_state = FlowState.UNSET;
  private readonly hooks: Map<string, () => void> = new Map();

  constructor(private data: T, designatedFlowState?: FlowState) {
    if (Array.isArray(data)) {
    } else if (typeof data === 'object') {
    } else {
      throw new Error('a state can only be represented as an array or object literal');
    }

    if (designatedFlowState !== undefined) this.flow_state = designatedFlowState;
  }

  public read(): Wrapped<T> {
    // The following is purposely being ignored by TypeScript, when the state is
    // not accessible it should deliberately cause an error so a correct
    // behaviour can be written
    switch (this.flow_state) {
      case FlowState.PENDING:
        // @ts-ignore
        return [undefined, FlowState.PENDING];
      case FlowState.UNSET:
        // @ts-ignore
        return [undefined, FlowState.UNSET];
      case FlowState.ERROR:
        // @ts-ignore
        return [undefined, FlowState.ERROR];
      default:
        return [this.data, FlowState.ACCESSIBLE];
    }
  }

  public in_flow(action: FlowState) {
    this.flow_state = action;

    this.dispatch();
  }

  public mutate(curr_state: CurrStateFn<T>) {
    try {
      const new_state = curr_state(this.data);

      this.data = new_state;
      this.flow_state = FlowState.ACCESSIBLE;

      this.dispatch();
    } catch (error) {
      console.error('could not mutate the state');
    }
  }

  public subscribe(event: () => void): Disposer {
    const id = `hook_id_${++ids}`;
    this.hooks.set(id, event);

    return () => {
      this.hooks.delete(id);
    };
  }

  private dispatch() {
    this.hooks.forEach((hook) => hook());
  }
}

export function new_application_state<T extends Array<any> | Object>(state: T): State<T> {
  return new State(state);
}
