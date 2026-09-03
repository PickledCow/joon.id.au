import { Node } from "./node"
import { Main } from '../main'  

class TestNode extends Node {

  speed: number = 800;
  width: number = 24;
  length: number = 128;


  onDraw(delta: number): void {
    this.ctx.fillStyle = "gray";
    this.ctx.fillRect(-this.width/2, -this.length/2, this.width, this.length);
  }

  onTick(delta: number): void {
    if (this.inputMap.isKeyPressed('ArrowUp')) {
      this.position.y -= delta * this.speed;
    }

    if (this.inputMap.isKeyPressed('ArrowDown')) {
      this.position.y += delta * this.speed;
    }
    
    this.position.y = Math.min(Math.max(this.position.y, this.length/2), this.canvas.height - this.length/2);

    

    
  }

  constructor(main: Main) {super(main!)}
}

export { TestNode }

