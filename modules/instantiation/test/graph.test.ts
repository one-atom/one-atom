import { Graph } from '../_graph';

describe('graph', () => {
  interface Data {
    id: symbol;
  }

  it('x', () => {
    const graph = new Graph<Data>((x) => x.id);
  });
});
