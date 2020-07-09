import 'reflect-metadata';

export namespace Instantiation {
  export type Type<T> = { new (...args: any[]): T };

  export type GenericClassDecorator<T> = (target: T) => void;

  const resolved_ctors = new Map<any, any>();

  export function register(service: Instantiation.Type<any>) {
    Instantiation.resolve(service);
  }

  export function resolve<T>(ctor: Instantiation.Type<T>): T {
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

export function Service(): Instantiation.GenericClassDecorator<Instantiation.Type<any>> {
  return Instantiation.register;
}

export function Extension(): Instantiation.GenericClassDecorator<Instantiation.Type<any>> {
  return Instantiation.register;
}
