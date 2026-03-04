import { get } from "svelte/store";

class RipplePoint {
  x: number;
  y: number;
  startTime: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.startTime = performance.now();
  }
}

export function setupCanvas(canvas: HTMLCanvasElement) {
  if (!canvas) return () => {};

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;

  function resize() {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function clear() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
  }

  // State for ripple points and mouse position
  let ripplePoints: RipplePoint[] = [];
  let mouseX = 0;
  let mouseY = 0;

  // Track mouse position
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Add ripple points on click to a max of 5 active ripples, removing the oldest if necessary
  document.addEventListener("click", (e) => {
    ripplePoints.push(new RipplePoint(e.clientX, e.clientY));
    if (ripplePoints.length > 5) {
      ripplePoints.shift();
    }
  });

  // Clear ripple points that have decayed (after 3 seconds)
  function cleanupRipples() {
    const now = performance.now();
    ripplePoints = ripplePoints.filter(rp => now - rp.startTime < 3000);
  }

  // Compute a ripple (wave) displacement originating from the last click
  function computeRipple(x: number, y: number, maxDistance: number, amplitude: number, ripplePoint: RipplePoint) {
    const now = performance.now();
    const dt = (now - ripplePoint.startTime) / 1000; // seconds since click
    if (dt < 0) return { x: 0, y: 0 };

    const dx = x - ripplePoint.x;
    const dy = y - ripplePoint.y;
    let r = Math.sqrt(dx * dx + dy * dy);
    if (r < 0.001) r = 0.001; // prevent division by zero
    if (r > maxDistance) return { x: 0, y: 0 };

    // ripple parameters
    const waveSpeed = 400; // px/sec — how fast the wavefront travels
    const wavelength = 120; // px — distance between peaks
    const decay = 1.5; // temporal decay rate

    // phase: wavefront at distance = waveSpeed * dt
    const phase = (r - waveSpeed * dt) / wavelength;
    // amplitude envelope: fades with distance and time
    const spatialEnv = Math.max(0, 1 - r / maxDistance);
    const temporalEnv = Math.exp(-dt * decay);

    // sinusoidal ripple; negative/positive pushes/pulls along radial direction
    const wave = Math.sin(phase * Math.PI * 2) - 0.75; // shift to ripple outwards more
    const disp = wave * amplitude * spatialEnv * temporalEnv;

    // radial direction (from click center outward)
    const nx = dx / (r || 1);
    const ny = dy / (r || 1);

    return { x: nx * disp, y: ny * disp };
  }

  // Calclate displacement at a point from ripples and return total displacement vector
  function getDisplacement(x: number, y: number, distortionDistance: number, rippleDistance: number, distortionStrength: number, rippleStrength: number) {
    // mouse distortion (repulsion from cursor)
    const minDistortion = 50;
    const dx = x - mouseX;
    const dy = y - mouseY;
    let distance = Math.sqrt(dx * dx + dy * dy) + minDistortion;
    if (distance < minDistortion) distance = minDistortion; // prevent division by zero
    let influence = Math.max(0, 1 - distance / distortionDistance);
    if (distance > distortionDistance) influence = 0; 

    // displacement to return (adds a wave that radiates outward)
    let rx = (dx / distance) * influence * distortionStrength;;
    let ry = (dy / distance) * influence * distortionStrength;;

    for (let ripplePoint of ripplePoints) {
      const ripple = computeRipple(x, y, rippleDistance, rippleStrength, ripplePoint);
      rx += ripple.x;
      ry += ripple.y;
    }

    return {
      x: rx,
      y: ry
    };
  }

  // Draw a line from (startX, startY) to (endX, endY) with curvature based on displacement
  function drawCurvedLine(startX: number, startY: number, endX: number, endY: number, distortionDistance: number, rippleDistance: number, distortionStrength: number, rippleStrength: number, lineColor: string, segments: number) {
    if (!ctx) return;

    const startDisplaced = getDisplacement(startX, startY, distortionDistance, rippleDistance, distortionStrength, rippleStrength);

    ctx.beginPath();
    ctx.moveTo(startX - startDisplaced.x, startY - startDisplaced.y);

    for (let i = 0; i <= 1; i += 1 / segments) {
      const neighbourX = startX + (endX - startX) * i;
      const neighbourY = startY + (endY - startY) * i;
      const displacement = getDisplacement(neighbourX, neighbourY, distortionDistance, rippleDistance, distortionStrength, rippleStrength);
      
      ctx.lineTo(neighbourX - displacement.x, neighbourY - displacement.y);
    }

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Draw a grid of dots and lines, with curvature based on displacement
  function drawDotGridLine() {
    if (!ctx) return;
    const spacing = 50;
    const lineSegments = 10; // Number of segments for smoother curves
    const distortionStrength = 50;
    const rippleStrength = 10;
    const distortionDistance = 200; // Max distance for mouse influence
    const rippleDistance = 750; // Max distance for influence
    const dotColor = 'hsl(210, 100%, 60%)';
    const lineColor = 'hsla(210, 10%, 50%, 0.25)';

    for (let x = -spacing; x < width; x += spacing) {
      for (let y = -spacing; y < height; y += spacing) {
        // Get displaced position for the current dot
        const displaced = getDisplacement(x, y, distortionDistance, rippleDistance, distortionStrength, rippleStrength);

        // Draw lines
        drawCurvedLine(x, y, x + spacing, y, distortionDistance, rippleDistance, distortionStrength, rippleStrength, lineColor, lineSegments);
        drawCurvedLine(x, y, x, y + spacing, distortionDistance, rippleDistance, distortionStrength, rippleStrength, lineColor, lineSegments);

        // Draw dots above grid
        ctx.beginPath();
        ctx.arc(x - displaced.x, y - displaced.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();

      }
    }
  }

  // Main animation loop
  function draw() {
    if (!ctx) return;

    clear();
    
    drawDotGridLine();

    cleanupRipples();

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();

  // Cleanup function to remove event listeners when component is destroyed
  return () => {
    window.removeEventListener('resize', resize);
    document.removeEventListener("mousemove", () => {});
    document.removeEventListener("click", () => {});
  };
}
