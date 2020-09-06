import React from 'react';
import { Service, flush_all, use_service } from '../src';
import { render } from '@testing-library/react';

describe('use_service', () => {
  afterEach(() => {
    flush_all();
  });

  it('should register and resolve', async () => {
    @Service()
    class Cls {
      public static readonly ctor_name = Symbol();

      public foo = 'foo';
    }

    const Comp: React.FC = () => {
      const cls = use_service(Cls);

      return <div>{cls.foo}</div>;
    };

    const { findByText } = render(<Comp />);

    await findByText(/foo/);
  });
});
