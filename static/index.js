import { Grid } from "./src/grid.js";

main();


function main() {
  /** @type {HTMLCanvasElement} */
  // @ts-ignore
  const canvas = document.getElementById("canvas");
  drawTest(canvas);
}

/**
 * @param {HTMLCanvasElement} canvas
 */
function drawTest(canvas) {
  /** @type {CanvasRenderingContext2D} */
  // @ts-ignore
  const ctx = canvas.getContext("2d");
  
  ctx.lineWidth = 10;
  ctx.lineCap = "square";
  ctx.translate(ctx.lineWidth / 2, ctx.lineWidth / 2);

  const grid = new Grid(canvas, { x: 3, y: 3 });

  const wallPositions = new Array();
  for (const vertex of grid.vertices) {
    if (vertex.x < grid.size.x) {
      wallPositions.push({ from: vertex, to: grid.getVertex({ x: vertex.x + 1, y: vertex.y }) });
    }
    if (vertex.y < grid.size.y) {
      wallPositions.push({ from: vertex, to: grid.getVertex({ x: vertex.x, y: vertex.y + 1 }) });
    }
  }
  wallPositions.sort(() => Math.random() - 0.5);
  let i = 0;
  let building = true;
  const intervalID = setInterval(() => {
    if (i >= wallPositions.length) {
      i = 0;
      building = !building;
    }
    const wall = wallPositions[i++];
    if (building == true) {
      grid.addWall(wall);
    } else {
      grid.removeWall(wall);
    }
  }, 200);
}