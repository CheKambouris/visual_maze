import { Grid } from "./src/grid.js";
import { AnimationPlayer } from "./src/animationplayer.js";
import Graph from "./src/graph.js";


main();


function main() {
  /** @type {HTMLCanvasElement} */
  // @ts-ignore
  const canvas = document.getElementById("canvas");
  /** @type {CanvasRenderingContext2D} */
  // @ts-ignore
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = 10;
  ctx.lineCap = "square";
  ctx.translate(ctx.lineWidth / 2, ctx.lineWidth / 2);

  const grid = new Grid(canvas, { x: 5, y: 5 });
  
  const playpause = document.getElementById("play-pause");
  if (!playpause) {
    return
  }

  const player = new AnimationPlayer(grid, {interval: 50});
  loadPlayer(player, grid);
  
  player.onFinish = () => playpause.innerHTML = "Replay"
  // @ts-ignore
  playpause.onclick = (ev) => {
    switch (player.state) {
      case AnimationPlayer.state.STOPPED:
      case AnimationPlayer.state.PAUSED:
        player.play();
        playpause.innerHTML = "Playing..."
        break;
      case AnimationPlayer.state.PLAYING:
        player.pause();
        playpause.innerHTML = "Paused"
        break;
    }
  };
}

function loadPlayer(player, grid) {
  // @ts-ignore
  const algorithm = document.getElementById("algorithm-selector")?.value;
  switch (algorithm) {
    case "fill-walls":
      player.setNewAnimation(fillGridWithWalls(grid));
      break;
    default:
      break;
  }
}

/**
 * @param {Grid} grid
 */
function fillGridWithWalls(grid) {
  const wallPositions = new Array();
  for (const vertex of grid.vertices) {
    if (vertex.x < grid.size.x - 1) {
      wallPositions.push({ from: vertex, to: grid.getVertex({ x: vertex.x + 1, y: vertex.y }) });
    }
    if (vertex.y < grid.size.y - 1) {
      wallPositions.push({ from: vertex, to: grid.getVertex({ x: vertex.x, y: vertex.y + 1 }) });
    }
  }
  const changes = new Array();
  for (const wall of wallPositions) {
    changes.push({
      operation: AnimationPlayer.operations.ADDWALL,
      args: [wall], 
      debug: `Add a wall between ${JSON.stringify(wall.from)} and ${JSON.stringify(wall.to)}`});
  }
  return changes;
}