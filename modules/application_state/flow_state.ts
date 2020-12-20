/* eslint-disable @typescript-eslint/ban-ts-comment */

import { ValidStateData } from './_data_struct';
import { BaseApplicationState } from './application_state';

export type Disposer = () => void;

export enum Flow {
  ACCESSIBLE,
  UNSET,
  PENDING,
  ERROR,
}

export type CurrStateTuple<T> = [data: Readonly<T>, flow: Flow];

interface Specification<T> {
  state: T;
  designatedFlowState?: Flow;
}

export class FlowState<T extends ValidStateData> extends BaseApplicationState<T> {
  public flowState: Readonly<Flow> = Flow.UNSET;

  constructor({ state, designatedFlowState }: Specification<T>) {
    super(state);

    if (designatedFlowState !== undefined) this.flowState = designatedFlowState;

    this.onBeforeDispatch = () => {
      this.flowState = Flow.ACCESSIBLE;
    };
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
      default:
        return [this.data.extract(), this.flowState];
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
}

export function createFlowState<T extends ValidStateData>(state: T, designatedFlowState?: Flow): FlowState<T> {
  const flowState = new FlowState<T>({
    state,
    designatedFlowState,
  });

  return flowState;
}
