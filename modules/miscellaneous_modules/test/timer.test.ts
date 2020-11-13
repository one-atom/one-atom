import { Timer } from '../timer';

describe('Timer', () => {
  jest.useFakeTimers();

  it('should be able to use top level "wait" api', () => {
    const fn = jest.fn();

    Timer.wait(fn, 1000);

    expect(fn).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(fn).toHaveBeenCalled();
  });

  it('should be able to use top level disposer from "wait"', () => {
    const fn = jest.fn();

    const disposer = Timer.wait(fn, 1000);

    expect(fn).not.toHaveBeenCalled();

    disposer();
    jest.runAllTimers();

    expect(fn).not.toHaveBeenCalled();
  });

  it('should be able to use top level "repeat" api', () => {
    const fn = jest.fn();

    Timer.repeat(fn, 1000);

    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(3000);

    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should be able to use top level disposer from "repeat"', () => {
    const fn = jest.fn();

    const disposer = Timer.repeat(fn, 1000);

    expect(fn).not.toHaveBeenCalled();

    disposer();
    jest.advanceTimersByTime(3000);

    expect(fn).not.toHaveBeenCalled();
  });

  it('should be able to use top level invoke call from "repeat"', () => {
    const fn = jest.fn();

    Timer.repeat(fn, 1000, true);

    expect(fn).toHaveBeenCalled();

    jest.advanceTimersByTime(3000);

    expect(fn).toHaveBeenCalledTimes(4);
  });

  it('should be able to dispose all registered disposers', () => {
    const fn = jest.fn();

    const timer = new Timer();

    const disposer1 = timer.repeat(fn, 1000, true);
    const disposer2 = timer.repeat(fn, 1000);
    const disposer3 = timer.wait(fn, 1000);
    timer.repeat(fn, 1000, true);
    timer.repeat(fn, 1000);
    timer.wait(fn, 1000);

    expect(fn).toHaveBeenCalledTimes(2);

    disposer1();
    disposer2();
    disposer3();

    expect(timer['disposers'].size).toEqual(3);

    timer.flush();

    jest.advanceTimersByTime(3000);

    expect(fn).toHaveBeenCalledTimes(2);
  });
});
