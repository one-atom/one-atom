import 'reflect-metadata';
import { Graph } from './_graph';

class Registration<T> {
  constructor(
    public readonly id: Instantiation.Token,
    public readonly ctor: Instantiation.Ctor<T>,
    public readonly settings: {
      lifeTime: Instantiation.Lifetimes;
    },
  ) {
    // Empty
  }
}

class Context {
  public readonly services = new Map<Instantiation.Token, any>();

  constructor() {
    // Empty
  }
}

const globalContext = new Context();

let cachedRegisteredServices = new Map<Instantiation.Token, Registration<any>>();
let cachedSingletonServices = new Map<Instantiation.Token, any>();

export namespace Instantiation {
  export type GenericClassDecorator<T> = (target: T) => void;
  export type Ctor<T> = {
    new (...args: any[]): T;
  };
  export enum Lifetimes {
    Singleton,
    Transient,
    Scoped,
  }
  export type Token<T = any> = Ctor<T> | symbol;

  /**
   * Returns an instance, during the process all of its dependencies will also be created.
   */
  export function resolve<T>(resolvingCtor: Ctor<T>): T {
    if (resolvingCtor === undefined) {
      throw new Error(`Retrieved undefined, this is caused of circular JS imports`);
    }

    const registeredCtor = cachedRegisteredServices.get(resolvingCtor);
    if (registeredCtor === undefined) {
      throw new Error(`ctor is not registered`);
    }

    // WeakMap to hold service references for each service within the branch
    interface Dependencies {
      parentId: Token | null;
      registrationId: Token;
      lifetime: Lifetimes;
    }
    const dependenciesForEachDependency = new Map<Token, Dependencies[]>();

    interface StackElement {
      id: Token;
      parentId: Token | null;
      registrationId: Token;
      lifetime: Lifetimes;
      dependencies: Token[];
    }
    const resolvingDependenciesBranch = new Graph<StackElement>((element) => element.id);

    function createStackElement(dependency: Dependencies): StackElement {
      let id = dependency.registrationId;

      if (dependency.lifetime === Lifetimes.Transient) {
        // For debugging purposes its description is prefix with "$", a way to
        // difference transients from other dependencies
        id = Symbol(`$`);
      }

      return {
        id,
        parentId: dependency.parentId,
        registrationId: dependency.registrationId,
        lifetime: dependency.lifetime,
        dependencies: [],
      };
    }

    const stack: StackElement[] = [
      createStackElement({
        parentId: null,
        registrationId: resolvingCtor,
        lifetime: registeredCtor.settings.lifeTime,
      }),
    ];

    // --------- Branch step ---------

    let cycleCount = 0;
    while (stack.length > 0) {
      // The pop here will always return a value
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const resolvingStackElement = stack.pop()!;

      if (cycleCount++ > 10000) {
        throw new Error('Recursion in branch step');
      }

      const registeredServiceFactory = cachedRegisteredServices.get(resolvingStackElement.registrationId);
      if (registeredServiceFactory === undefined) {
        throw new Error(`${'anonymous'} is not registered`);
      }

      resolvingDependenciesBranch.lookupOrInsertNode(resolvingStackElement);

      // This row is basically the whole magic behind the service resolving logic
      const tokens: Ctor<unknown>[] = Reflect.getMetadata('design:paramtypes', registeredServiceFactory.ctor) ?? [];
      const dependencies: Dependencies[] = tokens.map((dependency) => {
        const registeredDependency = cachedRegisteredServices.get(dependency);
        if (registeredDependency === undefined) {
          throw new Error(`ctor is not registered`);
        }

        return {
          parentId: resolvingStackElement.id,
          registrationId: dependency,
          lifetime: registeredDependency.settings.lifeTime,
        };
      });
      dependenciesForEachDependency.set(registeredServiceFactory.ctor, dependencies);

      for (const dependency of dependencies) {
        resolvingStackElement.dependencies.push(dependency.registrationId);

        const edge: StackElement = createStackElement(dependency);
        resolvingDependenciesBranch.insertEdge(resolvingStackElement, edge);
        stack.push(edge);
      }
    }

    // --------- Producer step ---------

    // Created once per service call
    const resolvedScopedServices = new Map<Token, any>();
    const transientRoot = Symbol('transient_root');
    const resolvedTransientServices = new Map<Token, Array<any>>();

    function retrieveArgs(id: Token): unknown[] {
      const args: unknown[] = [];
      const lookupDependencies = dependenciesForEachDependency.get(id);
      if (lookupDependencies === undefined) {
        return args;
      }

      for (const lookupDependency of lookupDependencies) {
        if (lookupDependency.lifetime === Lifetimes.Singleton) {
          const dependency = cachedSingletonServices.get(lookupDependency.registrationId);
          if (dependency === undefined) {
            throw new Error(`Singleton ${'anonymous'} service has not been resolved yet`);
          }

          args.push(dependency);

          continue;
        }

        if (lookupDependency.lifetime === Lifetimes.Scoped) {
          const alreadyResolvedDependency = resolvedScopedServices.get(lookupDependency.registrationId);
          if (alreadyResolvedDependency === undefined) {
            throw new Error(`Singleton ${'anonymous'} service has not been resolved yet`);
          }

          args.push(alreadyResolvedDependency);

          continue;
        }

        if (lookupDependency.lifetime === Lifetimes.Transient) {
          const parentId = lookupDependency.parentId;
          if (parentId === null) {
            throw new Error('No parentId was found and it should not go through root at this point');
          }

          const transientInstances = resolvedTransientServices.get(parentId) ?? [];
          const registeredCtorBasedOnLookupDependency = cachedRegisteredServices.get(lookupDependency.registrationId);
          if (registeredCtorBasedOnLookupDependency === undefined) {
            throw new Error(`${'anonymous'} is not registered`);
          }

          const findFirstMatchingCtorIndex = transientInstances.findIndex((transientInstance) => {
            if (transientInstance instanceof registeredCtorBasedOnLookupDependency.ctor) return true;

            return false;
          });

          args.push(transientInstances.splice(findFirstMatchingCtorIndex, 1)[0]);

          continue;
        }

        throw new Error(`Argument could not be resolved, no lifetime could be found `);
      }

      return args;
    }

    // Need to recursively go through the branch, from bottom to it has reached
    // the top
    cycleCount = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (cycleCount++ > 10000) {
        throw new Error('Recursion in producer step');
      }

      const edges = resolvingDependenciesBranch.edges();

      if (edges.length === 0) {
        if (!resolvingDependenciesBranch.isEmpty()) {
          throw new Error('Graph contains nodes which never got removed');
        }

        break;
      }

      for (const { data } of edges) {
        const lookupRegistered = cachedRegisteredServices.get(data.registrationId);
        if (lookupRegistered === undefined) {
          throw new Error(`${'anonymous'} is not registered`);
        }

        switch (data.lifetime) {
          case Lifetimes.Singleton: {
            // Check if dependency is already resolved
            const alreadyResolvedService = cachedSingletonServices.get(data.id);
            if (alreadyResolvedService === undefined) {
              cachedSingletonServices.set(data.id, new lookupRegistered.ctor(...retrieveArgs(data.registrationId)));
            }

            break;
          }

          case Lifetimes.Scoped: {
            // Check if dependency is already resolved
            const alreadyResolvedService = resolvedScopedServices.get(data.id);
            if (alreadyResolvedService === undefined) {
              resolvedScopedServices.set(data.id, new lookupRegistered.ctor(...retrieveArgs(data.registrationId)));
            }

            break;
          }

          case Lifetimes.Transient: {
            const parentId = data.parentId ?? transientRoot;
            const shouldCreateStorage = !resolvedTransientServices.has(parentId);
            const resolvedTransientInstance = new lookupRegistered.ctor(...retrieveArgs(data.registrationId));

            if (shouldCreateStorage) {
              resolvedTransientServices.set(parentId, [resolvedTransientInstance]);
            } else {
              // The check has already been done above so it's fine to cast this
              // as a non null
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              resolvedTransientServices.get(parentId)!.push(resolvedTransientInstance);
            }

            break;
          }

          default:
            throw new Error(`The service lacks a lifetime`);
        }

        resolvingDependenciesBranch.removeNode(data.id);
      }
    }

    // --------- Retrieve step ---------

    if (registeredCtor.settings.lifeTime === Lifetimes.Scoped) {
      return resolvedScopedServices.get(resolvingCtor) as T; // Casting as T since by this point it SHOULD be in resolved_scoped_services
    }

    if (registeredCtor.settings.lifeTime === Lifetimes.Transient) {
      const resolvedTransientInstances = resolvedTransientServices.get(transientRoot);
      if (resolvedTransientInstances === undefined) {
        throw new Error(`transient root was never created`);
      }

      return resolvedTransientInstances[0] as T; // Casting as T since by this point the index 0 SHOULD be the requested resolving_ctor instance
    }

    return cachedSingletonServices.get(resolvingCtor) as T; // Casting as T since by this point it SHOULD be in resolved_singleton_services
  }

  interface ReplaceWith<T> {
    useClass?: Ctor<T>;
    lifeTimes?: Lifetimes;
  }
  /**
   * Register a class to be used as a service. If the replace parameter is
   * passed it'll override any previously registered service (works for any lifetime).
   */
  export function register<T>(service: Ctor<T>, replace?: ReplaceWith<any>): void {
    const registeredService = cachedRegisteredServices.get(service);

    if (replace?.useClass) {
      cachedRegisteredServices.set(
        service,
        new Registration(service, replace.useClass, { lifeTime: replace.lifeTimes ?? Lifetimes.Singleton }),
      );

      return;
    }

    if (registeredService === undefined) {
      cachedRegisteredServices.set(
        service,
        new Registration(service, service, { lifeTime: replace?.lifeTimes ?? Lifetimes.Singleton }),
      );
    }
  }

  /**
   * Retrieves the Registration instance for given registered service.
   */
  export function getRegisteredService<T>(service: Ctor<T>): Registration<T> | null {
    const reg = cachedRegisteredServices.get(service);

    return reg ?? null;
  }
}

/**
 * _Due to its destructive nature, never use this in production. It's only good
 * to ensure a reliable test environment._
 *
 * Flushes the ctor registry and all singleton instances.
 */
export function flushAll(): void {
  cachedRegisteredServices = new Map();
  cachedSingletonServices = new Map();
}

/**
 * _Due to its destructive nature, never use this in production. It's only good
 * to ensure a reliable test environment._
 *
 * Flushes all singleton instances.
 */
export function flushSingletons(): void {
  cachedSingletonServices = new Map();
}

/**
 * _Due to its destructive nature, never use this in production. It's only good
 * to ensure a reliable test environment._
 *
 * Flushes the ctor registry.
 */
export function flushRegisteredServices(): void {
  cachedRegisteredServices = new Map();
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
export function Singleton(): Instantiation.GenericClassDecorator<Instantiation.Ctor<any>> {
  return <T>(ctor: Instantiation.Ctor<T>) =>
    Instantiation.register(ctor, {
      lifeTimes: Instantiation.Lifetimes.Singleton,
    });
}

export function Transient(): Instantiation.GenericClassDecorator<Instantiation.Ctor<any>> {
  return <T>(ctor: Instantiation.Ctor<T>) =>
    Instantiation.register(ctor, {
      lifeTimes: Instantiation.Lifetimes.Transient,
    });
}

export function Scoped(): Instantiation.GenericClassDecorator<Instantiation.Ctor<any>> {
  return <T>(ctor: Instantiation.Ctor<T>) =>
    Instantiation.register(ctor, {
      lifeTimes: Instantiation.Lifetimes.Scoped,
    });
}
