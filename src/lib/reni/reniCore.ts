import { Main } from "./core/main"


export function setupCanvas(canvas: HTMLCanvasElement) {
  if (!canvas) return () => { };

  const main = new Main(canvas, 60);

  // Cleanup function to remove event listeners when component is destroyed
  return () => { main.cleanUp() };
}

