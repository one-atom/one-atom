/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/ban-types */

import { DataStruct, MutationFn } from './_data_struct';

type Disposer = () => void;

export enum Flow {
  ACCESSIBLE,
  UNSET,
  PENDING,
  ERROR,
}

export type CurrStateTuple<T> = [data: Readonly<T>, flow: Flow];

interface Specification<T> {
  initialState?: T;
  designatedFlowState?: Flow;
}

export class FlowState<T extends object> {
  public error: Error | null = null;
  public flowState: Readonly<Flow> = Flow.UNSET;
  private data: DataStruct<T> | null = null;
  private readonly hooks: Map<symbol, () => void> = new Map();

  constructor({ initialState, designatedFlowState }: Specification<T>) {
    if (designatedFlowState !== undefined) this.flowState = designatedFlowState;

    if (initialState) {
      this.data = new DataStruct(initialState);
    }
  }

  public subscribe(event: () => void): Disposer {
    const id = Symbol();

    this.hooks.set(id, event);

    return () => {
      this.hooks.delete(id);
    };
  }

  // Todo: change this api
  /** @depricated */
  public write(currentState: MutationFn<T>): void {
    if (!this.data) throw new Error('data need to first be set');

    // todo: have this corrolated with concurrent?
    try {
      const newState = currentState(this.data);

      this.data.insert(newState);
      this.error = null;
      this.flowState = Flow.ACCESSIBLE;
      this.dispatch();
    } catch (error) {
      this.error = new Error(`could not mutate the state:\n\n${error}`);
      this.flowState = Flow.ERROR;
      this.dispatch();
    }
  }

  public read(): CurrStateTuple<T> {
    // The following is purposely being ignored by TypeScript, when the state is
    // not accessible it should deliberately cause an error so a correct
    // Behavior can be written
    switch (this.flowState) {
      case Flow.PENDING:
        // @ts-ignore
        return [undefined, this.flowState];
      case Flow.UNSET:
        // @ts-ignore
        return [undefined, this.flowState];
      case Flow.ERROR:
        // @ts-ignore
        return [undefined, this.flowState];
      default: {
        if (!this.data) {
          this.flowState = Flow.UNSET;

          // @ts-ignore
          return [this.flowState, Flow.UNSET];
        }

        return [this.data.extract(), this.flowState];
      }
    }
  }

  public peekState(): Readonly<T> {
    const [state] = this.read();

    return state;
  }

  public changeFlowTo(action: Flow): void {
    this.flowState = action;
    this.dispatch();
  }

  public overwriteData(state: T): void {
    this.data = new DataStruct(state);
  }

  private dispatch(): void {
    this.hooks.forEach((hook) => hook());
  }
}

export function createFlowState<T extends object>(initialState?: T, designatedFlowState?: Flow): FlowState<T> {
  const flowState = new FlowState<T>({
    initialState,
    designatedFlowState,
  });

  return flowState;
}
