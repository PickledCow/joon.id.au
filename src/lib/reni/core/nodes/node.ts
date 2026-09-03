import { mat2, mat3 } from 'gl-matrix'
import { InputMap } from '../inputMap'
import { Main } from '../main'
import { Vector2 } from '../types/math';
import type { PhysicsServer } from '../physicsServer';

class Node {
  position: Vector2 = new Vector2();
  rotation: number = 0;

  protected prevPosition: Vector2 = new Vector2();
  protected prevRotation: number = 0;

  protected parent: Node | null = null;
  protected children: Node[] = [];
  protected childID: number = -1;

  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected inputMap: InputMap; 
  protected physicsServer: PhysicsServer;

  // Setters and other methods
  addChild(c: Node) {
    c.childID = this.children.length;
    c.parent = this;
    this.children.push(c);
  }

  teleport() {
    this.prevPosition.x = this.position.x;
    this.prevPosition.y = this.position.y;
    this.prevRotation = this.rotation;
  }


  // For this node
  onTick(delta: number): void {}
  onDraw(delta: number): void {}
  

  // Core functions

  // Tick
  _tick(delta: number): void {
    // Update interp points
    this.teleport();

    this.onTick(delta);

    // Physics children
    for (let i = 0; i < this.children.length; ++i) {
      let child = this.children[i];
      child._tick(delta);
    }
  }

  _draw(delta: number, interp: number, parentXform: mat3): void {
    const rotMat: mat2 = [1, 0, 0, 1];
    mat2.rotate(rotMat, rotMat, this.rotation * interp + this.prevRotation * (1 - interp));

    const xform: mat3 = [
      rotMat[0], rotMat[1], this.position.x * interp + this.prevPosition.x * (1 - interp),
      rotMat[2], rotMat[3], this.position.y * interp + this.prevPosition.y * (1 - interp),
              0,         0,                1
    ]

    mat3.multiply(xform, xform, parentXform);

    // Set transform and call custom render function
    this.ctx.setTransform(xform[0], xform[3], xform[1], xform[4], xform[2], xform[5]); // Why are you like this
    this.ctx.beginPath();
    this.onDraw(delta);

    // Render children
    for (let i = 0; i < this.children.length; ++i) {
      let child = this.children[i];
      child._draw(delta, interp, xform);
    }
  }

  constructor(main: Main) {
    this.canvas = main.canvas;
    this.ctx = main.ctx; // I *promise* this won't ever go wrong
    this.inputMap = main.inputMap;
    this.physicsServer = main.physicsServer;
  }
}

export { Node };