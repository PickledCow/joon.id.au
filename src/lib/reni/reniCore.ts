import { Main } from "./core/main"


export function setupCanvas(canvas: HTMLCanvasElement) {
  if (!canvas) return () => {};
  
  const main = new Main(canvas);

  // Cleanup function to remove event listeners when component is destroyed
  return () => { main.cleanUp() };
}

