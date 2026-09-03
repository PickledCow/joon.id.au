import { Node } from "../../core/nodes/node"
import { Main } from '../../core/main'
import type { PhysicsServerItem } from "$lib/reni/core/physicsServer";
import { PongPaddle } from "./paddle";
import { Vector2 } from "$lib/reni/core/types/math";

class PongBall extends Node {

  speed: number = 1000;
  accel: number = 1.05;
  width: number = 28;
  direction: Vector2 = new Vector2(1, 0);

  collisionBox: PhysicsServerItem | null = null;

  reset(): void {
    this.position.x = this.canvas.width / 2;
    this.position.y = this.canvas.height / 2;
    this.speed = 500;
    this.direction.x = 1;
    this.direction.y = 0;
    this.direction.rotate(Math.PI * 0.75);
  }

  bounce(paddlePosition: Vector2, paddleWidth: number, paddleLength: number): void {
    const xDir = Math.sign(this.direction.x);
    const yDir = Math.sign(this.direction.y);
    const dev = -(paddlePosition.y - this.position.y) / paddleLength * 0.25;
    const rot = (paddlePosition.y - this.position.y) * 0.25 / 180;
    // this.direction.x = 1;
    // this.direction.y = 0;
    this.direction.rotate(Math.PI + (rot * xDir));
    this.direction.y *= -1;
    // this.direction.x *= -1; // Flip direction
    this.speed *= this.accel; // Accelerate ball
    const margin = (this.width + paddleWidth) / 2;
    this.position.x = paddlePosition.x + (margin * Math.sign(this.direction.x))
    // this.position.x += this.direction.x * this.speed * delta * 2; // Get it out of the paddle
  }

  onDraw(delta: number): void {
    this.ctx.beginPath();
    const angle = Math.atan2(this.direction.y, this.direction.x);
    const radius = this.width / 2;
    this.ctx.fillStyle = "#f00";
    this.ctx.arc(0, 0, radius, angle - Math.PI / 2, angle + Math.PI / 2);
    this.ctx.arc(
      -this.direction.x * this.speed * delta,
      -this.direction.y * this.speed * delta,
      radius, angle + Math.PI / 2,
      angle - Math.PI / 2
    );
    this.ctx.fill()
  }

  onTick(delta: number): void {
    // Game reset when past screen edge
    if (this.position.x < -this.width || this.position.x > this.canvas.width + this.width) {
      this.reset();
      this.teleport();
    }

    this.position.x += this.direction.x * this.speed * delta;
    this.position.y += this.direction.y * this.speed * delta;

    // Top and bottom bounce
    if (this.position.y < this.width * 0.5) {
      this.direction.y *= -1;
      this.position.y = this.width - this.position.y;
    }
    if (this.position.y > this.canvas.height - this.width * 0.5) {
      this.direction.y *= -1;
      this.position.y = 2 * this.canvas.height - this.width - this.position.y;
    }


    this.collisionBox!.rect.pos.x = this.position.x - this.width * 0.5;
    this.collisionBox!.rect.pos.y = this.position.y - this.width * 0.5;

  }

  constructor(main: Main) {
    super(main!);

    this.collisionBox = this.physicsServer.registerItem();
    this.collisionBox.rect.size.x = this.width;
    this.collisionBox.rect.size.y = this.width;
    this.reset();
  }
}

export { PongBall }

