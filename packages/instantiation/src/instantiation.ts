/* eslint-disable @typescript-eslint/no-explicit-any*/

import 'reflect-metadata';

let registered_singletons = new Map<symbol, any>();

export namespace Instantiation {
  export type Ctor<T> = {
    /**
     * If ctor_name is noy null, the class instance will be persistence. If it's
     * null there's a chance the class instance will end up garbage
     * collected. For instances that should live an entire session, it's
     * recommended to.
     */
    ctor_name: symbol;
    ctor_lifetime?: Lifetimes;
    new (...args: any[]): T;
  };
  export type GenericClassDecorator<T> = (target: T) => void;
  export interface Specification {
    /* Not implemented */
    independent?: boolean;
  }
  export enum Lifetimes {
    Singleton,
    Transient,
  }

  /**
   * Returns an instance, during the process all of its dependencies will also be created.
   */
  export function resolve<T>(ctor: Ctor<T>, replace = false): T {
    if (ctor === undefined) {
      throw new Error(`Retrieved undefined, this is caused of circular JS imports`);
    }

    let resolved: T;
    const name = ctor.ctor_name;
    const lifetime = ctor.ctor_lifetime ?? Lifetimes.Singleton;

    // If replace is present it's a mocked service
    if (!replace) {
      if (lifetime === Lifetimes.Singleton) {
        const instance = registered_singletons.get(name);
        if (instance) return instance;
      }

      const tokens: any[] = Reflect.getMetadata('design:paramtypes', ctor) ?? [];
      const injections = tokens.map((token) => resolve<any>(token));
      resolved = new ctor(...injections);

      if (lifetime === Lifetimes.Singleton) {
        registered_singletons.set(name, resolved);
      }
    } else {
      resolved = new ctor();
      registered_singletons.set(name, resolved);
    }

    return resolved;
  }

  /**
   * Register a class to be used as a service. If the replace parameter is
   * passed it'll override any previously registered service (works for any lifetime).
   */
  export function register(service: Ctor<any>, replace = false): void {
    Instantiation.resolve(service, replace);
  }
}

/**
 * Due to its destructive nature, never use this in production. It's only good
 * to ensure a reliable test environment.
 */
export function flush_all(): void {
  registered_singletons = new Map();
}

/**
 * Marking a class with `@Service` ensures that the compiler will generate the necessary metadata to create the class's dependencies when the class is instantized.
 *
 * The marked class must have a public static property `ctor_name`. It ensure
 * that scrambled and minified code will resolve into the correct instance.
 *
 * By default a service has a Lifetime set to Singleton. This can be changed by
 * declaring a public static property `ctor_lifetime` set to e.g. Transient.
 */
export function Service(): Instantiation.GenericClassDecorator<Instantiation.Ctor<any>> {
  return <T>(ctor: Instantiation.Ctor<T>) => Instantiation.register(ctor);
}
