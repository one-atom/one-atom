import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

const root = document.getElementById('app');

function assert(something: any) {
  const txt = `${something} is working`;
  const node = document.createElement('p');
  node.innerHTML = txt;

  console.log(txt);
  root.append(node);
}

namespace A {
  export const a = 'Namespace';
}

ReactDOM.render(<Fragment>React is working</Fragment>, root);
assert(A.a);
