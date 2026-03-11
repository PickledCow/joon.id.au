class RipplePoint {
  x: number = 0;
  y: number = 0;
  startTime: number = -10000000;
  constructor() {}

  ripple(newX: number, newY: number) {
    this.x = newX;
    this.y = newY;
    this.startTime = performance.now();
  }
}

export { RipplePoint };