import { Node } from "./node"
import { Main } from '../main'  

class CollisionBox extends Node {

  centered: boolean = true;

  onTick(delta: number): void {
  }

  constructor(main: Main) {
    super(main!);
    this.physicsServer.registerItem();
  }
}

export { CollisionBox }

4