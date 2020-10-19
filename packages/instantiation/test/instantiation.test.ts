import { Instantiation, Service, flush_all, flush_singletons } from '../src/instantiation';

describe('Instantiation', () => {
  afterEach(() => {
    flush_all();
  });

  it('should register services', () => {
    @Service()
    class Singleton {
      public static readonly ctor_name = Symbol('Singleton');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Singleton;
    }

    @Service()
    class Scoped {
      public static readonly ctor_name = Symbol('Scoped');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Scoped;
    }

    @Service()
    class Transient {
      public static readonly ctor_name = Symbol('Transient');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Transient;
    }

    const registered_singleton = Instantiation.get_registered_service(Singleton)!;
    const registered_scoped = Instantiation.get_registered_service(Scoped)!;
    const registered_transient = Instantiation.get_registered_service(Transient)!;
    expect(registered_singleton.ctor).toEqual(Singleton);
    expect(registered_scoped.ctor).toEqual(Scoped);
    expect(registered_transient.ctor).toEqual(Transient);
  });

  it('should throw if cyclic dependency is detected', () => {
    @Service()
    class A {
      public static readonly ctor_name = Symbol('A');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Singleton;

      constructor(public a: A) {}
    }
    expect(() => Instantiation.resolve(A)).toThrow();

    @Service()
    class B {
      public static readonly ctor_name = Symbol('B');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Scoped;

      constructor(public b: B) {}
    }
    expect(() => Instantiation.resolve(B)).toThrow();

    @Service()
    class C {
      public static readonly ctor_name = Symbol('C');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Transient;

      constructor(public c: C) {}
    }
    expect(() => Instantiation.resolve(C)).toThrow();
  });

  it('should not use same singleton instances after a flush', () => {
    @Service()
    class A {
      public static readonly ctor_name = Symbol('A');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Singleton;
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
      flush_all();
      expect(() => Instantiation.resolve(A)).toThrow();
      Instantiation.register(A);
      const a = Instantiation.resolve(A);
      expect(a.data.nbr).toBe(1);
    }
  });

  it('should resolve nestled tree consisting of only singletons', () => {
    const fn = jest.fn();
    const call_amount = 4;

    @Service()
    class D {
      public static readonly ctor_name = Symbol('D');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Singleton;

      constructor() {
        fn();
      }
    }

    @Service()
    class C {
      public static readonly ctor_name = Symbol('C');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Singleton;

      constructor() {
        fn();
      }
    }

    @Service()
    class B {
      public static readonly ctor_name = Symbol('B');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Singleton;

      constructor(public readonly c: C, public readonly d: D) {
        fn();
      }
    }

    @Service()
    class A {
      public static readonly ctor_name = Symbol('A');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Singleton;

      constructor(public readonly c: C, public readonly b: B) {
        fn();
      }
    }

    function regardless_of_resolved_order_this_should_not_throw(a: A, b: B, c: C, d: D) {
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

    // Order A -> B -> C -> D
    {
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order A -> B -> D -> C
    flush_singletons();
    fn.mockReset();
    {
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order A -> C -> D -> B
    flush_singletons();
    fn.mockReset();
    {
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order A -> C -> B -> D
    flush_singletons();
    fn.mockReset();
    {
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order A -> D -> B -> C
    flush_singletons();
    fn.mockReset();
    {
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order A -> D -> C -> B
    flush_singletons();
    fn.mockReset();
    {
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> A -> C -> D
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> A -> D -> C
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> C -> A -> D
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> C -> D -> A
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> D -> A -> C
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> D -> C -> A
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> A -> B -> D
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> A -> D -> B
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> B -> A -> D
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> B -> D -> A
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> D -> B -> A
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> D -> A -> B
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> A -> B -> C
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> A -> C -> B
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> B -> C -> A
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> B -> A -> C
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> C -> A -> B
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> C -> B -> A
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }
  });

  it('should resolve nestled tree consisting of only scopes', () => {
    const fn = jest.fn();
    const call_amount = 9;

    @Service()
    class D {
      public static readonly ctor_name = Symbol('D');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Scoped;

      constructor() {
        fn();
      }
    }

    @Service()
    class C {
      public static readonly ctor_name = Symbol('C');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Scoped;

      constructor() {
        fn();
      }
    }

    @Service()
    class B {
      public static readonly ctor_name = Symbol('B');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Scoped;

      constructor(public readonly c: C, public readonly d: D) {
        fn();
      }
    }

    @Service()
    class A {
      public static readonly ctor_name = Symbol('A');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Scoped;

      constructor(public readonly c: C, public readonly b: B) {
        fn();
      }
    }

    function regardless_of_resolved_order_this_should_not_throw(a: A, b: B, c: C, d: D) {
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

    // Order A -> B -> C -> D
    {
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order A -> B -> D -> C
    flush_singletons();
    fn.mockReset();
    {
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order A -> C -> D -> B
    flush_singletons();
    fn.mockReset();
    {
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order A -> C -> B -> D
    flush_singletons();
    fn.mockReset();
    {
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order A -> D -> B -> C
    flush_singletons();
    fn.mockReset();
    {
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order A -> D -> C -> B
    flush_singletons();
    fn.mockReset();
    {
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> A -> C -> D
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> A -> D -> C
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> C -> A -> D
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> C -> D -> A
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> D -> A -> C
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> D -> C -> A
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> A -> B -> D
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> A -> D -> B
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> B -> A -> D
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> B -> D -> A
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> D -> B -> A
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> D -> A -> B
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> A -> B -> C
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> A -> C -> B
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> B -> C -> A
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> B -> A -> C
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> C -> A -> B
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> C -> B -> A
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }
  });

  it('should resolve nestled tree consisting of only transients', () => {
    const fn = jest.fn();
    const call_amount = 10;

    @Service()
    class D {
      public static readonly ctor_name = Symbol('D');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Transient;

      constructor() {
        fn();
      }
    }

    @Service()
    class C {
      public static readonly ctor_name = Symbol('C');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Transient;

      constructor() {
        fn();
      }
    }

    @Service()
    class B {
      public static readonly ctor_name = Symbol('B');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Transient;

      constructor(public readonly c: C, public readonly d: D) {
        fn();
      }
    }

    @Service()
    class A {
      public static readonly ctor_name = Symbol('A');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Transient;

      constructor(public readonly c: C, public readonly b: B) {
        fn();
      }
    }

    function regardless_of_resolved_order_this_should_not_throw(a: A, b: B, c: C, d: D) {
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

    // Order A -> B -> C -> D
    {
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order A -> B -> D -> C
    flush_singletons();
    fn.mockReset();
    {
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order A -> C -> D -> B
    flush_singletons();
    fn.mockReset();
    {
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order A -> C -> B -> D
    flush_singletons();
    fn.mockReset();
    {
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order A -> D -> B -> C
    flush_singletons();
    fn.mockReset();
    {
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order A -> D -> C -> B
    flush_singletons();
    fn.mockReset();
    {
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> A -> C -> D
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> A -> D -> C
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> C -> A -> D
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> C -> D -> A
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> D -> A -> C
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> D -> C -> A
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> A -> B -> D
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> A -> D -> B
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> B -> A -> D
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> B -> D -> A
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> D -> B -> A
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> D -> A -> B
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> A -> B -> C
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> A -> C -> B
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> B -> C -> A
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> B -> A -> C
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> C -> A -> B
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> C -> B -> A
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }
  });

  it('should resolve nestled tree consisting of mixed lifetimes', () => {
    const fn = jest.fn();
    const call_amount = 7;
    let a_count = 0;
    let b_count = 0;
    let c_count = 0;
    let d_count = 0;

    @Service()
    class D {
      public static readonly ctor_name = Symbol('D');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Transient;

      constructor() {
        d_count++;
        fn();
      }
    }

    @Service()
    class C {
      public static readonly ctor_name = Symbol('C');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Singleton;

      constructor() {
        c_count++;
        fn();
      }
    }

    @Service()
    class B {
      public static readonly ctor_name = Symbol('B');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Scoped;

      constructor(public readonly c: C, public readonly d: D) {
        b_count++;
        fn();
      }
    }

    @Service()
    class A {
      public static readonly ctor_name = Symbol('A');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Transient;

      constructor(public readonly c: C, public readonly b: B) {
        a_count++;
        fn();
      }
    }

    function regardless_of_resolved_order_this_should_not_throw(a: A, b: B, c: C, d: D) {
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

    // Order A -> B -> C -> D
    {
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order A -> B -> D -> C
    flush_singletons();
    fn.mockReset();
    {
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order A -> C -> D -> B
    flush_singletons();
    fn.mockReset();
    {
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order A -> C -> B -> D
    flush_singletons();
    fn.mockReset();
    {
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order A -> D -> B -> C
    flush_singletons();
    fn.mockReset();
    {
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order A -> D -> C -> B
    flush_singletons();
    fn.mockReset();
    {
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> A -> C -> D
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> A -> D -> C
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> C -> A -> D
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> C -> D -> A
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> D -> A -> C
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order B -> D -> C -> A
    flush_singletons();
    fn.mockReset();
    {
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> A -> B -> D
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> A -> D -> B
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> B -> A -> D
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const d = Instantiation.resolve(D);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> B -> D -> A
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> D -> B -> A
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order C -> D -> A -> B
    flush_singletons();
    fn.mockReset();
    {
      const c = Instantiation.resolve(C);
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> A -> B -> C
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> A -> C -> B
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> B -> C -> A
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> B -> A -> C
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      const c = Instantiation.resolve(C);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> C -> A -> B
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const a = Instantiation.resolve(A);
      const b = Instantiation.resolve(B);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }

    // Order D -> C -> B -> A
    flush_singletons();
    fn.mockReset();
    {
      const d = Instantiation.resolve(D);
      const c = Instantiation.resolve(C);
      const b = Instantiation.resolve(B);
      const a = Instantiation.resolve(A);
      regardless_of_resolved_order_this_should_not_throw(a, b, c, d);
      expect(fn).toHaveBeenCalledTimes(call_amount);
    }
  });

  it('should replace services', () => {
    @Service()
    class A {
      public static readonly ctor_name = Symbol('A');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Singleton;
      public data = 'og';
    }

    @Service()
    class B {
      public static readonly ctor_name = Symbol('B');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Scoped;
      public data = 'og';
    }

    @Service()
    class C {
      public static readonly ctor_name = Symbol('C');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Transient;
      public data = 'og';
    }

    Instantiation.register(
      class Mock {
        public static ctor_name = A.ctor_name;
        public data = 'a';
      },
      true,
    );
    const a = Instantiation.resolve(A);
    expect(a.data).toEqual('a');

    Instantiation.register(
      class Mock {
        static ctor_name = B.ctor_name;
        public data = 'b';
      },
      true,
    );
    const b = Instantiation.resolve(B);
    expect(b.data).toEqual('b');

    Instantiation.register(
      class Mock {
        static ctor_name = C.ctor_name;
        public data = 'c';
      },
      true,
    );
    const c = Instantiation.resolve(C);
    expect(c.data).toEqual('c');
  });

  it('should resolve singleton with mocked dependency', () => {
    @Service()
    class A {
      public static readonly ctor_name = Symbol('A');
      public static ctor_lifetime = Instantiation.Lifetimes.Singleton;

      public data = 'og';
    }

    @Service()
    class B {
      public static readonly ctor_name = Symbol('B');
      public static ctor_lifetime = Instantiation.Lifetimes.Singleton;
      public data = 'og';

      constructor(public readonly a: A) {}
    }

    class Mock {
      public static readonly ctor_name = A.ctor_name;
      public data = 'replaced';
    }

    Instantiation.register(Mock, true);

    const b = Instantiation.resolve(B);
    expect(b.data).toBe('og');
    expect(b.a.data).toBe('replaced');
  });

  it('should resolve scoped with mocked dependency', () => {
    @Service()
    class A {
      public static readonly ctor_name = Symbol('A');
      public static ctor_lifetime = Instantiation.Lifetimes.Scoped;

      public data = 'og';
    }

    @Service()
    class B {
      public static readonly ctor_name = Symbol('B');
      public static ctor_lifetime = Instantiation.Lifetimes.Scoped;
      public data = 'og';

      constructor(public readonly a: A) {}
    }

    class Mock {
      public static readonly ctor_name = A.ctor_name;
      public data = 'replaced';
    }

    Instantiation.register(Mock, true);

    const b = Instantiation.resolve(B);
    expect(b.data).toBe('og');
    expect(b.a.data).toBe('replaced');
  });

  it('should resolve transient with mocked dependency', () => {
    @Service()
    class A {
      public static ctor_name = Symbol('Dependency');
      public static ctor_lifetime = Instantiation.Lifetimes.Transient;
      public data = 'og';
    }

    @Service()
    class B {
      public static ctor_name = Symbol('Dependent');
      public static ctor_lifetime = Instantiation.Lifetimes.Transient;
      public data = 'og';

      constructor(public a: A) {}
    }

    class Mock {
      public static ctor_name = A.ctor_name;
      public static ctor_lifetime = Instantiation.Lifetimes.Transient;
      public data = 'replaced';
    }

    Instantiation.register(Mock, true);

    const b = Instantiation.resolve(B);
    expect(b.data).toBe('og');
    expect(b.a.data).toBe('replaced');
  });
});
