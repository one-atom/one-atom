function meta<T extends object>(target: T): T {
  const handler = {
    set() {
      debugger;

      throw new Error(`EMPTY_${target instanceof Array ? 'ARRAY' : 'OBJ'} was modified at runtime`);
    },
  };

  return new Proxy(target, handler);
}

// @ts-ignore
export const EMPTY_OBJ = process?.env?.NODE_ENV === 'development' ? meta({}) : {};

// @ts-ignore
export const EMPTY_ARRAY = process?.env?.NODE_ENV === 'development' ? meta([]) : [];
