import { Instantiation, Service } from '../src/instantiation';

describe('Instantiation', () => {
  it('should register and resolve', () => {
    @Service()
    class Cls {
      public static readonly ctor_name = 'E';
    }

    @Service()
    // @ts-ignore
    class ClsFake {
      public static readonly ctor_name = 'E';
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
});
