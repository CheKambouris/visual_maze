import Graph from "./graph.js";

/** @typedef {any} defaultStyle */

export class Grid {
  /** @type {HTMLCanvasElement} */
  #canvas
  /** @type {CanvasRenderingContext2D} */
  #ctx
  /** @type {Vertex} */
  #size
  #squareSize

  #graph;

  constructor(canvas, size, defaultStyle = {}) {
    this.#canvas = canvas;
    this.#ctx = canvas.getContext("2d");
    this.#squareSize = Math.min(
      (this.#canvas.width - this.#ctx.lineWidth) / size.x,
      (this.#canvas.height - this.#ctx.lineWidth) / size.y
    );
    this.#size = size;
    this.#graph = new Graph(this.#size);
    this.#redraw();
  }
  
  #redraw() {
    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

    // Draw grey "template" walls
    this.#ctx.beginPath();
    this.#ctx.save();
    this.#ctx.strokeStyle = "#DCDCDC";
    for (let x = 1; x < this.#size.x; x++) {
      this.#ctx.moveTo(x * this.#squareSize, 0);
      this.#ctx.lineTo(x * this.#squareSize, this.#size.y * this.#squareSize);
    }
    for (let y = 1; y < this.#size.y; y++) {
      this.#ctx.moveTo(0, y * this.#squareSize);
      this.#ctx.lineTo(this.#size.x * this.#squareSize, y * this.#squareSize);
    }
    this.#ctx.stroke();
    this.#ctx.restore();

    // Draw walls
    this.#ctx.beginPath();
    for (const edge of this.#graph.edges) {
      this.#drawWall(edge);
    }
    this.#ctx.rect(0, 0, this.#canvas.width - this.#ctx.lineWidth, this.#canvas.height - this.#ctx.lineWidth);
    this.#ctx.stroke();
  }
  #drawWall({from, to}) {
    const diff = {
      x: to.x - from.x,
      y: to.y - from.y,
    };
    if (diff.x < 0 || diff.y < 0) {
      [from, to] = [to, from];
      diff.x = -diff.x;
      diff.y = -diff.y;
    }
    const x = (from.x + 1) * this.#squareSize;
    const y = (from.y + 1) * this.#squareSize;
    this.#ctx.moveTo(x, y);
    this.#ctx.lineTo(x - diff.y * this.#squareSize, y - diff.x * this.#squareSize);
  }

  get size() {
    return { x: this.#size.x, y: this.#size.y };
  }

  get vertices() {
    return this.#graph.vertices;
  }

  getVertex(vertex) { return this.#graph.getVertex(vertex); }
  
  addWall(edge) {
    this.#graph.addEdge(edge);
    this.#redraw();
  }
  removeWall(edge) {
    this.#graph.removeEdge(edge);
    this.#redraw();
  }
  styleEdge(edge, style) {
    throw new Error("Not implemented yet. ")
  }
  styleVertex(vertex, style) {
    this.#graph.getVertex(vertex).style = style;
  }
  reset() {
    for (const edge of this.#graph.edges) {
      this.#graph.removeEdge(edge);
    }
    this.#redraw();
  }
}