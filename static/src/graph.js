export default class Graph {
  /** @type {Map<Vertex, Set<Vertex>>} */
  #adjList = new Map();

  get vertices() {
    return this.#adjList.keys();
  }
  get edges() {
    return this.#get_edges();
  }

  *#get_edges() {
    for (const [vertex, neighbours] of this.#adjList) {
      for (const neighbour of neighbours) {
        yield { from: vertex, to: neighbour };
      }
    }
  }

  adjacent({from, to}) {
    return this.#adjList.get(from)?.has(to) ?? false;
  }
  neighbours(vertex) {
    return this.#adjList.get(vertex);
  }
  addVertex(vertex) {
    const neighbours = this.neighbours(vertex);
    if(neighbours == undefined) {
      this.#adjList.set(vertex, new Set());
    } else {
      for (const neighbour of neighbours) {
        this.removeEdge({from: vertex, to: neighbour});
      }
    }
  }
  removeVertex(vertex) {
    const neighbours = this.neighbours(vertex);
    if (neighbours) {
      for (const neighbour of neighbours) {
        this.removeEdge({ from: vertex, to: neighbour });
      }
    }
    this.#adjList.delete(vertex);
  }
  addEdge({from, to}) {
    const edgesFrom = this.#adjList.get(from);
    const edgesTo = this.#adjList.get(to);
    if (edgesFrom && edgesTo) {
      edgesFrom.add(to);
      edgesTo.add(from);
    }
  }
  removeEdge({from, to}) {
    const edgesFrom = this.#adjList.get(from);
    edgesFrom?.delete(to);
    const edgesTo = this.#adjList.get(to);
    edgesTo?.delete(from);
  }
}