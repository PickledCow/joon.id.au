import { InputMap } from "./inputMap"
import { Node } from "./nodes/node"
import { TestNode } from "./nodes/testNode"
import { mat3 } from "gl-matrix"


const identity: mat3 = [
  1, 0, 0, 
  0, 1, 0, 
  0, 0, 1
];

class Main {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  tickInterval: number;

  tickRate: number = 50;
  lastTickTime: number;
  tickTime: number;

  inputMap: InputMap;
  root: Node;

  clearColor: string = "white";

  // Main physics loop, once every 10 ms or 100 hz
  tick(): void {
    this.inputMap.updateKeys();

    const delta = 1 / this.tickRate; // Fixed at 10 ms
    this.tickTime = performance.now();

    this.root._tick(delta);
  }

  // Main animation loop
  draw(): void {
    const t = performance.now();
    const delta = (t - this.lastTickTime) * 0.001; // In seconds
    const interp = (t - this.tickTime) * 0.001 * this.tickRate; // Progress through the physics tick to interpolate from
    // Clear for drawing again
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = this.clearColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Start drawing
    this.root._draw(delta, interp, identity);
    
    this.lastTickTime = t;

    requestAnimationFrame(this.draw.bind(this));
  }

  cleanUp() {
    this.inputMap.cleanUp();
    clearInterval(this.tickInterval);
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false })!; // Naughty

    canvas.width = 1280;
    canvas.height = 720;

    this.lastTickTime = performance.now();
    this.tickTime = performance.now();

    this.inputMap = new InputMap();

    this.root = new Node(this);
  
    this.draw(); // Start draw loop
    this.tickInterval = setInterval(this.tick.bind(this), 1000 / this.tickRate); // start physics loop
  }
}

export { Main }