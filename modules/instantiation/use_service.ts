import { useEffect, useRef, useState } from 'react';
import { Instantiation } from './instantiation';

/**
 * Returns an instance, during the process all of its dependencies will also be created.
 */
export function useService<T>(ctor: Instantiation.Ctor<T>): T {
  const ref = useRef<Instantiation.Ctor<T>>(ctor);
  const [service, setService] = useState(() => Instantiation.resolve(ctor));

  useEffect(() => {
    if (ref.current !== ctor) {
      ref.current = ctor;
      setService(() => Instantiation.resolve(ctor));
    }
  }, [ctor]);

  return service;
}
