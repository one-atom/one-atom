import { v4 as uuid } from 'uuid';
import { generate } from 'shortid';

export namespace Id {
  type Uuid = string;
  type Hash = string;

  export function v4(): Uuid {
    return uuid();
  }

  export function short(): Hash {
    return generate();
  }
}
