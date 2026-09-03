import { Node } from "../../core/nodes/node"
import { Main } from '../../core/main'
import { Vector2 } from "$lib/reni/core/types/math";
import type { PhysicsServerItem } from "$lib/reni/core/physicsServer";
import { PongPaddle } from "./paddle";

class PongPlayer extends PongPaddle {
  onTick(delta: number): void {
    if (this.inputMap.isKeyPressed('ArrowUp')) {
      this.position.y -= delta * this.speed;
    }

    if (this.inputMap.isKeyPressed('ArrowDown')) {
      this.position.y += delta * this.speed;
    }

    super.onTick(delta);
  }

  constructor(main: Main) { super(main!) }
}

export { PongPlayer }

