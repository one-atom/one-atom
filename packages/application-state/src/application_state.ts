/* eslint-disable @typescript-eslint/ban-ts-comment */

import { DataStruct, ValidStateData } from './data_struct';

type CurrStateFn<T extends ValidStateData> = (curr_state: Omit<DataStruct<T>, 'insert'>) => Partial<T>;

export type Disposer = () => void;

export enum FlowState {
  ACCESSIBLE,
  UNSET,
  PENDING,
  ERROR,
}

export type CurrStateTuple<T> = [Readonly<T>, FlowState];

export interface IState<T extends ValidStateData> {
  flow_state: FlowState;
  in_flow(action: FlowState): void;
  subscribe(event: () => void): Disposer;
  mutate(fn: CurrStateFn<T>): void;
  read(): CurrStateTuple<T>;
}

let ids = 0;

class State<T extends ValidStateData> implements IState<T> {
  public flow_state = FlowState.UNSET;
  private readonly hooks: Map<string, () => void> = new Map();

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

  public peek_state(): Readonly<T> {
    const [state] = this.read();

    return state;
  }

  public in_flow(action: FlowState) {
    this.flow_state = action;

    this.dispatch();
  }

  public mutate(curr_state: CurrStateFn<T>) {
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

export function new_application_state<T extends ValidStateData>(state: T): State<T> {
  return new State<T>(state);
}
