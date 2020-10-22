import React, { Fragment } from 'react';
import { Scoped, flush_all, use_service, Instantiation, Singleton } from '../src';
import { render } from '@testing-library/react';

describe('use_service', () => {
  afterEach(() => {
    flush_all();
  });

  it('should register and resolve a singleton service', async () => {
    @Singleton()
    class Cls {
      public foo = 'foo';
    }

    const Comp: React.FC = () => {
      const cls1 = use_service(Cls);
      const cls2 = use_service(Cls);
      cls1.foo = 'baz';
      cls2.foo = 'bar'; // mutates cls1 since it's the same object

      return (
        <Fragment>
          <div>{cls1.foo}</div>
          <div>{cls2.foo}</div>
        </Fragment>
      );
    };

    const { findAllByText } = render(<Comp />);

    await expect(findAllByText(/bar/)).resolves.toHaveLength(2);
  });

  it('should register and resolve transient service', async () => {
    @Scoped()
    class Cls {
      public foo = 'foo';
    }

    const Comp: React.FC = () => {
      const cls1 = use_service(Cls);
      const cls2 = use_service(Cls);
      cls1.foo = 'baz';
      cls2.foo = 'bar'; // does not mute cls1 since they're two different instanced objects

      return (
        <Fragment>
          <div>{cls1.foo}</div>
          <div>{cls2.foo}</div>
        </Fragment>
      );
    };

    const { findByText } = render(<Comp />);

    await findByText(/baz/);
    await findByText(/bar/);
  });
});
