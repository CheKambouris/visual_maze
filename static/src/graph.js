export default class Graph {
  /** @type {Map<Number, Vertex>} */
  #vertices = new Map();
  #size;

  constructor(size) {
    this.#size = size;
    for (let y = 0; y < size.y; y++) {
      for (let x = 0; x < size.x; x++) {
        const vertex = { x: x, y: y, neighbours: new Set() };
        this.#vertices.set(this.#hashVertex(vertex), vertex);
      }
    }
  }

  get vertices() {
    return this.#vertices.values();
  }
  get edges() {
    const edges = [];
    const visited = new Set();
    for (const vertex of this.#vertices.values()) {
      for (const neighbour of vertex.neighbours) {
        if (visited.has(neighbour)) continue;
        edges.push({from: vertex, to: neighbour});
      }
      visited.add(vertex);
    }
    return edges;
  }

  #hashVertex({x, y}) { return x + y * this.#size.x; }

  getVertex(vertex) {
    return this.#vertices.get(this.#hashVertex(vertex));
  }
  adjacent({from, to}) {
    from = this.getVertex(from);
    to = this.getVertex(to);
    from.neighbours.has(to);
  }
  neighbours(vertex) {
    vertex = this.getVertex(vertex);
    return vertex.neighbours;
  }
  addEdge({from, to}) {
    from = this.getVertex(from);
    to = this.getVertex(to);

    from.neighbours.add(to);
    to.neighbours.add(from);
  }
  removeEdge({ from, to }) {
    from = this.getVertex(from);
    to = this.getVertex(to);

    from.neighbours.delete(to);
    to.neighbours.delete(from);
  }
}