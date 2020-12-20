/* eslint-disable @typescript-eslint/ban-ts-comment */

import { MutationFn, DataStruct, ValidStateData } from './_data_struct';

type Disposer = () => void;
type BeforeDispatchHandler = () => void;

export class BaseApplicationState<T extends ValidStateData> {
  protected readonly data: DataStruct<T>;
  protected readonly hooks: Map<symbol, () => void> = new Map();
  protected onBeforeDispatch: BeforeDispatchHandler | null = null;

  constructor(initialState: T) {
    if (typeof initialState !== 'object') {
      throw new Error('a state can only be represented as an object literal');
    }

    this.data = new DataStruct(initialState);
  }

  public subscribe(event: () => void): Disposer {
    const id = Symbol();

    this.hooks.set(id, event);

    return () => {
      this.hooks.delete(id);
    };
  }

  public write(currentState: MutationFn<T>): void {
    try {
      const newState = currentState(this.data);

      this.data.insert(newState);
      if (this.onBeforeDispatch) this.onBeforeDispatch();
      this.dispatch();
    } catch (error) {
      console.error(`could not mutate the state:\n\n${error}`);
    }
  }

  protected dispatch(): void {
    this.hooks.forEach((hook) => hook());
  }
}

export class ApplicationState<T extends ValidStateData> extends BaseApplicationState<T> {
  constructor(args: T) {
    super(args);
  }

  public read(): Readonly<T> {
    return this.data.extract();
  }
}

export function createApplicationState<T extends ValidStateData>(initialState: T): ApplicationState<T> {
  const applicationState = new ApplicationState<T>(initialState);

  return applicationState;
}
