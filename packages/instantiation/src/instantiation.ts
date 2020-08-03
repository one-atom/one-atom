/* eslint-disable @typescript-eslint/no-explicit-any*/

import 'reflect-metadata';

export namespace Instantiation {
  export type Ctor<T> = {
    /**
     * If ctor_name is noy null, the class instance will be persistence. If it's
     * null there's a chance the class instance will end up garbage
     * collected. For instances that should live an entire session, it's
     * recommended to
     */
    ctor_name: string | null;
    new (...args: any[]): T;
  };
  export type GenericClassDecorator<T> = (target: T) => void;
  export interface Specification {
    /* Not implemented */
    independent?: boolean;
  }

  const persistence_ctors = new Map<string, any>();
  const garbage_collectable_ctors = new WeakMap<Ctor<unknown>, any>();

  export function register(service: Instantiation.Ctor<any>, spec?: Specification): void {
    if (spec) return;

    Instantiation.resolve(service);
  }

  export function resolve<T>(ctor: Instantiation.Ctor<T>): T {
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
}

export function Service(spec?: Instantiation.Specification): Instantiation.GenericClassDecorator<Instantiation.Ctor<any>> {
  return <T>(ctor: Instantiation.Ctor<T>) => Instantiation.register(ctor, spec);
}
