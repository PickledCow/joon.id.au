import { Node } from "../../core/nodes/node"
import { Main } from '../../core/main'
import { Vector2 } from "$lib/reni/core/types/math";
import type { PhysicsServerItem } from "$lib/reni/core/physicsServer";
import { PongBall } from "./ball";

class PongPaddle extends Node {
  ball: PongBall | null = null;

  speed: number = 800;
  width: number = 20;
  length: number = 128;

  collisionBox: PhysicsServerItem | null = null;

  reset(): void {
    this.position.y = this.canvas.height / 2;
    this.teleport();
  }

  onDraw(delta: number): void {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(-this.width/2, -this.length/2, this.width, this.length);
  }

  onTick(delta: number): void {
    this.position.y = Math.min(Math.max(this.position.y, this.length/2), this.canvas.height - this.length/2);

    this.collisionBox!.rect.pos.x = this.position.x - this.width / 2;
    this.collisionBox!.rect.pos.y = this.position.y - this.length / 2;
    

    if (this.collisionBox!.collided) {
      this.ball!.bounce(this.position, this.width, this.length);
    }

    if (this.ball!.position.x < -this.ball!.width || this.ball!.position.x > this.canvas.width + this.ball!.width) {
      this.reset();
    }
  }

  constructor(main: Main) {
    super(main!)
    this.collisionBox = this.physicsServer.registerItem();
    this.collisionBox.rect.size.x = this.width;
    this.collisionBox.rect.size.y = this.length;
  }
}

export { PongPaddle }

