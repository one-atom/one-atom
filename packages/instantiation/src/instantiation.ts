/* eslint-disable @typescript-eslint/no-explicit-any*/

import 'reflect-metadata';

let persistence_ctors = new Map<symbol, any>();
let garbage_collectable_ctors = new WeakMap<Instantiation.Ctor<unknown>, any>();

export namespace Instantiation {
  export type Ctor<T> = {
    /**
     * If ctor_name is noy null, the class instance will be persistence. If it's
     * null there's a chance the class instance will end up garbage
     * collected. For instances that should live an entire session, it's
     * recommended to.
     */
    ctor_name: symbol | null;
    new (...args: any[]): T;
  };
  export type GenericClassDecorator<T> = (target: T) => void;
  export interface Specification {
    /* Not implemented */
    independent?: boolean;
  }

  /**
   * Returns an instance, during the process all of its dependencies will also be created
   */
  export function resolve<T>(ctor: Ctor<T>): T {
    if (ctor === undefined) {
      throw new Error(`Retrieved undefined, this is caused of circular JS imports`);
    }

    const name = ctor.ctor_name;
    const instance = name !== null ? persistence_ctors.get(name) : garbage_collectable_ctors.get(ctor);

    if (instance) return instance;

    const tokens: any[] = Reflect.getMetadata('design:paramtypes', ctor) ?? [];
    const injections = tokens.map((token) => resolve<any>(token));
    const resolved = new ctor(...injections);

    if (name !== null) {
      persistence_ctors.set(name, resolved);
    } else {
      garbage_collectable_ctors.set(ctor, resolved);
    }

    return resolved;
  }

  /** @internal */
  export function register(service: Ctor<any>, spec?: Specification): void {
    if (spec) return;

    Instantiation.resolve(service);
  }
}

/**
 * Due to its destructive nature, never use this in production. It's only good
 * to ensure a reliable test environment.
 */
export function flush_all(): void {
  persistence_ctors = new Map();
  garbage_collectable_ctors = new WeakMap();
}

/**
 * Marking a class with `@Service` ensures that the compiler will generate the necessary metadata to create the class's dependencies when the class is instantized.
 *
 * The marked class must have a public static property `ctor_name`. It ensure
 * that scrambled and minified code will resolve into the correct instance.
 * Setting it to `null` will result that the marked class may only be resolved
 * using the object reference.
 *
 * To ensure that the instance won't be garbage collected, set `ctor_name` to a unique value.
 */
export function Service(spec?: Instantiation.Specification): Instantiation.GenericClassDecorator<Instantiation.Ctor<any>> {
  return <T>(ctor: Instantiation.Ctor<T>) => Instantiation.register(ctor, spec);
}
