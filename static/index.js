import { Grid } from "./src/grid.js";

let iterationPlayer = {
  intervalID: 0,
  interval: 200,
  iteration: 0,
  actionList: new Array(),
  do(action) {
    if (action.operation == actions.ADDWALL) {
      this.grid.addWall(...action.args);
    }
  },
  nextStep() {
    if (this.iteration >= this.actionList.length) {
      clearInterval(this.intervalID);
      return;
    }
    const action = this.actionList[this.iteration++];
    this.do(action);
    console.log(action.debug);
  },
  toggleIterationPlayer() {
    if (this.actionList.length == 0) {
      this.actionList = randomlyGenerateWalls(this.grid);
    }
    if (this.iteration >= this.actionList.length) {
      this.intervalID = 0;
      this.iteration = 0;
      this.grid.reset();
    }
    if (this.intervalID) {
      clearInterval(this.intervalID);
      this.intervalID = 0;
    } else {
      this.intervalID = setInterval(() => {
        this.nextStep();
      }, this.interval);
    }
  }
}

let actions = Object.freeze({
  ADDWALL: Symbol("ADDWALL"),
})

main();

function main() {
  /** @type {HTMLCanvasElement} */
  // @ts-ignore
  const canvas = document.getElementById("canvas");
  const playpause = document.getElementById("play-pause");

  /** @type {CanvasRenderingContext2D} */
  // @ts-ignore
  const ctx = canvas.getContext("2d");

  ctx.lineWidth = 10;
  ctx.lineCap = "square";
  ctx.translate(ctx.lineWidth / 2, ctx.lineWidth / 2);

  iterationPlayer.grid = new Grid(canvas, { x: 3, y: 3 });
  // @ts-ignore
  playpause.onclick = (ev) => iterationPlayer.toggleIterationPlayer();
  // drawTest(grid);
}

/**
 * @param {Grid} grid
 */

function randomlyGenerateWalls(grid) {
  const wallPositions = new Array();
  for (const vertex of grid.vertices) {
    if (vertex.x < grid.size.x - 1) {
      wallPositions.push({ from: vertex, to: grid.getVertex({ x: vertex.x + 1, y: vertex.y }) });
    }
    if (vertex.y < grid.size.y - 1) {
      wallPositions.push({ from: vertex, to: grid.getVertex({ x: vertex.x, y: vertex.y + 1 }) });
    }
  }
  wallPositions.sort(() => Math.random() - 0.5);
  const changes = new Array();
  for (const wall of wallPositions) {
    changes.push({
      operation: actions.ADDWALL, 
      args: [wall], 
      debug: `Add a wall between ${JSON.stringify(wall.from)} and ${JSON.stringify(wall.to)}`});
  }
  return changes;
}