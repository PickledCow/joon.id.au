import { TestNode } from "./nodes/testNode"; 

export function setupCanvas(canvas: HTMLCanvasElement) {
  if (!canvas) return () => {};
  const ctx = canvas.getContext("2d");
  
  canvas.width = 1280;
  canvas.height = 720;

  let lt = performance.now();


  // Test
  


  // Main animation loop
  function draw() {
    if (!ctx) return;

    const t = performance.now();
    const delta = t - lt;

    // Clear for drawing again
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(draw);
  }

    


  draw();



  // Cleanup function to remove event listeners when component is destroyed
  return () => {
  };
}

