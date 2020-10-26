import { Instantiation } from './instantiation';

class Node<T> {
  public readonly incoming = new Map<Instantiation.Token, Node<T>>();
  public readonly outgoing = new Map<Instantiation.Token, Node<T>>();

  constructor(public readonly data: T) {
    // Empty
  }
}

export class Graph<T> {
  private readonly nodes = new Map<Instantiation.Token, Node<T>>();

  constructor(private readonly lookup_fn: (dependency: T) => Instantiation.Token) {
    // Empty
  }

  public insertEdge(from: T, to: T): void {
    const from_node = this.lookup_or_insert_node(from);
    const to_node = this.lookup_or_insert_node(to);

    from_node.outgoing.set(this.lookup_fn(to), to_node);
    to_node.incoming.set(this.lookup_fn(from), from_node);
  }

  public lookup(key: Instantiation.Token): Node<T> | null {
    return this.nodes.get(key) ?? null;
  }

  public lookup_or_insert_node(data: T): Node<T> {
    const key = this.lookup_fn(data);
    let node = this.nodes.get(key);

    if (!node) {
      node = new Node(data);
      this.nodes.set(key, node);
    }

    return node;
  }

  public removeNode(key: Instantiation.Token): void {
    this.nodes.delete(key);

    for (const node of this.nodes.values()) {
      node.outgoing.delete(key);
      node.incoming.delete(key);
    }
  }

  public edges(): Node<T>[] {
    const nodes: Node<T>[] = [];
    for (const node of this.nodes.values()) {
      if (node.outgoing.size === 0) {
        nodes.push(node);
      }
    }

    return nodes;
  }

  public isEmpty(): boolean {
    return this.nodes.size === 0;
  }
}
