import { Instantiation, Service, flush_all } from '../src/instantiation';

describe('Instantiation', () => {
  afterEach(() => {
    flush_all();
  });

  it('should register and resolve', () => {
    @Service()
    class Cls {
      public static readonly ctor_name = Symbol('E');
    }

    @Service()
    // @ts-ignore
    class ClsFake {
      public static readonly ctor_name = Symbol('E');
    }

    @Service()
    class ClsTransient {
      public static readonly ctor_name = Symbol('E');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Transient;
      constructor(public readonly clsRef: Cls) {}
    }

    Instantiation.register(Cls);
    const cls1 = Instantiation.resolve(Cls);
    const cls2 = Instantiation.resolve(Cls);
    expect(cls1).not.toBeInstanceOf(ClsFake);
    expect(cls1).toBeInstanceOf(Cls);
    expect(cls1).toBe(cls2);

    Instantiation.register(ClsTransient);
    const clsTransient1 = Instantiation.resolve(ClsTransient);
    const clsTransient2 = Instantiation.resolve(ClsTransient);
    expect(clsTransient1).toBeInstanceOf(ClsTransient);
    expect(clsTransient1.clsRef).toBeInstanceOf(Cls);
    expect(clsTransient1.clsRef).toBe(cls2);
    expect(clsTransient2).toBeInstanceOf(ClsTransient);
    expect(clsTransient1).not.toBe(clsTransient2); // should be unique
  });

  it('should not use same instances after a flush', () => {
    @Service()
    class Cls {
      public static readonly ctor_name = Symbol('E');
      public data = {
        nbr: 1,
      };
    }

    const instance1 = Instantiation.resolve(Cls);
    expect(instance1.data.nbr).toBe(1);
    instance1.data.nbr++;

    const instance2 = Instantiation.resolve(Cls);
    expect(instance2.data.nbr).toBe(2);

    flush_all();
    const instance3 = Instantiation.resolve(Cls);
    expect(instance3.data.nbr).toBe(1);
  });

  it('should replace services', () => {
    @Service()
    class ClsSingleton {
      public static readonly ctor_name = Symbol('E');
      public data = 'og';
    }

    @Service()
    class ClsTransient {
      public static readonly ctor_name = Symbol('E');
      public static readonly ctor_lifetime = Instantiation.Lifetimes.Transient;
      public data = 'og';
    }

    Instantiation.register(
      class Mock {
        static ctor_name = ClsSingleton.ctor_name;
        data = 'replaced';
      },
      true,
    );
    const instance1 = Instantiation.resolve(ClsSingleton);
    expect(instance1.data).toEqual('replaced');

    Instantiation.register(
      class Mock {
        static ctor_name = ClsTransient.ctor_name;
        data = 'replaced';
      },
      true,
    );
    const instance2 = Instantiation.resolve(ClsSingleton);
    expect(instance2.data).toEqual('replaced');
  });
});
