import { useState } from 'react';
import { Instantiation } from './instantiation';

export function use_service<T>(ctor: Instantiation.Ctor<T>): T {
  const [service] = useState(Instantiation.resolve(ctor));

  return service;
}
