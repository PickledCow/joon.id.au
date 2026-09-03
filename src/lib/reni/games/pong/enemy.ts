import { Node } from "../../core/nodes/node"
import { Main } from '../../core/main'
import { Vector2 } from "$lib/reni/core/types/math";
import type { PhysicsServerItem } from "$lib/reni/core/physicsServer";
import { PongPaddle } from "./paddle";

class PongEnemy extends PongPaddle {

  predictBallHeight(): number {
    const ball = this.ball!;
    const rawHeight = ball.position.y + (this.position.x - ball.position.x) * ball.direction.y / ball.direction.x + ball.width * 0.5;
    const modFactor = this.canvas.height * 2 - ball.width;
    let height = (rawHeight + modFactor) % modFactor;
    if (height > this.canvas.height - ball.width * 0.5) {
      height = this.canvas.height * 2 - height;
    }
    return height - ball.width * 0.5;
  }


  onTick(delta: number): void {
    const side = Math.sign(this.position.x - this.ball!.position.x);
    const coming = Math.sign(this.ball!.direction.x);

    const targetHeight = this.predictBallHeight() + Math.sin(this.ball!.speed * 9128345712) * this.length / 2;
    if (this.position.y - this.length * 0.25 + this.speed * delta > targetHeight) {
      this.position.y -= delta * this.speed;
    } else if (this.position.y + this.length * 0.25 - this.speed * delta < targetHeight) {
      this.position.y += delta * this.speed;
    }
    // this.position.y = targetHeight;

    super.onTick(delta);
  }

  constructor(main: Main) { 
    super(main!);
  }
}

export { PongEnemy }

