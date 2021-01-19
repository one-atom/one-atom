/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/ban-types */
import { MutationFn, DataStruct } from './_data_struct';

type Disposer = () => void;

export class ApplicationState<T extends object> {
  private readonly data: DataStruct<T>;
  private readonly hooks: Map<symbol, () => void> = new Map();

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
      this.dispatch();
    } catch (error) {
      console.error(`could not mutate the state:\n\n${error}`);
    }
  }

  public dispatch(): void {
    this.hooks.forEach((hook) => hook());
  }

  public read(): Readonly<T> {
    return this.data.extract();
  }
}

export function createApplicationState<T extends object>(initialState: T): ApplicationState<T> {
  const applicationState = new ApplicationState<T>(initialState);

  return applicationState;
}
