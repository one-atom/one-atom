import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

const root = document.getElementById('app');

function assert_into_dom(something: unknown) {
  const txt = `${something} is working`;
  const node = document.createElement('p');
  node.innerHTML = txt;
  root.append(node);
}

namespace A {
  export const a = 'namespace';
  export let b = 'reassign me';

  export function reassign_b(to: string): void {
    b = to;
  }
}

assert_into_dom(A.a);
A.reassign_b('let namespace reassign');
assert_into_dom(A.b);

ReactDOM.render(<Fragment>React is working</Fragment>, document.getElementById('react-root'));
