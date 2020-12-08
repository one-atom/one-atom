import { Fragment, FC } from 'react';
import { flushAll, useService, Singleton, Scoped } from './mod';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { Instantiation, Transient } from './instantiation';

describe('useService', () => {
  afterEach(() => {
    flushAll();
  });

  it('should register and resolve a singleton service', async () => {
    let instances = 0;

    @Singleton()
    class Cls {
      public foo = 'foo';

      constructor() {
        instances++;
      }
    }

    const Comp: FC = () => {
      const [state, setState] = useState(() => 0);
      const cls1 = useService(Cls);
      const cls2 = useService(Cls);
      cls1.foo = 'baz';
      cls2.foo = 'bar'; // mutates cls1 since it's the same object

      function handleClick(): void {
        setState(state + 1);
      }

      return (
        <Fragment>
          <div>{cls1.foo}</div>
          <div>{cls2.foo}</div>
          <button onClick={handleClick}>button</button>
          <div>count: {state}</div>
        </Fragment>
      );
    };

    const { findAllByText, getByText, unmount } = render(<Comp />);

    expect(instances).toBe(1);
    await expect(findAllByText(/bar/)).resolves.toHaveLength(2);
    await waitFor(() => {
      getByText('count: 0');
    });

    fireEvent.click(getByText('button'));
    expect(instances).toBe(1);
    await expect(findAllByText(/bar/)).resolves.toHaveLength(2);
    await waitFor(() => {
      getByText('count: 1');
    });

    unmount();
    render(<Comp />);
    expect(instances).toBe(1);
  });

  it('should register and resolve scoped service', async () => {
    let clsInstances = 0;
    let swappedInstances = 0;

    @Scoped()
    class Cls {
      public foo = 'foo';

      constructor() {
        clsInstances++;
      }
    }

    @Scoped()
    class ClsSwappedStart {
      x = 's';
      constructor() {
        swappedInstances++;
      }
    }

    @Scoped()
    class ClsSwapped {
      x = 'c';
      constructor() {
        swappedInstances++;
      }
    }

    const Comp: FC<{ everyDayProp: string; ctor: Instantiation.Ctor<any> }> = ({ everyDayProp, ctor }) => {
      const [state, setState] = useState(() => 0);
      const cls1 = useService(Cls);
      const cls2 = useService(Cls);
      const _ = useService(ctor);
      cls1.foo = 'baz';
      cls2.foo = 'bar'; // does not mute cls1 since they're two different instanced objects

      function handleClick(): void {
        setState(state + 1);
      }

      return (
        <Fragment>
          {everyDayProp}
          <div>{cls1.foo}</div>
          <div>{cls2.foo}</div>
          <button onClick={handleClick}>button</button>
          <div>count: {state}</div>
          <div>count swapped: {state}</div>
        </Fragment>
      );
    };

    const { findByText, getByText, unmount, rerender } = render(<Comp everyDayProp="bed" ctor={ClsSwappedStart} />);

    expect(clsInstances).toBe(2);
    expect(swappedInstances).toBe(1);
    await findByText(/baz/);
    await findByText(/bar/);
    await waitFor(() => {
      getByText('count: 0');
    });

    fireEvent.click(getByText('button'));
    expect(clsInstances).toBe(2);
    expect(swappedInstances).toBe(1);
    await findByText(/baz/);
    await findByText(/bar/);
    await waitFor(() => {
      getByText('count: 1');
    });

    rerender(<Comp everyDayProp="deb" ctor={ClsSwappedStart} />);
    expect(clsInstances).toBe(2);
    expect(swappedInstances).toBe(1);
    await findByText(/baz/);
    await findByText(/bar/);

    rerender(<Comp everyDayProp="deb" ctor={ClsSwapped} />);
    expect(clsInstances).toBe(2);
    expect(swappedInstances).toBe(2);
    await findByText(/baz/);
    await findByText(/bar/);

    unmount();
    render(<Comp everyDayProp="bed" ctor={ClsSwappedStart} />);
    expect(clsInstances).toBe(4);
    expect(swappedInstances).toBe(3);
  });

  it('should register and resolve transient service', async () => {
    let clsInstances = 0;
    let swappedInstances = 0;

    @Transient()
    class Cls {
      public foo = 'foo';

      constructor() {
        clsInstances++;
      }
    }

    @Transient()
    class ClsSwappedStart {
      x = 's';
      constructor() {
        swappedInstances++;
      }
    }

    @Transient()
    class ClsSwapped {
      x = 'c';
      constructor() {
        swappedInstances++;
      }
    }

    const Comp: FC<{ everyDayProp: string; ctor: Instantiation.Ctor<any> }> = ({ everyDayProp, ctor }) => {
      const [state, setState] = useState(() => 0);
      const cls1 = useService(Cls);
      const cls2 = useService(Cls);
      const _ = useService(ctor);
      cls1.foo = 'baz';
      cls2.foo = 'bar'; // does not mute cls1 since they're two different instanced objects

      function handleClick(): void {
        setState(state + 1);
      }

      return (
        <Fragment>
          {everyDayProp}
          <div>{cls1.foo}</div>
          <div>{cls2.foo}</div>
          <button onClick={handleClick}>button</button>
          <div>count: {state}</div>
          <div>count swapped: {state}</div>
        </Fragment>
      );
    };

    const { findByText, getByText, unmount, rerender } = render(<Comp everyDayProp="bed" ctor={ClsSwappedStart} />);

    expect(clsInstances).toBe(2);
    expect(swappedInstances).toBe(1);
    await findByText(/baz/);
    await findByText(/bar/);
    await waitFor(() => {
      getByText('count: 0');
    });

    fireEvent.click(getByText('button'));
    expect(clsInstances).toBe(2);
    expect(swappedInstances).toBe(1);
    await findByText(/baz/);
    await findByText(/bar/);
    await waitFor(() => {
      getByText('count: 1');
    });

    rerender(<Comp everyDayProp="deb" ctor={ClsSwappedStart} />);
    expect(clsInstances).toBe(2);
    expect(swappedInstances).toBe(1);
    await findByText(/baz/);
    await findByText(/bar/);

    rerender(<Comp everyDayProp="deb" ctor={ClsSwapped} />);
    expect(clsInstances).toBe(2);
    expect(swappedInstances).toBe(2);
    await findByText(/baz/);
    await findByText(/bar/);

    unmount();
    render(<Comp everyDayProp="bed" ctor={ClsSwappedStart} />);
    expect(clsInstances).toBe(4);
    expect(swappedInstances).toBe(3);
  });
});
