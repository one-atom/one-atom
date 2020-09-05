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
    class ClsGarb {
      public static readonly ctor_name = null;

      constructor(public readonly clsRef: Cls) {}
    }

    Instantiation.register(Cls);
    expect(Instantiation.resolve(Cls)).not.toBeInstanceOf(ClsFake);
    expect(Instantiation.resolve(Cls)).toBeInstanceOf(Cls);

    Instantiation.register(ClsGarb);
    const clsGarb = Instantiation.resolve(ClsGarb);
    expect(clsGarb).toBeInstanceOf(ClsGarb);
    expect(clsGarb.clsRef).toBeInstanceOf(Cls);
  });

  it('should not use same instances after a flush', () => {
    @Service()
    class Cls {
      public static readonly ctor_name = Symbol('E');
      public data = {
        nbr: 1,
      };
    }

    const instant1 = Instantiation.resolve(Cls);
    expect(instant1.data.nbr).toBe(1);
    instant1.data.nbr++;

    const instant2 = Instantiation.resolve(Cls);
    expect(instant2.data.nbr).toBe(2);

    flush_all();
    const instant3 = Instantiation.resolve(Cls);
    expect(instant3.data.nbr).toBe(1);
  });
});
