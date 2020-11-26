import ReactDOM from 'react-dom';
import AppExportDefault from './app_export_default';
import { AppExportNamed } from './app_export_named';
import * as c from './export_namespace_from';

const root = document.getElementById('app');

function assert_into_dom(something: unknown): void {
  const txt = `${something} is working`;
  const node = document.createElement('p');
  node.innerHTML = txt;
  root.append(node);
}

// Checks namespace support
namespace A {
  export const a = 'namespace';
  let b = 'reassign me';

  export function reassign_b(to: string): void {
    b = to;
  }

  export function get_b(): string {
    return b;
  }
}
assert_into_dom(A.a);
A.reassign_b('let namespace reassign');
assert_into_dom(A.get_b());

// Checks class support
class B {
  // To check @babel/proposal-class-properties
  public readonly proposal_class_properties = 'proposal class properties should work';
}
const b = new B();
assert_into_dom(b.proposal_class_properties);

// Checks numeric separators support
assert_into_dom(`numeric separators, example ${1_000_000}`);

// Checks numeric separators support
assert_into_dom(`export namespace from ${c.mod1} ${c.mod2}`);

// Checks nullish coalescing operator
assert_into_dom(`nullish coalescing ${null ?? 'operator'}`);

// Checks optional chaining
type WeirdObj = {
  prop_x?: {
    val: string;
  };
  prop_y?: {
    val: string;
  };
};
const weird_obj: WeirdObj = {
  prop_x: {
    val: 'optional',
  },
};
assert_into_dom(`nullish ${weird_obj.prop_x?.val} chaining`);

// Checks React support (default exported root)
ReactDOM.render(<AppExportDefault />, document.getElementById('react-root-1'));

// Checks React support (named exported root)
ReactDOM.render(<AppExportNamed />, document.getElementById('react-root-2'));
