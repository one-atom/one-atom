import { Instantiation, flushAll, flushSingletons, Singleton, Scoped, Transient } from '../_instantiation';

describe('Instantiation', () => {
  afterEach(() => {
    flushAll();
  });

  it('should register services', () => {
    @Singleton()
    class SingletonService {}

    @Scoped()
    class ScopedService {}

    @Transient()
    class TransientService {}

    const registered_singleton = Instantiation.get_registered_service(SingletonService)!;
    const registered_scoped = Instantiation.get_registered_service(ScopedService)!;
    const registered_transient = Instantiation.get_registered_service(TransientService)!;
    expect(registered_singleton.ctor).toEqual(SingletonService);
    expect(registered_scoped.ctor).toEqual(ScopedService);
    expect(registered_transient.ctor).toEqual(TransientService);
  });

  it('should throw if cyclic dependency is detected', () => {
    @Singleton()
    class A {
      constructor(public a: A) {}
    }
    expect(() => Instantiation.resolve(A)).toThrow();

    @Scoped()
    class B {
      constructor(public b: B) {}
    }
    expect(() => Instantiation.resolve(B)).toThrow();

    @Transient()
    class C {
      constructor(public c: C) {}
    }
    expect(() => Instantiation.resolve(C)).toThrow();
  });

  it('should not use same singleton instances after a flush', () => {
    @Singleton()
    class A {
      public data = {
        nbr: 1,
      };
    }

    {
      const a = Instantiation.resolve(A);
      expect(a.data.nbr).toBe(1);
      a.data.nbr++;
    }

    {
      const a = Instantiation.resolve(A);
      expect(a.data.nbr).toBe(2);
    }

    {
      flushAll();
      expect(() => Instantiation.resolve(A)).toThrow();
      Instantiation.register(A);
      const a = Instantiation.resolve(A);
      expect(a.data.nbr).toBe(1);
    }
  });

  it('should resolve nestled tree consisting of only singletons', () => {
    const fn = jest.fn();
    const call_amount = 4;

    @Singleton()
    class D {
      constructor() {
        fn();
      }
    }

    @Singleton()
    class C {
      constructor() {
        fn();
      }
    }

    @Singleton()
    class B {
      constructor(public readonly c: C, public readonly d: D) {
        fn();
      }
    }

    @Singleton()
    class A {
      constructor(public readonly c: C, public readonly b: B) {
        fn();
      }
    }

    function regardless_of_resolved_order_this_should_not_throw(a: A, b: B, c: C, d: D): void {
      expect(c).toBe(a.c);
      expect(b).toBe(a.b);
      expect(c).toBe(a.b.c);
      expect(d).toBe(a.b.d);
      expect(d).toBe(b.d);
      expect(c).toBe(b.c);

      expect(a).toBeInstanceOf(A);
      expect(a.b).toBeInstanceOf(B);
      expect(a.b.c).toBeInstanceOf(C);
      expect(a.b.d).toBeInstanceOf(D);
      expect(a.c).toBeInstanceOf(C);
      expect(b).toBeInstanceOf(B);
      expect(b.c).toBeInstanceOf(C);
      expect(b.d).toBeInstanceOf(D);
      expect(c).toBeInstanceOf(C);
      expect(d).toBeInstanceOf(D);
    }

    try {
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order A -> B -> C -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order A -> B -> D -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order A -> C -> D -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order A -> C -> B -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order A -> D -> B -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order A -> D -> C -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> A -> C -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> A -> D -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> C -> A -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> C -> D -> A

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> D -> A -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> D -> C -> A

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> A -> B -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> A -> D -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> B -> A -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> B -> D -> A

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> D -> B -> A

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> D -> A -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> A -> B -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> A -> C -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> B -> C -> A

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> B -> A -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> C -> A -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> C -> B -> A

        failed at:
        ${error.message}
      `);
    }
  });

  it('should resolve nestled tree consisting of only scopes', () => {
    const fn = jest.fn();
    const call_amount = 9;

    @Scoped()
    class D {
      constructor() {
        fn();
      }
    }

    @Scoped()
    class C {
      constructor() {
        fn();
      }
    }

    @Scoped()
    class B {
      constructor(public readonly c: C, public readonly d: D) {
        fn();
      }
    }

    @Scoped()
    class A {
      constructor(public readonly c: C, public readonly b: B) {
        fn();
      }
    }

    function regardless_of_resolved_order_this_should_not_throw(a: A, b: B, c: C, d: D): void {
      expect(a.c).toBe(a.b.c);
      expect(b).not.toBe(a.b);
      expect(b.c).not.toBe(a.b.c);
      expect(c).not.toBe(a.b.c);
      expect(d).not.toBe(a.b.d);

      expect(a).toBeInstanceOf(A);
      expect(a.b).toBeInstanceOf(B);
      expect(a.b.c).toBeInstanceOf(C);
      expect(a.b.d).toBeInstanceOf(D);
      expect(a.c).toBeInstanceOf(C);
      expect(b).toBeInstanceOf(B);
      expect(b.c).toBeInstanceOf(C);
      expect(b.d).toBeInstanceOf(D);
      expect(c).toBeInstanceOf(C);
      expect(d).toBeInstanceOf(D);
    }

    try {
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order A -> B -> C -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order A -> B -> D -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order A -> C -> D -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order A -> C -> B -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order A -> D -> B -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order A -> D -> C -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> A -> C -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> A -> D -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> C -> A -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> C -> D -> A

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> D -> A -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> D -> C -> A

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> A -> B -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> A -> D -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> B -> A -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> B -> D -> A

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> D -> B -> A

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> D -> A -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> A -> B -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> A -> C -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> B -> C -> A

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> B -> A -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> C -> A -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> C -> B -> A

        failed at:
        ${error.message}
      `);
    }
  });

  it('should resolve nestled tree consisting of only transients', () => {
    const fn = jest.fn();
    const call_amount = 10;

    @Transient()
    class D {
      constructor() {
        fn();
      }
    }

    @Transient()
    class C {
      constructor() {
        fn();
      }
    }

    @Transient()
    class B {
      constructor(public readonly c: C, public readonly d: D) {
        fn();
      }
    }

    @Transient()
    class A {
      constructor(public readonly c: C, public readonly b: B) {
        fn();
      }
    }

    function regardless_of_resolved_order_this_should_not_throw(a: A, b: B, c: C, d: D): void {
      expect(a.c).not.toBe(a.b.c);
      expect(b).not.toBe(a.b);
      expect(b.c).not.toBe(a.b.c);
      expect(c).not.toBe(a.b.c);
      expect(d).not.toBe(a.b.d);

      expect(a).toBeInstanceOf(A);
      expect(a.b).toBeInstanceOf(B);
      expect(a.b.c).toBeInstanceOf(C);
      expect(a.b.d).toBeInstanceOf(D);
      expect(a.c).toBeInstanceOf(C);
      expect(b).toBeInstanceOf(B);
      expect(b.c).toBeInstanceOf(C);
      expect(b.d).toBeInstanceOf(D);
      expect(c).toBeInstanceOf(C);
      expect(d).toBeInstanceOf(D);
    }

    try {
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order Order A -> B -> C -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order A -> B -> D -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order A -> C -> D -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order A -> C -> B -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order A -> D -> B -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order A -> D -> C -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> A -> C -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> A -> D -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> C -> A -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> C -> D -> A

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> D -> A -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> D -> C -> A

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> A -> B -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> A -> D -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> B -> A -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> B -> D -> A

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> D -> B -> A

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> D -> A -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> A -> B -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> A -> C -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> B -> C -> A

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> B -> A -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> C -> A -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> C -> B -> A

        failed at:
        ${error.message}
      `);
    }
  });

  it('should resolve nestled tree consisting of mixed lifetimes', () => {
    const fn = jest.fn();
    const call_amount = 7;
    let a_count = 0;
    let b_count = 0;
    let c_count = 0;
    let d_count = 0;

    @Transient()
    class D {
      public who = 'd';
      constructor() {
        d_count++;
        fn();
      }
    }

    @Singleton()
    class C {
      public who = 'c';
      public nbr = 0;
      constructor() {
        c_count++;
        fn();
        this.nbr = c_count;
      }
    }

    @Scoped()
    class B {
      public who = 'b';
      constructor(public readonly c: C, public readonly d: D) {
        b_count++;
        fn();
      }
    }

    @Transient()
    class A {
      public who = 'a';
      constructor(public readonly c: C, public readonly b: B) {
        a_count++;
        fn();
      }
    }

    function regardless_of_resolved_order_this_should_not_throw(a: A, b: B, c: C, d: D): void {
      expect(a.c).toBe(a.b.c);
      expect(a.c).toBe(c);
      expect(b.c).toBe(a.b.c);
      expect(b.c).toBe(c);

      expect(a.b.d).not.toBe(b.d);
      expect(a.b.d).not.toBe(d);
      expect(b.d).not.toBe(d);

      expect(a.b).not.toBe(b);

      expect(a).toBeInstanceOf(A);
      expect(a.b).toBeInstanceOf(B);
      expect(a.b.c).toBeInstanceOf(C);
      expect(a.b.d).toBeInstanceOf(D);
      expect(a.c).toBeInstanceOf(C);
      expect(b).toBeInstanceOf(B);
      expect(b.c).toBeInstanceOf(C);
      expect(b.d).toBeInstanceOf(D);
      expect(c).toBeInstanceOf(C);
      expect(d).toBeInstanceOf(D);

      expect(a_count).toEqual(1);
      expect(b_count).toEqual(2);
      expect(c_count).toEqual(1);
      expect(d_count).toEqual(3);
      a_count = 0;
      b_count = 0;
      c_count = 0;
      d_count = 0;
    }

    try {
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order Order A -> B -> C -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order A -> B -> D -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order A -> C -> D -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order A -> C -> B -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order A -> D -> B -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order A -> D -> C -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> A -> C -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> A -> D -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> C -> A -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> C -> D -> A

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> D -> A -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order B -> D -> C -> A

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> A -> B -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> A -> D -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> B -> A -> D

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> B -> D -> A

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> D -> B -> A

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order C -> D -> A -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> A -> B -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> A -> C -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> B -> C -> A

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> B -> A -> C

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> C -> A -> B

        failed at:
        ${error.message}
      `);
    }

    flushSingletons();
    fn.mockReset();
    try {
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    } catch (error) {
      throw new Error(`
        Order D -> C -> B -> A

        failed at:
        ${error.message}
      `);
    }
  });

  it('should replace services', () => {
    @Singleton()
    class A {
      public data = 'og';
    }

    @Scoped()
    class B {
      public data = 'og';
    }

    @Transient()
    class C {
      public data = 'og';
    }

    Instantiation.register(A, {
      useClass: class Mock {
        public data = 'a';
      },
    });
    const a = Instantiation.resolve(A);
    expect(a.data).toEqual('a');

    Instantiation.register(B, {
      useClass: class Mock {
        public data = 'b';
      },
    });
    const b = Instantiation.resolve(B);
    expect(b.data).toEqual('b');

    Instantiation.register(C, {
      useClass: class Mock {
        public data = 'c';
      },
    });
    const c = Instantiation.resolve(C);
    expect(c.data).toEqual('c');
  });

  it('should resolve singleton with mocked dependency', () => {
    @Singleton()
    class A {
      public data = 'og';
    }

    @Singleton()
    class B {
      public data = 'og';

      constructor(public readonly a: A) {}
    }

    Instantiation.register(A, {
      useClass: class Mock {
        public data = 'replaced';
      },
    });

    const b = Instantiation.resolve(B);
    expect(b.data).toBe('og');
    expect(b.a.data).toBe('replaced');
  });

  it('should resolve scoped with mocked dependency', () => {
    @Scoped()
    class A {
      public data = 'og';
    }

    @Scoped()
    class B {
      public data = 'og';

      constructor(public readonly a: A) {}
    }

    Instantiation.register(A, {
      useClass: class Mock {
        public data = 'replaced';
      },
    });

    const b = Instantiation.resolve(B);
    expect(b.data).toBe('og');
    expect(b.a.data).toBe('replaced');
  });

  it('should resolve transient with mocked dependency', () => {
    @Transient()
    class A {
      public data = 'og';
    }

    @Transient()
    class B {
      public data = 'og';

      constructor(public a: A) {}
    }

    Instantiation.register(A, {
      useClass: class Mock {
        public data = 'replaced';
      },
    });

    const b = Instantiation.resolve(B);
    expect(b.data).toBe('og');
    expect(b.a.data).toBe('replaced');
  });
});
