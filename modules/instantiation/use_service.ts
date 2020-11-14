import { useState } from 'react';
import { Instantiation } from './instantiation';

/**
 * Returns an instance, during the process all of its dependencies will also be created.
 */
export function useService<T>(ctor: Instantiation.Ctor<T>): T {
  const [service] = useState(() => Instantiation.resolve(ctor));

  return service;
}
