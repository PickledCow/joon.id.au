import { Node } from "../../core/nodes/node"
import { Main } from '../../core/main'

class PongPlayer extends Node {

  speed: number = 800;
  width: number = 24;
  length: number = 128;

  onDraw(delta: number): void {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(-this.width/2, -this.length/2, this.width, this.length);
  }

  onTick(delta: number): void {
    if (this.inputMap.isKeyPressed('ArrowUp')) {
      this.position[1] -= delta * this.speed;
    }

    if (this.inputMap.isKeyPressed('ArrowDown')) {
      this.position[1] += delta * this.speed;
    }
    
    this.position[1] = Math.min(Math.max(this.position[1], this.length/2), this.canvas.height - this.length/2);


  }

  constructor(main: Main) {super(main!)}
}

export { PongPlayer }

