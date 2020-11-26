/* eslint-disable @typescript-eslint/ban-ts-comment */

import { DataStruct, ValidStateData } from './_data_struct';

type CurrStateFn<T extends ValidStateData> = (curr_state: Omit<DataStruct<T>, 'insert'>) => Partial<T>;

export type Disposer = () => void;

export enum FlowState {
  ACCESSIBLE,
  UNSET,
  PENDING,
  ERROR,
}

export type CurrStateTuple<T> = [Readonly<T>, FlowState];

let ids = 0;
const GLOBAL_HOOK = '__ONE_ATOM_APPLICATION_STATE_GLOBAL_HOOK__';

//@ts-ignore
if (window) {
  //@ts-ignore
  window[GLOBAL_HOOK] = window[GLOBAL_HOOK] || {};
}

export class State<T extends ValidStateData> {
  public readonly id = `hook_id_${++ids}`;
  public flow_state = FlowState.UNSET;
  private readonly hooks: Map<symbol, () => void> = new Map();

  private readonly data: DataStruct<T>;

  constructor(data: T, designatedFlowState?: FlowState) {
    if (typeof data !== 'object') {
      throw new Error('a state can only be represented as object literal');
    }

    this.data = new DataStruct(data);

    if (designatedFlowState !== undefined) this.flow_state = designatedFlowState;
  }

  public read(): CurrStateTuple<T> {
    // The following is purposely being ignored by TypeScript, when the state is
    // not accessible it should deliberately cause an error so a correct
    // Behavior can be written
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
        return [this.data.extract(), FlowState.ACCESSIBLE];
    }
  }

  public peekState(): Readonly<T> {
    const [state] = this.read();

    return state;
  }

  public inFlow(action: FlowState): void {
    this.flow_state = action;

    this.dispatch();
  }

  public mutate(curr_state: CurrStateFn<T>): void {
    try {
      const new_state = curr_state(this.data);

      this.data.insert(new_state);
      this.flow_state = FlowState.ACCESSIBLE;

      this.dispatch();
    } catch (error) {
      console.error(`could not mutate the state:\n\n${error}`);
    }
  }

  public subscribe(event: () => void): Disposer {
    const id = Symbol();

    this.hooks.set(id, event);

    return () => {
      this.hooks.delete(id);
    };
  }

  private dispatch(): void {
    this.hooks.forEach((hook) => hook());
  }
}

export function newApplicationState<T extends ValidStateData>(state: T): State<T> {
  const application_state = new State<T>(state);

  //@ts-ignore
  if (window) {
    //@ts-ignore
    window[GLOBAL_HOOK][application_state.id] = application_state;
  }

  return application_state;
}
