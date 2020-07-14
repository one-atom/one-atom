import 'reflect-metadata';

export namespace Instantiation {
  export type Ctor<T> = { new (...args: any[]): T };
  export type GenericClassDecorator<T> = (target: T) => void;
  export interface Specification {}

  const resolved_ctors = new Map<any, any>();

  export function register(service: Instantiation.Ctor<any>, spec?: Specification): void {
    if (spec) return;

    Instantiation.resolve(service);
  }

  export function resolve<T>(ctor: Instantiation.Ctor<T>): T {
    const name = ctor.name;
    const instance = resolved_ctors.get(name);

    if (instance) return instance;

    const tokens: any[] = Reflect.getMetadata('design:paramtypes', ctor) ?? [];
    const injections = tokens.map((token) => resolve<any>(token));
    const resolved = new ctor(...injections);

    resolved_ctors.set(name, resolved);

    return resolved;
  }
}

export function Service(spec?: Instantiation.Specification): Instantiation.GenericClassDecorator<Instantiation.Ctor<any>> {
  return <T>(ctor: Instantiation.Ctor<T>) => Instantiation.register(ctor, spec);
}
