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
const registeredServices = new Map<Instantiation.Token, Registration<any>>();

class Context<T> {
  private readonly instances = new Map<Instantiation.Token, T>();

  public drop(): void {
    this.instances.clear();
  }

  public isInstanced(token: Instantiation.Token): boolean {
    return this.instances.has(token);
  }

  public retrieve(token: Instantiation.Token): T | undefined {
    return this.instances.get(token);
  }

  public add(key: Instantiation.Token, value: T): void {
    this.instances.set(key, value);
  }
}
const globalContext = new Context<any>();

const metaData = new Map<Instantiation.Token, Instantiation.Ctor<unknown>[]>();

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

  export function __registerMetaData(token: Token, deps: Ctor<unknown>[]): void {
    metaData.set(token, deps);
  }

  export function __getMetadata(token: Token): Ctor<unknown>[] {
    return metaData.get(token) ?? [];
  }

  let __customLookUp: ((token: any) => any) | undefined = undefined;
  export function __setCustomLookUp(fn: (token: any) => any): void {
    __customLookUp = fn;
  }

  /**
   * Returns an instance, during the process all of its dependencies will also be created.
   */
  export function resolve<T>(resolvingCtor: Ctor<T>): T {
    if (resolvingCtor === undefined) {
      throw new Error(`Retrieved undefined, this is caused of circular JS imports`);
    }

    const registeredCtor = registeredServices.get(resolvingCtor);
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

      const registeredServiceFactory = registeredServices.get(resolvingStackElement.registrationId);
      if (registeredServiceFactory === undefined) {
        throw new Error(`${'anonymous'} is not registered`);
      }

      resolvingDependenciesBranch.lookupOrInsertNode(resolvingStackElement);

      // This row is basically the whole magic behind the service resolving logic
      const tokens: Ctor<unknown>[] = __customLookUp
        ? __customLookUp(registeredServiceFactory.ctor)
        : __getMetadata(registeredServiceFactory.ctor);
      const dependencies: Dependencies[] = tokens.map((dependency) => {
        const registeredDependency = registeredServices.get(dependency);
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
    const transientRoot = Symbol('transient_root');
    const resolvedScopedServices = new Context<any>();
    const resolvedTransientServices = new Context<Array<any>>();

    function retrieveArgs(id: Token): unknown[] {
      const args: unknown[] = [];
      const lookupDependencies = dependenciesForEachDependency.get(id);
      if (lookupDependencies === undefined) {
        return args;
      }

      for (const lookupDependency of lookupDependencies) {
        if (lookupDependency.lifetime === Lifetimes.Singleton) {
          const dependency = globalContext.retrieve(lookupDependency.registrationId);
          if (dependency === undefined) {
            throw new Error(`Singleton ${'anonymous'} service has not been resolved yet`);
          }

          args.push(dependency);

          continue;
        }

        if (lookupDependency.lifetime === Lifetimes.Scoped) {
          const alreadyResolvedDependency = resolvedScopedServices.retrieve(lookupDependency.registrationId);
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

          const transientInstances = resolvedTransientServices.retrieve(parentId) ?? [];
          const registeredCtorBasedOnLookupDependency = registeredServices.get(lookupDependency.registrationId);
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
        const lookupRegistered = registeredServices.get(data.registrationId);
        if (lookupRegistered === undefined) {
          throw new Error(`${'anonymous'} is not registered`);
        }

        switch (data.lifetime) {
          case Lifetimes.Singleton: {
            // Check if dependency is already resolved
            const alreadyResolvedService = globalContext.retrieve(data.id);
            if (alreadyResolvedService === undefined) {
              globalContext.add(data.id, new lookupRegistered.ctor(...retrieveArgs(data.registrationId)));
            }

            break;
          }

          case Lifetimes.Scoped: {
            // Check if dependency is already resolved
            const alreadyResolvedService = resolvedScopedServices.retrieve(data.id);
            if (alreadyResolvedService === undefined) {
              resolvedScopedServices.add(data.id, new lookupRegistered.ctor(...retrieveArgs(data.registrationId)));
            }

            break;
          }

          case Lifetimes.Transient: {
            const parentId = data.parentId ?? transientRoot;
            const shouldCreateStorage = !resolvedTransientServices.isInstanced(parentId);
            const resolvedTransientInstance = new lookupRegistered.ctor(...retrieveArgs(data.registrationId));

            if (shouldCreateStorage) {
              resolvedTransientServices.add(parentId, [resolvedTransientInstance]);
            } else {
              // The check has already been done above so it's fine to cast this
              // as a non null
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              resolvedTransientServices.retrieve(parentId)!.push(resolvedTransientInstance);
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
      return resolvedScopedServices.retrieve(resolvingCtor) as T; // Casting as T since by this point it SHOULD be in resolved_scoped_services
    }

    if (registeredCtor.settings.lifeTime === Lifetimes.Transient) {
      const resolvedTransientInstances = resolvedTransientServices.retrieve(transientRoot);
      if (resolvedTransientInstances === undefined) {
        throw new Error(`transient root was never created`);
      }

      return resolvedTransientInstances[0] as T; // Casting as T since by this point the index 0 SHOULD be the requested resolving_ctor instance
    }

    return globalContext.retrieve(resolvingCtor) as T; // Casting as T since by this point it SHOULD be in resolved_singleton_services
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
    const registeredService = registeredServices.get(service);

    if (replace?.useClass) {
      registeredServices.set(
        service,
        new Registration(service, replace.useClass, { lifeTime: replace.lifeTimes ?? Lifetimes.Singleton }),
      );

      return;
    }

    if (registeredService === undefined) {
      registeredServices.set(service, new Registration(service, service, { lifeTime: replace?.lifeTimes ?? Lifetimes.Singleton }));
    }
  }

  /**
   * Retrieves the Registration instance for given registered service.
   */
  export function getRegisteredService<T>(service: Ctor<T>): Registration<T> | null {
    const reg = registeredServices.get(service);

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
  globalContext.drop();
  registeredServices.clear();
}

/**
 * _Due to its destructive nature, never use this in production. It's only good
 * to ensure a reliable test environment._
 *
 * Flushes all singleton instances.
 */
export function flushSingletons(): void {
  globalContext.drop();
}

/**
 * _Due to its destructive nature, never use this in production. It's only good
 * to ensure a reliable test environment._
 *
 * Flushes the ctor registry.
 */
export function flushRegisteredServices(): void {
  registeredServices.clear();
}

/**
 * Registers a class as a service with a Singleton lifetime.
 */
export function Singleton(): Instantiation.GenericClassDecorator<Instantiation.Ctor<any>> {
  return <T>(ctor: Instantiation.Ctor<T>) =>
    Instantiation.register(ctor, {
      lifeTimes: Instantiation.Lifetimes.Singleton,
    });
}

/**
 * Registers a class as a service with a Transient lifetime.
 */
export function Transient(): Instantiation.GenericClassDecorator<Instantiation.Ctor<any>> {
  return <T>(ctor: Instantiation.Ctor<T>) =>
    Instantiation.register(ctor, {
      lifeTimes: Instantiation.Lifetimes.Transient,
    });
}

/**
 * Registers a class as a service with a Scoped lifetime.
 */
export function Scoped(): Instantiation.GenericClassDecorator<Instantiation.Ctor<any>> {
  return <T>(ctor: Instantiation.Ctor<T>) =>
    Instantiation.register(ctor, {
      lifeTimes: Instantiation.Lifetimes.Scoped,
    });
}
