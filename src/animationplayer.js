export class AnimationPlayer {
  #grid;
  #actionList;
  #interval;
  #iteration = 0;
  #intervalID = 0;

  onFinish;

  get state() {
    if (this.#intervalID) {
      return AnimationPlayer.state.PLAYING;
    }
    if (this.#iteration >= this.#actionList.length) {
      return AnimationPlayer.state.STOPPED;
    }
    return AnimationPlayer.state.PAUSED;
  }

  static state = Object.freeze({
    PLAYING: Symbol("PLAYING"),
    PAUSED: Symbol("PAUSED"),
    STOPPED: Symbol("STOPPED"),
  });
  static operations = Object.freeze({
    ADDWALL: Symbol("ADDWALL"),
    REMOVEWALL: Symbol("REMOVEWALL"),
  });

  constructor(grid, {actionList = [], interval = 200, onFinish = ()=>{}}={}) {
    this.#grid = grid;
    this.#actionList = actionList;
    this.#interval = interval;
    this.onFinish = onFinish;
  }
  do(action) {
    switch (action.operation) {
      case AnimationPlayer.operations.ADDWALL:
        this.#grid.addWall(...action.args);
        break;
      case AnimationPlayer.operations.REMOVEWALL:
        this.#grid.removeWall(...action.args);
        break;
      default:
        console.error(`Unsupported action ${action.operation.toString()}`);
        break;
    }
  }
  nextStep() {
    if (this.#iteration >= this.#actionList.length) {
      clearInterval(this.#intervalID);
      this.#intervalID = 0;
      if (this.onFinish) this.onFinish();
      return;
    }
    const action = this.#actionList[this.#iteration++];
    this.do(action);
    console.log(action.debug);
  }
  play() {
    if (this.#iteration >= this.#actionList.length) {
      this.#intervalID = 0;
      this.#iteration = 0;
      this.#grid.reset();
    }
    if (!this.#intervalID) {
      this.#intervalID = setInterval(() => {
        this.nextStep();
      }, this.#interval);
    }
  }
  pause() {
    if (this.#intervalID) {
      clearInterval(this.#intervalID);
      this.#intervalID = 0;
    }
  }
  setNewAnimation(actionList) {
    clearInterval(this.#intervalID);
    this.#intervalID = 0;
    this.#iteration = 0;
    this.#actionList = actionList;
    this.#grid.reset();
  }
}