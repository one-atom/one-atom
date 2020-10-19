class Node<T> {
  public readonly incoming = new Map<symbol, Node<T>>();
  public readonly outgoing = new Map<symbol, Node<T>>();

  constructor(public readonly data: T) {
    // Empty
  }
}

export class Graph<T> {
  private readonly nodes = new Map<symbol, Node<T>>();

  constructor(private readonly lookup_fn: (dependency: T) => symbol) {
    // Empty
  }

  public insert_edge(from: T, to: T): void {
    const from_node = this.lookup_or_insert_node(from);
    const to_node = this.lookup_or_insert_node(to);

    from_node.outgoing.set(this.lookup_fn(to), to_node);
    to_node.incoming.set(this.lookup_fn(from), from_node);
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

  public remove_node(key: symbol): void {
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

  public is_empty(): boolean {
    return this.nodes.size === 0;
  }
}
