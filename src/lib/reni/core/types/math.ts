class Vector2 {
  x: number;
  y: number

  rotate(theta: number): void {
    const newX = this.x * Math.cos(theta) - this.y * Math.sin(theta);
    const newY = this.x * Math.sin(theta) + this.y * Math.cos(theta);
    this.x = newX;
    this.y = newY;
  }

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
}

class Rect2 {
  pos: Vector2;
  size: Vector2;

  constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
    this.pos = new Vector2(x, y);
    this.size = new Vector2(w, h);
  }
  
}

export { Vector2, Rect2 }