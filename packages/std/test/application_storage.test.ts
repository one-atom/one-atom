import { ApplicationStorage } from '../src/application_storage';

interface Typing {
  a: string;
  b: number;
  c: {};
}

describe('ApplicationStorage', () => {
  it('should create an instance with type', () => {
    const ls = new ApplicationStorage<Typing>('local');
    const ss = new ApplicationStorage<Typing>('session');

    expect(ls.get('a')).toBeNull();
    expect(ss.get('a')).toBeNull();

    ls.set('a', '123');
    ss.set('a', '123');

    expect(ls.get('a')).toEqual('123');
    expect(ss.get('a')).toEqual('123');
  });

  it('should create an instance with type', () => {
    const ls = new ApplicationStorage<Typing>('local');

    ls.set('a', '123');

    expect(ls.get('a')).toEqual('123');

    ls.remove_item('a');

    expect(ls.get('a')).toBeNull();
  });
});
