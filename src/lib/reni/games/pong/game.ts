import { Main } from "../../core/main"
import { PongPlayer } from "./player"
import { PongEnemy } from "./enemy"
import { PongBall } from "./ball"

export function setupCanvas(canvas: HTMLCanvasElement) {
  if (!canvas) return () => {};
  
  const main = new Main(canvas);
  
  main.clearColor = "black";

  const player = new PongPlayer(main);
  player.position[0] = 100;
  player.position[1] = canvas.height / 2;
  main.root.addChild(player);  

  const enemy = new PongEnemy(main);
  enemy.position[0] = canvas.width - 100;
  enemy.position[1] = canvas.height / 2;
  main.root.addChild(enemy);  

  const ball = new PongBall(main);
  ball.position[0] = canvas.width / 2;
  ball.position[1] = canvas.height / 2;
  main.root.addChild(ball);  

  // Cleanup function to remove event listeners when component is destroyed
  return () => { main.cleanUp() };
}

