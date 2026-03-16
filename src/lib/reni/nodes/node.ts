import { vec2, mat2, mat3 } from 'gl-matrix'

class Node {
  protected position: vec2 = [0, 0];
  protected rotation: number = 0;
  protected xform: mat3 = mat3.create();

  protected children: Node[] = [];
  protected childID: number = -1;

  // Util functions

  //
  protected _updateXformMatrix() {
    const rotMat: mat2 = [1, 0, 0, 1];
    mat2.rotate(rotMat, rotMat, this.rotation);
    this.xform = [
      rotMat[0], rotMat[1], this.position[0],
      rotMat[2], rotMat[3], this.position[1],
              0,         0,                1
    ]
  }

  // Setters
  setPosition(p: vec2) {
    this.position = p;
    this._updateXformMatrix();
  }

  setRotation(r: number) {
    this.rotation = r;
    this._updateXformMatrix();
  }


  // Getters
  getPosition(): vec2 {
    return this.position;
  }
  getRotation(): number {
    return this.rotation;
  }

  onTick(delta: number) {}
  onDraw(delta: number, parentXform: mat3) {
    const xform = mat3.create();
    mat3.multiply(xform, this.xform, parentXform);

    // Render children
    for (let i = 0; i < this.children.length; ++i) {
      let child = this.children[i];
      child.onDraw(delta, xform);
    }

  }

  constructor() {
    this._updateXformMatrix()
  }
}

export { Node };