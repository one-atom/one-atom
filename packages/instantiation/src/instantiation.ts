import 'reflect-metadata';
import { Graph } from './graph';

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
let cached_registered_services = new Map<Instantiation.Token, Registration<any>>();
let cached_singleton_services = new Map<Instantiation.Token, any>();

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
  export function resolve<T>(resolving_ctor: Ctor<T>): T {
    if (resolving_ctor === undefined) {
      throw new Error(`Retrieved undefined, this is caused of circular JS imports`);
    }

    const registered_ctor = cached_registered_services.get(resolving_ctor);
    if (registered_ctor === undefined) {
      throw new Error(`ctor is not registered`);
    }

    // WeakMap to hold service references for each service within the branch
    interface Dependencies {
      parentId: Token | null;
      registrationId: Token;
      lifetime: Lifetimes;
    }
    const dependencies_for_each_dependency = new Map<Token, Dependencies[]>();

    interface StackElement {
      id: Token;
      parentId: Token | null;
      registrationId: Token;
      lifetime: Lifetimes;
      dependencies: Token[];
    }
    const resolving_dependencies_branch = new Graph<StackElement>((element) => element.id);

    function create_stack_element(dependency: Dependencies): StackElement {
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
      create_stack_element({
        parentId: null,
        registrationId: resolving_ctor,
        lifetime: registered_ctor.settings.lifeTime,
      }),
    ];

    // --------- Branch step ---------

    let cycle_count = 0;
    while (stack.length > 0) {
      // The pop here will always return a value
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const resolving_stack_element = stack.pop()!;

      if (cycle_count++ > 10000) {
        throw new Error('Recursion in branch step');
      }

      const registered_service_factory = cached_registered_services.get(resolving_stack_element.registrationId);
      if (registered_service_factory === undefined) {
        throw new Error(`${'anonymous'} is not registered`);
      }

      resolving_dependencies_branch.lookup_or_insert_node(resolving_stack_element);

      // This row is basically the whole magic behind the service resolving logic
      const tokens: Ctor<unknown>[] = Reflect.getMetadata('design:paramtypes', registered_service_factory.ctor) ?? [];
      const dependencies: Dependencies[] = tokens.map((dependency) => {
        const registered_dependency = cached_registered_services.get(dependency);
        if (registered_dependency === undefined) {
          throw new Error(`ctor is not registered`);
        }

        return {
          parentId: resolving_stack_element.id,
          registrationId: dependency,
          lifetime: registered_dependency.settings.lifeTime,
        };
      });
      dependencies_for_each_dependency.set(registered_service_factory.ctor, dependencies);

      for (const dependency of dependencies) {
        resolving_stack_element.dependencies.push(dependency.registrationId);

        const edge: StackElement = create_stack_element(dependency);
        resolving_dependencies_branch.insertEdge(resolving_stack_element, edge);
        stack.push(edge);
      }
    }

    // --------- Producer step ---------

    // Created once per service call
    const resolved_scoped_services = new Map<Token, any>();
    const transient_root = Symbol('transient_root');
    const resolved_transient_services = new Map<Token, Array<any>>();

    function retrieve_args(id: Token): unknown[] {
      const args: unknown[] = [];
      const lookup_dependencies = dependencies_for_each_dependency.get(id);
      if (lookup_dependencies === undefined) {
        return args;
      }

      for (const lookup_dependency of lookup_dependencies) {
        if (lookup_dependency.lifetime === Lifetimes.Singleton) {
          const dependency = cached_singleton_services.get(lookup_dependency.registrationId);
          if (dependency === undefined) {
            throw new Error(`Singleton ${'anonymous'} service has not been resolved yet`);
          }

          args.push(dependency);

          continue;
        }

        if (lookup_dependency.lifetime === Lifetimes.Scoped) {
          const already_resolved_dependency = resolved_scoped_services.get(lookup_dependency.registrationId);
          if (already_resolved_dependency === undefined) {
            throw new Error(`Singleton ${'anonymous'} service has not been resolved yet`);
          }

          args.push(already_resolved_dependency);

          continue;
        }

        if (lookup_dependency.lifetime === Lifetimes.Transient) {
          const parentId = lookup_dependency.parentId;
          if (parentId === null) {
            throw new Error('No parentId was found and it should not go through root at this point');
          }

          const transient_instances = resolved_transient_services.get(parentId) ?? [];
          const registered_ctor_based_on_lookup_dependency = cached_registered_services.get(lookup_dependency.registrationId);
          if (registered_ctor_based_on_lookup_dependency === undefined) {
            throw new Error(`${'anonymous'} is not registered`);
          }

          const find_first_matching_ctor_index = transient_instances.findIndex((transient_instance) => {
            if (transient_instance instanceof registered_ctor_based_on_lookup_dependency.ctor) return true;

            return false;
          });

          args.push(transient_instances.splice(find_first_matching_ctor_index, 1)[0]);

          continue;
        }

        throw new Error(`Argument could not be resolved, no lifetime could be found `);
      }

      return args;
    }

    // Need to recursively go through the branch, from bottom to it has reached
    // the top
    cycle_count = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (cycle_count++ > 10000) {
        throw new Error('Recursion in producer step');
      }

      const edges = resolving_dependencies_branch.edges();

      if (edges.length === 0) {
        if (!resolving_dependencies_branch.isEmpty()) {
          throw new Error('Graph contains nodes which never got removed');
        }

        break;
      }

      for (const { data } of edges) {
        const lookup_registered = cached_registered_services.get(data.registrationId);
        if (lookup_registered === undefined) {
          throw new Error(`${'anonymous'} is not registered`);
        }

        switch (data.lifetime) {
          case Lifetimes.Singleton: {
            // Check if dependency is already resolved
            const already_resolved_service = cached_singleton_services.get(data.id);
            if (already_resolved_service === undefined) {
              cached_singleton_services.set(data.id, new lookup_registered.ctor(...retrieve_args(data.registrationId)));
            }

            break;
          }

          case Lifetimes.Scoped: {
            // Check if dependency is already resolved
            const already_resolved_service = resolved_scoped_services.get(data.id);
            if (already_resolved_service === undefined) {
              resolved_scoped_services.set(data.id, new lookup_registered.ctor(...retrieve_args(data.registrationId)));
            }

            break;
          }

          case Lifetimes.Transient: {
            const parent_id = data.parentId ?? transient_root;
            const should_create_storage = !resolved_transient_services.has(parent_id);
            const resolved_transient_instance = new lookup_registered.ctor(...retrieve_args(data.registrationId));

            if (should_create_storage) {
              resolved_transient_services.set(parent_id, [resolved_transient_instance]);
            } else {
              // The check has already been done above so it's fine to cast this
              // as a non null
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              resolved_transient_services.get(parent_id)!.push(resolved_transient_instance);
            }

            break;
          }

          default:
            throw new Error(`The service lacks a lifetime`);
        }

        resolving_dependencies_branch.removeNode(data.id);
      }
    }

    // --------- Retrieve step ---------

    if (registered_ctor.settings.lifeTime === Lifetimes.Scoped) {
      return resolved_scoped_services.get(resolving_ctor) as T; // Casting as T since by this point it SHOULD be in resolved_scoped_services
    }

    if (registered_ctor.settings.lifeTime === Lifetimes.Transient) {
      const resolved_transient_instances = resolved_transient_services.get(transient_root);
      if (resolved_transient_instances === undefined) {
        throw new Error(`transient root was never created`);
      }

      return resolved_transient_instances[0] as T; // Casting as T since by this point the index 0 SHOULD be the requested resolving_ctor instance
    }

    return cached_singleton_services.get(resolving_ctor) as T; // Casting as T since by this point it SHOULD be in resolved_singleton_services
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
    const registered_service = cached_registered_services.get(service);

    if (replace?.useClass) {
      cached_registered_services.set(
        service,
        new Registration(service, replace.useClass, { lifeTime: replace.lifeTimes ?? Lifetimes.Singleton }),
      );

      return;
    }

    if (registered_service === undefined) {
      cached_registered_services.set(
        service,
        new Registration(service, service, { lifeTime: replace?.lifeTimes ?? Lifetimes.Singleton }),
      );
    }
  }

  /**
   * Retrieves the Registration instance for given registered service.
   */
  export function get_registered_service<T>(service: Ctor<T>): Registration<T> | null {
    const reg = cached_registered_services.get(service);

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
  cached_registered_services = new Map();
  cached_singleton_services = new Map();
}

/**
 * _Due to its destructive nature, never use this in production. It's only good
 * to ensure a reliable test environment._
 *
 * Flushes all singleton instances.
 */
export function flushSingletons(): void {
  cached_singleton_services = new Map();
}

/**
 * _Due to its destructive nature, never use this in production. It's only good
 * to ensure a reliable test environment._
 *
 * Flushes the ctor registry.
 */
export function flushRegisteredServices(): void {
  cached_registered_services = new Map();
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
