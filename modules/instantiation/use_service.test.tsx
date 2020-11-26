import { Fragment, FC } from 'react';
import { flushAll, useService, Singleton, Scoped } from './mod';
import { render } from '@testing-library/react';

describe('useService', () => {
  afterEach(() => {
    flushAll();
  });

  it('should register and resolve a singleton service', async () => {
    @Singleton()
    class Cls {
      public foo = 'foo';
    }

    const Comp: FC = () => {
      const cls1 = useService(Cls);
      const cls2 = useService(Cls);
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

    const Comp: FC = () => {
      const cls1 = useService(Cls);
      const cls2 = useService(Cls);
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
